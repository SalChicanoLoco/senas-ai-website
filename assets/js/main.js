// main.js - Modernized with Canvas Meme Generator & direct Facebook Page Auto-Posting

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

  // Helper for Netlify AJAX submissions
  function encode(data) {
    return Object.keys(data)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  }

  if (form && statusEl) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      statusEl.textContent = "Sending / Enviando...";
      statusEl.style.color = "#f6c745";

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });

      // Save submission locally in portal cache for offline testing convenience!
      try {
        const cachedSubmissions = JSON.parse(localStorage.getItem("local_comrade_submissions") || "[]");
        cachedSubmissions.push({
          name: payload.name,
          email: payload.email,
          city: payload.city,
          language: payload.language,
          interests: payload.interests,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem("local_comrade_submissions", JSON.stringify(cachedSubmissions));
      } catch (err) {
        console.error("Local caching error:", err);
      }

      // Try Cloudflare Pages / Workers API POST first
      try {
        const response = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.status === 404) {
          // Worker not present (Standard Static Host fallback, e.g. Netlify)
          throw new Error("API not found, falling back to static post");
        }

        const result = await response.json();
        if (response.ok) {
          statusEl.textContent = "Thanks for signing up! ¡Gracias por unirte!";
          statusEl.style.color = "#77e89f";
          form.reset();
          return;
        } else {
          throw new Error(result.error || "Submission rejected");
        }
      } catch (err) {
        console.log("Cloudflare Worker not detected or errored, attempting Netlify Fallback: ", err.message);

        // Fallback to Netlify Forms POST
        payload["form-name"] = form.getAttribute("name");
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode(payload),
        })
          .then(() => {
            statusEl.textContent = "Thanks for signing up! ¡Gracias por unirte!";
            statusEl.style.color = "#77e89f";
            form.reset();
          })
          .catch((error) => {
            console.error("Netlify fallback form submission error:", error);
            statusEl.textContent = "Error sending form. Please try again / Por favor intenta de nuevo.";
            statusEl.style.color = "#ffb3b3";
          });
      }
    });
  }

  // Meme modal elements
  const modal = document.getElementById("meme-modal");
  const modalImg = document.getElementById("meme-modal-img");
  const modalDownload = document.getElementById("meme-download");
  const modalShare = document.getElementById("meme-share");
  const modalCopy = document.getElementById("meme-copy-link");
  const modalCopyStatus = document.getElementById("meme-copy-status");
  const modalClose = document.querySelector(".meme-modal-close");
  const modalBackdrop = document.querySelector(".meme-modal-backdrop");

  // Dynamic Meme Generator Elements (Canvas Integration)
  const canvasContainer = document.getElementById("canvas-container");
  const memeCanvas = document.getElementById("meme-canvas");
  const memeTopText = document.getElementById("meme-top-text");
  const memeBottomText = document.getElementById("meme-bottom-text");
  const memeFontSize = document.getElementById("meme-font-size");
  const memeColor = document.getElementById("meme-color");
  const fbPostBtn = document.getElementById("fb-post-btn");
  const fbSettingsBtn = document.getElementById("fb-settings-btn");
  const fbPostStatus = document.getElementById("fb-post-status");

  let activeTemplateSrc = "";

  function getAbsoluteUrl(relativePath) {
    const loc = window.location;
    const basePath = loc.pathname.replace(/index\.html$/, "");
    return loc.origin + basePath + relativePath;
  }

  // Redraw Canvas meme with live inputs
  function redrawMeme() {
    if (!memeCanvas || !activeTemplateSrc) return;
    const ctx = memeCanvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = activeTemplateSrc;

    img.onload = () => {
      // Set canvas size matching the image
      memeCanvas.width = img.naturalWidth || 600;
      memeCanvas.height = img.naturalHeight || 600;

      // Draw base image
      ctx.drawImage(img, 0, 0, memeCanvas.width, memeCanvas.height);

      // Text styling setup
      const txtColor = memeColor ? memeColor.value : "#ffffff";
      const fSizeFactor = memeFontSize ? parseInt(memeFontSize.value) / 100 : 0.08;
      const finalFontSize = Math.floor(memeCanvas.width * fSizeFactor);

      ctx.fillStyle = txtColor;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(memeCanvas.width * 0.01, 4);
      ctx.textAlign = "center";
      ctx.font = `900 ${finalFontSize}px "Impact", "Syne", "Barlow Condensed", sans-serif`;

      // Draw Top Text
      if (memeTopText && memeTopText.value) {
        ctx.textBaseline = "top";
        const y = memeCanvas.height * 0.05;
        const x = memeCanvas.width / 2;
        ctx.fillText(memeTopText.value.toUpperCase(), x, y, memeCanvas.width * 0.9);
        ctx.strokeText(memeTopText.value.toUpperCase(), x, y, memeCanvas.width * 0.9);
      }

      // Draw Bottom Text
      if (memeBottomText && memeBottomText.value) {
        ctx.textBaseline = "bottom";
        const y = memeCanvas.height * 0.95;
        const x = memeCanvas.width / 2;
        ctx.fillText(memeBottomText.value.toUpperCase(), x, y, memeCanvas.width * 0.9);
        ctx.strokeText(memeBottomText.value.toUpperCase(), x, y, memeCanvas.width * 0.9);
      }

      // Update download link as canvas data
      try {
        modalDownload.href = memeCanvas.toDataURL("image/png");
      } catch (e) {
        // Tainted canvas fallback if direct cross-origin fails
        modalDownload.href = activeTemplateSrc;
      }
    };
  }

  // Hook generator inputs
  if (memeTopText) memeTopText.addEventListener("input", redrawMeme);
  if (memeBottomText) memeBottomText.addEventListener("input", redrawMeme);
  if (memeFontSize) memeFontSize.addEventListener("input", redrawMeme);
  if (memeColor) memeColor.addEventListener("input", redrawMeme);

  function openMemeModal(imgPath) {
    activeTemplateSrc = imgPath;
    const absolute = getAbsoluteUrl(imgPath);
    
    if (modalImg) modalImg.src = imgPath;
    modalDownload.href = imgPath;
    modalShare.dataset.shareUrl = absolute;
    modalCopy.dataset.copyUrl = absolute;
    modalCopyStatus.textContent = "";
    if (fbPostStatus) fbPostStatus.textContent = "";

    // Reset inputs
    if (memeTopText) memeTopText.value = "";
    if (memeBottomText) memeBottomText.value = "";
    if (memeFontSize) memeFontSize.value = "8";
    if (memeColor) memeColor.value = "#ffffff";

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    // Initialize canvas drawing
    setTimeout(redrawMeme, 50);
  }

  function closeMemeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    if (modalImg) modalImg.src = "";
    activeTemplateSrc = "";
  }

  // Open on button click
  document.querySelectorAll(".js-view-meme").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgPath = btn.getAttribute("data-img");
      openMemeModal(imgPath);
    });
  });

  // Share template directly
  document.querySelectorAll(".js-share-meme").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgPath = btn.getAttribute("data-img");
      const absolute = getAbsoluteUrl(imgPath);
      const shareUrl = new URL("https://www.facebook.com/sharer/sharer.php");
      shareUrl.searchParams.set("u", absolute);
      window.open(shareUrl.toString(), "_blank", "noopener");
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeMemeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeMemeModal);
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
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
        modalCopyStatus.textContent = "Couldn't copy link. / No se pudo copiar.";
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

  // ── FB AUTO-POSTER CORE INTEGRATION ──
  if (fbPostBtn) {
    fbPostBtn.addEventListener("click", async () => {
      if (!memeCanvas) return;
      fbPostStatus.textContent = "Posting to Facebook... / Publicando...";
      fbPostStatus.style.color = "#f6c745";

      const token = localStorage.getItem("fb_page_access_token");
      const pageId = localStorage.getItem("fb_page_id");

      if (!token || !pageId) {
        fbPostStatus.textContent = "Error: FB credentials not configured. Setup in Settings below! / Credenciales no configuradas.";
        fbPostStatus.style.color = "#ffb3b3";
        return;
      }

      try {
        // Convert canvas drawing to blob
        memeCanvas.toBlob(async (blob) => {
          if (!blob) {
            fbPostStatus.textContent = "Canvas rendering error. / Error de renderizado.";
            fbPostStatus.style.color = "#ffb3b3";
            return;
          }

          const formData = new FormData();
          formData.append("access_token", token);
          formData.append("source", blob);
          
          let captionText = "✊ Posted via NM Socialists Comrade Portal!\n";
          if (memeTopText && memeTopText.value) captionText += `\n"${memeTopText.value.toUpperCase()}"`;
          if (memeBottomText && memeBottomText.value) captionText += `\n"${memeBottomText.value.toUpperCase()}"`;
          captionText += "\n\nJoin the movement at newmexicosocialists.com";
          
          formData.append("message", captionText);

          const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
            method: "POST",
            body: formData,
          });

          const result = await res.json();

          if (result.post_id || result.id) {
            fbPostStatus.textContent = "Posted successfully to Facebook! ✊ / ¡Publicado con éxito!";
            fbPostStatus.style.color = "#77e89f";
          } else {
            console.error("Facebook API error:", result);
            const errCode = result.error?.message || "Unknown error";
            fbPostStatus.textContent = `FB API Error: ${errCode}`;
            fbPostStatus.style.color = "#ffb3b3";
          }
        }, "image/png");
      } catch (err) {
        console.error("FB post capture error:", err);
        fbPostStatus.textContent = "Security constraint / direct loading error. Use Download and post manually.";
        fbPostStatus.style.color = "#ffb3b3";
      }
    });
  }

  // Manage FB Settings securely in browser localStorage
  if (fbSettingsBtn) {
    fbSettingsBtn.addEventListener("click", () => {
      const pageId = prompt("Enter Facebook Page ID:", localStorage.getItem("fb_page_id") || "");
      if (pageId === null) return; // cancelled
      const token = prompt("Enter Facebook Page Access Token:", localStorage.getItem("fb_page_access_token") || "");
      if (token === null) return;

      localStorage.setItem("fb_page_id", pageId.trim());
      localStorage.setItem("fb_page_access_token", token.trim());
      
      alert("Credentials stored securely in your browser's local storage!");
    });
  }
});
