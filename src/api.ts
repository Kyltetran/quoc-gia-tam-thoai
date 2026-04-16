export async function generateDialogue(input: string, persona: string, lang: string) {
  const API_KEY = "AQ.Ab8RN6KvIvuUMXvNOgnG6EKM-v8J_7jSIElHBG7ghfmZorWVBA";

  const prompt = `Generate a ${lang === 'vi' ? 'Vietnamese' : 'English'} dialogue in the style of "${persona}" based on: ${input}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  if (!res.ok) {
    console.error(await res.text());
    return "Demo fallback response.";
  }

  const data = await res.json();
  console.log(data);

  return data.candidates?.[0]?.content?.parts?.[0]?.text 
    || "Demo fallback response.";
}