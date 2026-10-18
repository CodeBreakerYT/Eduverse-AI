const { callGemini, OFFLINE_REPLY } = require("../../shared/tutorPrompt");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const { message, profile, history } = payload;
  if (!message) {
    return { statusCode: 400, body: JSON.stringify({ error: "message is required" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reply: OFFLINE_REPLY }) };
  }

  try {
    const reply = await callGemini({ message, profile, history, apiKey });
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.status || 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "internal error", detail: err.detail }),
    };
  }
};
