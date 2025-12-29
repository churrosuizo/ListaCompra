export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { image } = body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) return res.status(500).json({ error: "Falta la clave GEMINI_API_KEY en Vercel" });

    // Intentamos la ruta más directa posible
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Lee esta lista de la compra y devuélvela como texto simple, un artículo por línea." },
            { inlineData: { mimeType: "image/jpeg", data: image } }
          ]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Si falla, intentamos decir exactamente POR QUÉ
      return res.status(response.status).json({ 
        error: `Google dice: ${data.error.message}`,
        code: data.error.status 
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Fallo en el servidor: " + error.message });
  }
}
