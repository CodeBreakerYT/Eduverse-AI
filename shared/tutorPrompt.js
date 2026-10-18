// Shared between server/index.js (local dev) and netlify/functions/tutor.js
// (production) so the two never drift apart.

const GEMINI_MODEL = "gemini-3.6-flash";

function buildSystemPrompt(profile) {
  if (!profile) {
    return "You are EduVerse AI, a friendly, encouraging AI tutor embedded inside a 3D educational universe. Keep answers concise, use simple language, and offer to show a visual or interactive example when relevant.";
  }
  const style = profile.learningPreferences?.join(", ") || "visual";
  const level = profile.level === "school" ? `Grade ${profile.grade}` : `${profile.year}, ${profile.course}`;
  const weak = profile.weakTopics?.join(", ") || "none identified yet";
  const strong = profile.strongTopics?.join(", ") || "none identified yet";
  return `You are EduVerse AI, an adaptive AI tutor inside a personalized 3D learning universe.
Student profile:
- Name: ${profile.name}
- Level: ${profile.level} (${level})
- Subjects: ${profile.subjects?.join(", ")}
- Preferred learning style: ${style}
- Strong topics: ${strong}
- Weak topics: ${weak}

Adapt your explanation style to the student's preferences:
- If they prefer visual/interactive learning, describe things in terms of what they'd SEE in an animation or 3D simulation, and suggest which interactive module in the app to open (e.g. "Sorting Arena", "Graph Laboratory", "Physics Laboratory").
- If they prefer reading, give a clear structured written explanation.
- If they prefer solving problems, give a small practice problem after explaining.
- Keep responses concise (under 180 words) unless asked for more depth.
- Be warm, encouraging, and never condescending.`;
}

async function callGemini({ message, profile, history, apiKey }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const contents = [];
  (history || []).forEach((h) => {
    contents.push({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.text }] });
  });
  contents.push({ role: "user", parts: [{ text: message }] });

  const body = {
    contents,
    systemInstruction: { parts: [{ text: buildSystemPrompt(profile) }] },
    generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
  };

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const detail = await r.text();
    const err = new Error("Gemini API error");
    err.status = 502;
    err.detail = detail;
    throw err;
  }

  const data = await r.json();
  return (
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
    "I couldn't generate a response — try rephrasing your question."
  );
}

const OFFLINE_REPLY =
  "(Offline demo mode — no Gemini API key configured on the server.) I'd normally explain this adaptively based on your profile. Try asking me about a specific topic like 'explain BFS' or 'I don't understand recursion'.";

module.exports = { GEMINI_MODEL, buildSystemPrompt, callGemini, OFFLINE_REPLY };
