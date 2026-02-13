
// main.js
// Configuration
const FORM_SUBMIT_URL = 'submit-form.php';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("join-form");
  const statusEl = document.getElementById("join-status");
  const fbShareLink = document.getElementById("fb-share-link");

  // Build Facebook share link for the whole site
  if (fbShareLink) {
    const siteUrl = window.location.href.split('#')[0];
    const shareUrl = new URL("https://www.facebook.com/sharer/sharer.php");
    shareUrl.searchParams.set("u", siteUrl);
    fbShareLink.href = shareUrl.toString();
  }

  // Handle form submission via AJAX to PHP backend
  if (form && statusEl) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Disable submit button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting... / Enviando...';
      statusEl.textContent = "";
      statusEl.style.color = "";

      const formData = new FormData(form);

      fetch(FORM_SUBMIT_URL, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            statusEl.textContent = data.message;
            statusEl.style.color = "#77e89f";
            form.reset();
          } else {
            statusEl.textContent = data.message;
            statusEl.style.color = "#ffb3b3";
          }
        })
        .catch(error => {
          console.error("Form submission error:", error);
          statusEl.textContent = 'Error. Please email us directly at xava@newmexicosocialists.org';
          statusEl.style.color = "#ffb3b3";
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }

  // Meme modal + per-meme share/download
  const modal = document.getElementById("meme-modal");
  const modalImg = document.getElementById("meme-modal-img");
  const modalDownload = document.getElementById("meme-download");
  const modalShare = document.getElementById("meme-share");
  const modalCopy = document.getElementById("meme-copy-link");
  const modalCopyStatus = document.getElementById("meme-copy-status");
  const modalClose = document.querySelector(".meme-modal-close");
  const modalBackdrop = document.querySelector(".meme-modal-backdrop");

  function getAbsoluteUrl(relativePath) {
    const loc = window.location;
    const basePath = loc.pathname.replace(/index\.html$/, "");
    return loc.origin + basePath + relativePath;
  }

  function openMemeModal(imgPath) {
    const absolute = getAbsoluteUrl(imgPath);
    modalImg.src = imgPath;
    modalDownload.href = imgPath;
    modalShare.dataset.shareUrl = absolute;
    modalCopy.dataset.copyUrl = absolute;
    modalCopyStatus.textContent = "";
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeMemeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }

  document.querySelectorAll(".js-view-meme").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgPath = btn.getAttribute("data-img");
      openMemeModal(imgPath);
    });
  });

  document.querySelectorAll(".js-share-meme").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgPath = btn.getAttribute("data-img");
      const absolute = getAbsoluteUrl(imgPath);
      const shareUrl = new URL("https://www.facebook.com/sharer/sharer.php");
      shareUrl.searchParams.set("u", absolute);
      window.open(shareUrl.toString(), "_blank", "noopener");
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeMemeModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeMemeModal);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeMemeModal();
    }
  });

  if (modalShare) {
    modalShare.addEventListener("click", () => {
      const url = modalShare.dataset.shareUrl;
      if (!url) return;
      const shareUrl = new URL("https://www.facebook.com/sharer/sharer.php");
      shareUrl.searchParams.set("u", url);
      window.open(shareUrl.toString(), "_blank", "noopener");
    });
  }

  if (modalCopy) {
    modalCopy.addEventListener("click", async () => {
      const url = modalCopy.dataset.copyUrl;
      if (!url) return;
      try {
        await navigator.clipboard.writeText(url);
        modalCopyStatus.textContent = "Link copied! / ¡Enlace copiado!";
        modalCopyStatus.style.color = "#77e89f";
      } catch (err) {
        console.error("Clipboard error:", err);
        modalCopyStatus.textContent =
          "Couldn't copy link. / No se pudo copiar el enlace.";
        modalCopyStatus.style.color = "#ffb3b3";
      }
    });
  }

  // Also allow clicking the thumbnail image itself to open the modal
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener("click", () => {
      const src = img.getAttribute("src");
      openMemeModal(src);
    });
  });

  // Member counter functionality
  const memberCountEl = document.getElementById("memberCount");
  const MEMBER_COUNT_URL = '/api/get-member-count.php';
  const CACHE_KEY = 'memberCount';
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Animate count from 0 to target with easing
   */
  function animateCount(element, target) {
    const duration = 1500; // 1.5 seconds
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(start + (target - start) * easeProgress);
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString();
      }
    }
    
    requestAnimationFrame(update);
  }

  /**
   * Fetch member count from API or cache
   */
  async function fetchMemberCount() {
    if (!memberCountEl) return;
    
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();
        
        // Use cached data if less than or equal to 1 hour old
        if (now - data.timestamp <= CACHE_DURATION) {
          animateCount(memberCountEl, data.count);
          return;
        }
      }
      
      // Fetch from API
      const response = await fetch(MEMBER_COUNT_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch member count');
      }
      
      const result = await response.json();
      
      if (result.success && typeof result.count === 'number') {
        // Cache the result
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          count: result.count,
          timestamp: Date.now()
        }));
        
        // Animate the count
        animateCount(memberCountEl, result.count);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching member count:', error);
      // Display fallback text
      memberCountEl.textContent = '---';
      memberCountEl.style.opacity = '0.5';
    }
  }

  // Fetch member count on page load
  fetchMemberCount();
});
