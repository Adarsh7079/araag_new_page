export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method not allowed.");
  }

  const { name, email, message } = req.body || {};

  if (!name || !message || !isValidEmail(email)) {
    return res.status(400).send("Please fill in all fields correctly.");
  }

  const recipient = process.env.CONTACT_TO_EMAIL;
  const sender = process.env.EMAIL_FROM;
  const apiKey = process.env.RESEND_API_KEY;

  if (!recipient || !sender || !apiKey) {
    console.error("Missing RESEND_API_KEY, CONTACT_TO_EMAIL, or EMAIL_FROM.");
    return res.status(500).send("Email service is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("Resend request failed:", response.status, errorDetails);

    let errorMessage = "Unable to send your message right now.";
    try {
      const resendError = JSON.parse(errorDetails);
      if (resendError.message) errorMessage = resendError.message;
    } catch {
    }

    return res.status(502).send(errorMessage);
  }

  return res.status(200).send("OK");
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
