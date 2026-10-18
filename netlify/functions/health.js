exports.handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, geminiConfigured: !!process.env.GEMINI_API_KEY }),
  };
};
