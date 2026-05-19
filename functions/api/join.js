// functions/api/join.js - Cloudflare Pages Function for bilingual form submissions
// Runs automatically when deployed to Cloudflare Pages!

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const contentType = request.headers.get("content-type") || "";
    let data = {};

    // Parse form-data or JSON payloads securely
    if (contentType.includes("form")) {
      const formData = await request.formData();
      for (const [key, val] of formData.entries()) {
        data[key] = val;
      }
    } else {
      data = await request.json();
    }

    const name = data.name?.trim() || "Anonymous";
    const email = data.email?.trim() || "";
    const city = data.city?.trim() || "";
    const language = data.language || "en";
    const interests = data.interests?.trim() || "";

    // Validation
    if (!email) {
      return new Response(JSON.stringify({ 
        error: "Email is required / El correo electrónico es requerido." 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // ── scale integrations easily ──
    // 1. Discord / Slack webhook notification
    if (env.WEBHOOK_URL) {
      try {
        await fetch(env.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `✊ **New Comrade Joined!**\n**Name:** ${name}\n**Email:** ${email}\n**City:** ${city}\n**Language:** ${language}\n**Interests:** ${interests}`
          })
        });
      } catch (err) {
        console.error("Webhook notification failed:", err);
      }
    }

    // 2. Local D1 database store if bound in wrangler.toml
    if (env.DB) {
      try {
        await env.DB.prepare(
          "INSERT INTO comrades (name, email, city, language, interests, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(name, email, city, language, interests, new Date().toISOString()).run();
      } catch (err) {
        console.error("D1 Database insert failed:", err);
      }
    }

    // Return successful response
    return new Response(JSON.stringify({
      success: true,
      message: "Comrade registered successfully! / ¡Registrado con éxito!",
      received: { name, email, city, language, interests }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    console.error("Serverless Function crash:", err);
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
