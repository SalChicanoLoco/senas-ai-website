// functions/api/generate-image.js - Cloudflare Pages serverless worker for Stable Diffusion AI Generation
// Runs automatically when deployed to Cloudflare Pages!

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required / El prompt es requerido." }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 1. If Cloudflare Workers AI catalog binding is active, use native Stable Diffusion
    if (env.AI) {
      try {
        const model = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
        const response = await env.AI.run(model, {
          prompt: prompt.trim(),
          num_inference_steps: 20
        });

        return new Response(response, {
          status: 200,
          headers: {
            "Content-Type": "image/png",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (aiErr) {
        console.error("Cloudflare Workers AI failed, triggering fallback:", aiErr);
        // Fall back to serverless proxy Pollinations fetch to guarantee it still works in worker!
      }
    }

    // 2. High-speed premium fallback generator (Pollinations Flux/SD engine)
    const seed = Math.floor(Math.random() * 999999);
    const fallbackUrl = `https://image.pollinations.ai/p/${encodeURIComponent(prompt.trim())}?width=768&height=768&nologo=true&seed=${seed}`;
    
    const res = await fetch(fallbackUrl);
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    console.error("AI Image Generation crash:", err);
    return new Response(JSON.stringify({
      error: "Internal Server Error / Error del servidor interno: " + err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

// Handle OPTIONS preflight requests for security
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
