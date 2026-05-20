// functions/api/pledge.js - Cloudflare Pages Worker for Contribution Pledge System
// Secures Airtable PAT credentials behind a serverless proxy and handles secure submissions

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Set CORS and response headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    // Parse pledge payload
    const payload = await request.json();
    const { name, email, amount, frequency, platform, message } = payload;

    // Validate fields
    if (!name || !email || !amount || !platform) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Missing required fields / Faltan campos requeridos" 
      }), { status: 400, headers: corsHeaders });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Invalid email address / Dirección de correo no válida" 
      }), { status: 400, headers: corsHeaders });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Invalid amount / Cantidad no válida" 
      }), { status: 400, headers: corsHeaders });
    }

    // Prepare Airtable Fields
    const airtableFields = {
      "Name": name,
      "Email": email,
      "Amount": numericAmount,
      "Frequency": frequency || "one-time",
      "Platform": platform,
      "Message": message || "",
      "SubmittedAt": new Date().toISOString()
    };

    let isLiveAirtable = false;
    let airtableError = null;

    const pat = env.AIRTABLE_PAT;
    const baseId = env.AIRTABLE_BASE_ID;
    const tableName = env.AIRTABLE_PLEDGES_TABLE_NAME || "Pledges";

    // Attempt to write to Airtable if secrets exist
    if (pat && baseId) {
      try {
        const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
        const response = await fetch(airtableUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${pat}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            records: [{ fields: airtableFields }]
          })
        });

        if (response.ok) {
          isLiveAirtable = true;
        } else {
          const errText = await response.text();
          airtableError = `Airtable responded with status ${response.status}: ${errText}`;
          console.error(airtableError);
        }
      } catch (err) {
        airtableError = `Airtable connection failed: ${err.message}`;
        console.error(airtableError);
      }
    } else {
      console.warn("Airtable credentials (AIRTABLE_PAT/AIRTABLE_BASE_ID) not configured in Pages Environment. Running in local sandbox mock mode.");
    }

    // Trigger Email Alerts via Brevo API if key is available
    let isLiveEmail = false;
    let emailError = null;
    const brevoKey = env.BREVO_API_KEY || env.BREVO_KEY;

    if (brevoKey) {
      try {
        // 1. Send admin notification email
        const adminEmailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "accept": "application/json",
            "content-type": "application/json"
          },
          body: JSON.stringify({
            sender: { name: "New Mexico Socialists Portal", email: "noreply@newmexicosocialists.org" },
            to: [{ email: "salvadorsena@senacolectivo.com", name: "Salvador Sena" }],
            replyTo: { email: email, name: name },
            subject: `New Pledge Contribution: $${numericAmount} via ${platform.toUpperCase()}`,
            textContent: `New Pledge Contribution Received:\n\nName: ${name}\nEmail: ${email}\nAmount: $${numericAmount}\nFrequency: ${frequency}\nPlatform: ${platform}\nMessage: ${message || "No message"}\n\nSubmitted at: ${new Date().toLocaleString()}`
          })
        });

        // 2. Send contributor thank you auto-reply email (bilingual)
        const platformDetails = {
          venmo: "Venmo details will be sent in a follow-up coordination email from Salvador.",
          cashapp: "Cash App cashtag details will be coordinated shortly via email.",
          paypal: "PayPal link details will be shared in a follow-up message.",
          check: "Mailing address details will be sent shortly to arrange check delivery.",
          other: "In-kind or alternative payment details will be coordinated with you directly."
        };
        const platformDetailsEs = {
          venmo: "Los detalles de Venmo se enviarán en un correo de coordinación de seguimiento de Salvador.",
          cashapp: "Los detalles de Cash App se coordinarán en breve a través de correo electrónico.",
          paypal: "Los detalles de la cuenta de PayPal se compartirán en un mensaje de seguimiento.",
          check: "La dirección postal se enviará en breve para organizar la entrega del cheque.",
          other: "Los detalles de donaciones en especie o alternativas se coordinarán directamente con usted."
        };

        const thankYouResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "accept": "application/json",
            "content-type": "application/json"
          },
          body: JSON.stringify({
            sender: { name: "New Mexico Socialists", email: "noreply@newmexicosocialists.org" },
            to: [{ email: email, name: name }],
            replyTo: { email: "salvadorsena@senacolectivo.com", name: "Salvador Sena" },
            subject: "Thank you for your pledge to NM Socialists / Gracias por tu contribución",
            textContent: `Dear ${name},\n\nThank you for your generous pledge to support New Mexico Socialists! Your contribution helps us organize, print materials, and fund mutual aid projects.\n\nYour Pledge Summary:\n- Amount: $${numericAmount} (${frequency})\n- Preferred Method: ${platform.toUpperCase()}\n\nCoordination details:\n${platformDetails[platform] || platformDetails.other}\n\nSalvador Sena will reach out to you shortly to coordinate this contribution securely.\n\nSolidarity,\nNew Mexico Socialists\nsalvadorsena@senacolectivo.com\n\n---\n\nEstimado/a ${name},\n\n¡Gracias por tu generoso compromiso para apoyar a New Mexico Socialists! Tu contribución nos ayuda a organizar, imprimir materiales y financiar proyectos de ayuda mutua.\n\nResumen de tu contribución:\n- Cantidad: $${numericAmount} (${frequency === "monthly" ? "mensual" : "una sola vez"})\n- Método Preferido: ${platform.toUpperCase()}\n\nDetalles de coordinación:\n${platformDetailsEs[platform] || platformDetailsEs.other}\n\nSalvador Sena se pondrá en contacto contigo en breve para coordinar esta contribución de forma segura.\n\nEn Solidaridad,\nNew Mexico Socialists\nsalvadorsena@senacolectivo.com`
          })
        });

        if (adminEmailResponse.ok && thankYouResponse.ok) {
          isLiveEmail = true;
        } else {
          emailError = `Brevo responded with status ${adminEmailResponse.status} / ${thankYouResponse.status}`;
          console.error(emailError);
        }
      } catch (err) {
        emailError = `Email delivery failed: ${err.message}`;
        console.error(emailError);
      }
    }

    // Success response detailing sync states
    return new Response(JSON.stringify({
      success: true,
      message: "Pledge received successfully! Check your email for next steps. / ¡Compromiso recibido! Revisa tu correo.",
      airtableSynced: isLiveAirtable,
      emailSent: isLiveEmail,
      airtableError,
      emailError
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      message: `An unexpected error occurred: ${err.message}`
    }), { status: 500, headers: corsHeaders });
  }
}

// Handle OPTIONS preflight requests for CORS security
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
