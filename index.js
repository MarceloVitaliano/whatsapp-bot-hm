
const express = require('express');
const cron = require('node-cron');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🤖 Bot de WhatsApp con mensajes rotatorios activo, McFly.');
});

// Mensajes rotativos por horario
const mensajesPorHora = {
  "10": [
    "☀️ ¡Buenos días! Ya es hora de subir algo a Instagram.",
    "📸 Empieza tu día con una buena publicación.",
    "🧠 La constancia crea resultados. Sube contenido hoy.",
    "🚀 El primer paso es mostrar tu trabajo. ¡Publica ya!",
    "💡 Comparte algo útil hoy en tu historia o feed."
  ],
  "15": [
    "📬 Revisa y contesta tus mensajes de Instagram.",
    "📲 No dejes en visto, Doc. ¡Dale seguimiento a tus clientes!",
    "🗣️ Interactúa con tu audiencia ahora mismo.",
    "📈 Cada mensaje es una oportunidad de venta.",
    "💬 El engagement comienza con una respuesta."
  ],
  "20": [
    "🌙 Último aviso del día: ¿ya diste seguimiento?",
    "🎯 Revisa tu IG antes de descansar, que mañana seguimos.",
    "📆 Cierra tu día con un mensaje profesional en tus DMs.",
    "📚 Mañana es otro día, pero hoy aún puedes accionar.",
    "🔥 Termina fuerte: responde o agenda algo desde IG."
  ]
};

// Lógica rotativa y envío
const enviarMensaje = (hora) => {
  const mensajes = mensajesPorHora[hora];
  const dia = new Date().getDate(); // del 1 al 31
  const mensaje = mensajes[dia % mensajes.length]; // rotativo con el día del mes

  console.log(`⏰ Enviando mensaje para las ${hora}:00 — "${mensaje}"`);

  client.messages.create({
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+5218134425657',
    body: mensaje
  }).then(() => {
    console.log("✅ Mensaje enviado correctamente.");
  }).catch((err) => {
    console.error("❌ Error al enviar el mensaje:", err.message);
  });
};

// Programación cron
['10', '15', '20'].forEach(hora => {
  cron.schedule(`0 ${hora} * * *`, () => enviarMensaje(hora), {
    timezone: "America/Monterrey"
  });
});

// Ruta de prueba
app.get('/prueba', (req, res) => {
  const mensaje = "✅ WhatsApp automático funcionando al 100%";
  client.messages.create({
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+5218134425657',
    body: mensaje
  }).then(() => {
    console.log("✅ Mensaje de prueba enviado correctamente.");
    res.send("Mensaje de prueba enviado por WhatsApp.");
  }).catch((err) => {
    console.error("❌ Error al enviar el mensaje de prueba:", err.message);
    res.status(500).send("Error al enviar mensaje de prueba.");
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
