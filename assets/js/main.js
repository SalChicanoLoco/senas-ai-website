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
  const memeFileUpload = document.getElementById("meme-file-upload");
  const memeFontFamily = document.getElementById("meme-font-family");
  const memeLayout = document.getElementById("meme-layout");
  const memeAlign = document.getElementById("meme-align");
  const memeUppercase = document.getElementById("meme-uppercase");
  const memeOutlineWeight = document.getElementById("meme-outline-weight");
  
  // AI Image Generator fields
  const memeAiPrompt = document.getElementById("meme-ai-prompt");
  const memeAiGenerateBtn = document.getElementById("meme-ai-generate-btn");
  const memeAiStatus = document.getElementById("meme-ai-status");

  const fbPostBtn = document.getElementById("fb-post-btn");
  const fbSettingsBtn = document.getElementById("fb-settings-btn");
  const fbPostStatus = document.getElementById("fb-post-status");

  let activeTemplateSrc = "assets/img/meme_1.png"; // Fallback default template

  function getAbsoluteUrl(relativePath) {
    const loc = window.location;
    if (relativePath.startsWith("data:")) return relativePath;
    const basePath = loc.pathname.replace(/index\.html$/, "");
    return loc.origin + basePath + relativePath;
  }

  // Redraw Canvas meme with live inputs
  function redrawMeme() {
    if (!memeCanvas || !activeTemplateSrc) return;
    const ctx = memeCanvas.getContext("2d");
    const img = new Image();
    
    // Only set crossOrigin if the url is external to prevent CORS blockages locally
    if (activeTemplateSrc.startsWith("http") && !activeTemplateSrc.startsWith(window.location.origin)) {
      img.crossOrigin = "anonymous";
    }
    img.src = activeTemplateSrc;

    img.onload = () => {
      const layout = memeLayout ? memeLayout.value : "classic";
      const fSizeFactor = memeFontSize ? parseInt(memeFontSize.value) / 100 : 0.08;
      const fontFam = memeFontFamily ? memeFontFamily.value : "Impact";
      const align = memeAlign ? memeAlign.value : "center";
      const txtColor = memeColor ? memeColor.value : "#ffffff";
      const outlineWt = memeOutlineWeight ? parseInt(memeOutlineWeight.value) : 4;
      const forceUpper = memeUppercase ? memeUppercase.checked : true;

      let topTextStr = (memeTopText && memeTopText.value) ? memeTopText.value : "";
      let bottomTextStr = (memeBottomText && memeBottomText.value) ? memeBottomText.value : "";
      
      if (forceUpper) {
        topTextStr = topTextStr.toUpperCase();
        bottomTextStr = bottomTextStr.toUpperCase();
      }

      if (layout === "demotivational") {
        // Demotivational layout calculates padding and black margins
        const borderSize = Math.floor(img.naturalWidth * 0.08);
        const bottomPadding = Math.floor(img.naturalHeight * 0.26);

        memeCanvas.width = img.naturalWidth + borderSize * 2;
        memeCanvas.height = img.naturalHeight + borderSize * 1.5 + bottomPadding;

        // Draw solid black background
        ctx.fillStyle = "#0c0a08";
        ctx.fillRect(0, 0, memeCanvas.width, memeCanvas.height);

        // Draw main image
        ctx.drawImage(img, borderSize, borderSize, img.naturalWidth, img.naturalHeight);

        // Gold frame line around image
        ctx.strokeStyle = "hsl(38, 85%, 48%)";
        ctx.lineWidth = Math.max(img.naturalWidth * 0.003, 1.5);
        ctx.strokeRect(borderSize - 3, borderSize - 3, img.naturalWidth + 6, img.naturalHeight + 6);

        // Text setup
        ctx.textAlign = "center";
        
        // Title (Top Slogan)
        if (topTextStr) {
          const finalFontSize = Math.floor(memeCanvas.width * (fSizeFactor * 1.1));
          ctx.font = `600 ${finalFontSize}px "Space Grotesk", "Fraunces", serif`;
          ctx.fillStyle = "hsl(38, 85%, 48%)"; // Brand Gold
          const y = img.naturalHeight + borderSize * 1.5 + bottomPadding * 0.35;
          ctx.fillText(topTextStr, memeCanvas.width / 2, y, memeCanvas.width * 0.9);
        }

        // Subtitle (Bottom Slogan)
        if (bottomTextStr) {
          const finalFontSize = Math.floor(memeCanvas.width * (fSizeFactor * 0.65));
          ctx.font = `300 ${finalFontSize}px "Space Grotesk", "DM Sans", sans-serif`;
          ctx.fillStyle = "#f5ead8"; // Sand / Cream
          const y = img.naturalHeight + borderSize * 1.5 + bottomPadding * 0.72;
          ctx.fillText(bottomTextStr, memeCanvas.width / 2, y, memeCanvas.width * 0.9);
        }

      } else if (layout === "banner") {
        // Activist banner layout with solid colored footer box
        memeCanvas.width = img.naturalWidth || 600;
        memeCanvas.height = img.naturalHeight || 600;
        
        ctx.drawImage(img, 0, 0, memeCanvas.width, memeCanvas.height);

        const bannerHeight = Math.floor(memeCanvas.height * 0.22);
        
        // Draw Terracotta banner backdrop
        ctx.fillStyle = "rgba(194, 96, 58, 0.95)";
        ctx.fillRect(0, memeCanvas.height - bannerHeight, memeCanvas.width, bannerHeight);

        // Gold separation divider
        ctx.strokeStyle = "hsl(38, 85%, 48%)";
        ctx.lineWidth = Math.max(memeCanvas.width * 0.005, 3);
        ctx.beginPath();
        ctx.moveTo(0, memeCanvas.height - bannerHeight);
        ctx.lineTo(memeCanvas.width, memeCanvas.height - bannerHeight);
        ctx.stroke();

        ctx.textAlign = align;
        
        let textX = memeCanvas.width / 2;
        if (align === "left") textX = memeCanvas.width * 0.05;
        if (align === "right") textX = memeCanvas.width * 0.95;

        // Render slogan lines inside the banner strip
        if (topTextStr) {
          const finalFontSize = Math.floor(memeCanvas.width * (fSizeFactor * 0.85));
          ctx.font = `900 ${finalFontSize}px "${fontFam}", sans-serif`;
          ctx.fillStyle = "#fdf6ea"; // Cream
          const y = memeCanvas.height - bannerHeight + bannerHeight * 0.35;
          ctx.fillText(topTextStr, textX, y, memeCanvas.width * 0.9);
        }
        
        if (bottomTextStr) {
          const finalFontSize = Math.floor(memeCanvas.width * (fSizeFactor * 0.65));
          ctx.font = `600 ${finalFontSize}px "${fontFam}", monospace`;
          ctx.fillStyle = "hsl(38, 85%, 48%)"; // Gold
          const y = memeCanvas.height - bannerHeight + bannerHeight * 0.72;
          ctx.fillText(bottomTextStr, textX, y, memeCanvas.width * 0.9);
        }

      } else {
        // Classic overlay meme layout
        memeCanvas.width = img.naturalWidth || 600;
        memeCanvas.height = img.naturalHeight || 600;

        ctx.drawImage(img, 0, 0, memeCanvas.width, memeCanvas.height);

        const finalFontSize = Math.floor(memeCanvas.width * fSizeFactor);
        ctx.fillStyle = txtColor;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = outlineWt;
        ctx.textAlign = align;
        ctx.font = `900 ${finalFontSize}px "${fontFam}", Impact, sans-serif`;

        let textX = memeCanvas.width / 2;
        if (align === "left") textX = memeCanvas.width * 0.05;
        if (align === "right") textX = memeCanvas.width * 0.95;

        // Draw Top Text
        if (topTextStr) {
          ctx.textBaseline = "top";
          const y = memeCanvas.height * 0.05;
          if (outlineWt > 0) ctx.strokeText(topTextStr, textX, y, memeCanvas.width * 0.9);
          ctx.fillText(topTextStr, textX, y, memeCanvas.width * 0.9);
        }

        // Draw Bottom Text
        if (bottomTextStr) {
          ctx.textBaseline = "bottom";
          const y = memeCanvas.height * 0.95;
          if (outlineWt > 0) ctx.strokeText(bottomTextStr, textX, y, memeCanvas.width * 0.9);
          ctx.fillText(bottomTextStr, textX, y, memeCanvas.width * 0.9);
        }
      }

      // Update download link as canvas data
      try {
        modalDownload.href = memeCanvas.toDataURL("image/png");
      } catch (e) {
        modalDownload.href = activeTemplateSrc;
      }
    };

    img.onerror = () => {
      console.error("Error loading active template image for meme rendering:", activeTemplateSrc);
    };
  }

  // Hook all generator inputs to redraw in real time
  if (memeTopText) memeTopText.addEventListener("input", redrawMeme);
  if (memeBottomText) memeBottomText.addEventListener("input", redrawMeme);
  if (memeFontSize) memeFontSize.addEventListener("input", redrawMeme);
  if (memeColor) memeColor.addEventListener("input", redrawMeme);
  if (memeFontFamily) memeFontFamily.addEventListener("change", redrawMeme);
  if (memeLayout) memeLayout.addEventListener("change", redrawMeme);
  if (memeAlign) memeAlign.addEventListener("change", redrawMeme);
  if (memeUppercase) memeUppercase.addEventListener("change", redrawMeme);
  if (memeOutlineWeight) memeOutlineWeight.addEventListener("input", redrawMeme);

  // Hook custom base image upload file input
  if (memeFileUpload) {
    memeFileUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          activeTemplateSrc = event.target.result;
          redrawMeme();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Hook AI Image Generation trigger
  if (memeAiGenerateBtn && memeAiPrompt) {
    memeAiGenerateBtn.addEventListener("click", async () => {
      const promptVal = memeAiPrompt.value.trim();
      if (!promptVal) {
        memeAiStatus.textContent = "Please enter description / Ingresa descripción";
        memeAiStatus.style.color = "#ffb3b3";
        return;
      }

      memeAiStatus.textContent = "🤖 Generating stock image with AI... / Generando con IA...";
      memeAiStatus.style.color = "hsl(38, 85%, 48%)";
      memeAiGenerateBtn.disabled = true;

      try {
        // Try calling Pages serverless Worker endpoint
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptVal })
        });

        if (res.ok && res.headers.get("content-type")?.includes("image")) {
          const blob = await res.blob();
          const localUrl = URL.createObjectURL(blob);
          activeTemplateSrc = localUrl;
          memeAiStatus.textContent = "🎨 AI Image loaded successfully! / ¡Imagen cargada!";
          memeAiStatus.style.color = "#77e89f";
          redrawMeme();
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Workers AI bypass fallback");
        }
      } catch (err) {
        console.log("Using direct client-side high-speed AI engine fallback...", err);
        const seed = Math.floor(Math.random() * 999999);
        const fallbackUrl = `https://image.pollinations.ai/p/${encodeURIComponent(promptVal)}?width=768&height=768&nologo=true&seed=${seed}`;
        
        const imgPreloader = new Image();
        imgPreloader.crossOrigin = "anonymous";
        imgPreloader.src = fallbackUrl;
        imgPreloader.onload = () => {
          activeTemplateSrc = fallbackUrl;
          memeAiStatus.textContent = "🤖 AI image generated / ¡Generada con IA!";
          memeAiStatus.style.color = "#77e89f";
          redrawMeme();
        };
        imgPreloader.onerror = () => {
          memeAiStatus.textContent = "AI generation failed. Try again / Error de generación.";
          memeAiStatus.style.color = "#ffb3b3";
        };
      } finally {
        memeAiGenerateBtn.disabled = false;
      }
    });
  }

  function openMemeModal(imgPath) {
    activeTemplateSrc = imgPath;
    const absolute = getAbsoluteUrl(imgPath);
    
    modalDownload.href = imgPath;
    modalShare.dataset.shareUrl = absolute;
    modalCopy.dataset.copyUrl = absolute;
    modalCopyStatus.textContent = "";
    if (fbPostStatus) fbPostStatus.textContent = "";

    // Reset controls to clean default settings
    if (memeTopText) memeTopText.value = "";
    if (memeBottomText) memeBottomText.value = "";
    if (memeFontSize) memeFontSize.value = "8";
    if (memeColor) memeColor.value = "#ffffff";
    if (memeFontFamily) memeFontFamily.value = "Impact";
    if (memeLayout) memeLayout.value = "classic";
    if (memeAlign) memeAlign.value = "center";
    if (memeUppercase) memeUppercase.checked = true;
    if (memeOutlineWeight) memeOutlineWeight.value = "4";
    if (memeFileUpload) memeFileUpload.value = ""; // Clear file selector
    if (memeAiPrompt) memeAiPrompt.value = ""; // Clear AI prompt
    if (memeAiStatus) memeAiStatus.textContent = "";

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    // Initialize canvas drawing
    setTimeout(redrawMeme, 50);
  }

  function closeMemeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    activeTemplateSrc = "";
  }

  // Open on button click
  document.querySelectorAll(".js-view-meme").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgPath = btn.getAttribute("data-img");
      openMemeModal(imgPath);
    });
  });

  // Share template directly bilingually with Web Share API or Clipboard fallback
  document.querySelectorAll(".js-share-meme").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const imgPath = btn.getAttribute("data-img");
      const absolute = getAbsoluteUrl(imgPath);
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'New Mexico Socialists Revolutionary Art',
            text: 'Check out this revolutionary art poster from New Mexico Socialists!',
            url: absolute
          });
        } catch (err) {
          console.log("Web Share cancelled or failed", err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(absolute);
          alert("Poster template link copied to clipboard! Share it with comrades! / ¡Enlace copiado!");
        } catch (err) {
          console.error("Clipboard copy failed", err);
        }
      }
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
    modalShare.addEventListener("click", async () => {
      const url = modalShare.dataset.shareUrl;
      if (!url) return;
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'New Mexico Socialists Revolutionary Art',
            text: 'Check out this revolutionary art poster from New Mexico Socialists!',
            url: url
          });
        } catch (err) {
          console.log("Web Share cancelled or failed", err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(url);
          modalCopyStatus.textContent = "Link copied! Share it with comrades! / ¡Copiado!";
          modalCopyStatus.style.color = "#77e89f";
        } catch (err) {
          console.error("Clipboard copy failed", err);
          modalCopyStatus.textContent = "Could not share or copy.";
          modalCopyStatus.style.color = "#ffb3b3";
        }
      }
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
