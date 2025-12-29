export default async function handler(req, res) {
  try {
    const { image } = JSON.parse(req.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Falta la API Key en Vercel" });
    }

    // Usamos el modelo 1.5-flash que es el más rápido y estable
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analiza esta imagen de una pizarra y extrae la lista de la compra. Devuelve solo los artículos, uno por línea, sin guiones ni puntos." },
            { inlineData: { mimeType: "image/jpeg", data: image } }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
}
