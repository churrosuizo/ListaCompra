export default async function handler(req, res) {
  const { image } = JSON.parse(req.body);
  const API_KEY = process.env.GEMINI_API_KEY; // Aquí no hay clave real, es un alias

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "Eres un experto en OCR. Lee esta lista de la compra de una pizarra. Devuelve solo los artículos separados por comas." },
          { inlineData: { mimeType: "image/jpeg", data: image } }
        ]
      }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
