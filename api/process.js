export default async function handler(req, res) {
  // Manejador para evitar errores de conexión
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Intentamos leer la imagen del cuerpo de la petición
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { image } = body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "La API Key no está configurada en Vercel" });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Eres un asistente que lee listas de la compra. Lee la imagen y devuelve los artículos encontrados, uno por línea, sin guiones ni números."
          }, {
            inlineData: {
              mimeType: "image/jpeg",
              data: image
            }
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "Error de Google: " + data.error.message });
    }

    // Enviamos la respuesta limpia a tu iPhone
    res.status(200).json(data);

  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: "Fallo interno: " + error.message });
  }
}
