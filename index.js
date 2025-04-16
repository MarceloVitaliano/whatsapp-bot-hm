
const express = require('express');
const cron = require('node-cron');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Ruta raíz para confirmar que está activo
app.get('/', (req, res) => {
  res.send('🤖 Bot de WhatsApp con mensajes rotatorios activo, McFly.');
});

// Cron job: todos los días a las 10:00 AM, 3:00 PM y 8:00 PM
const mensajes = [
  { hora: '0 10 * * *', mensaje: '📌 Buenos días, ¡es hora de subir contenido a Instagram!' },
  { hora: '0 15 * * *', mensaje: '📌 Revisa tus mensajes en Instagram y contesta pendientes.' },
  { hora: '0 20 * * *', mensaje: '📌 Último recordatorio del día para dar seguimiento en IG.' }
];

mensajes.forEach(({ hora, mensaje }) => {
  cron.schedule(hora, () => {
    console.log(`Enviando: ${mensaje}`);
    const numeros = [
      'whatsapp:+528134425657',
      'whatsapp:+528115661295'
    ];
    numeros.forEach(numero => {
      client.messages.create({
        from: 'whatsapp:+14155238886',
        to: numero,
        body: mensaje
      }).then(() => {
        console.log(`Mensaje enviado a ${numero}`);
      }).catch(err => {
        console.error(`Error al enviar a ${numero}:`, err.message);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
