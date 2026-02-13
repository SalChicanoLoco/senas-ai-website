
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

  // Member Counter - Fetch and display member count
  (function() {
    const memberCountEl = document.getElementById('memberCount');
    if (!memberCountEl) return;
    
    // Check localStorage cache (1 hour TTL)
    const CACHE_KEY = 'nm_socialists_member_count';
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms
    
    function getCachedCount() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;
        
        if (age < CACHE_TTL) {
          return data.count;
        }
      } catch (e) {
        console.error('Cache read error:', e);
      }
      return null;
    }
    
    function setCachedCount(count) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          count: count,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Cache write error:', e);
      }
    }
    
    function animateCount(target) {
      const duration = 2000; // 2 seconds
      const start = 0;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        memberCountEl.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          memberCountEl.textContent = target;
        }
      }
      
      requestAnimationFrame(update);
    }
    
    // Try cache first
    const cachedCount = getCachedCount();
    if (cachedCount !== null) {
      animateCount(cachedCount);
    }
    
    // Fetch fresh count
    fetch('/api/get-member-count.php')
      .then(response => response.json())
      .then(data => {
        if (data.success && typeof data.count === 'number') {
          setCachedCount(data.count);
          if (cachedCount === null) {
            // Only animate if we didn't show cached version
            animateCount(data.count);
          } else if (data.count !== cachedCount) {
            // Update if count changed
            memberCountEl.textContent = data.count;
          }
        } else {
          throw new Error('Invalid response');
        }
      })
      .catch(error => {
        console.error('Failed to fetch member count:', error);
        if (cachedCount === null) {
          memberCountEl.textContent = '--';
        }
      });
  })();
});
