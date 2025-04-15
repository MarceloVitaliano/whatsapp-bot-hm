const express = require("express");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 3000;

// Twilio credentials
const accountSid = "AC5c6f0b360bdbbdf1535365b68794f1cc";
const authToken = "bf764fc496fb62df069c9e1aa0a09938";
const client = twilio(accountSid, authToken);

// Números de destino y mensaje base
const numbers = ["+528134425657", "+528115661295"];
const messages = {
  "10": "🌞 ¡Buenos días, Doc! Hora de subir algo a Instagram. Una historia, un post o mínimo una encuesta 👀📲",
  "15": "🚨 ¿Ya revisaste los mensajes de Instagram? Que no se te escape ningún cliente 📬😎",
  "20": "🧠 Hora de seguimiento. ¿Ya hiciste algo nuevo hoy por HM Encuadernaciones? Si no, mañana le damos con todo 💪"
};

function sendMessages(hour) {
  const msg = messages[hour];
  if (!msg) return;

  numbers.forEach(to => {
    client.messages
      .create({
        from: "whatsapp:+14155238886",
        to: `whatsapp:${to}`,
        body: msg
      })
      .then(message => console.log(`Mensaje enviado a ${to}: ${message.sid}`))
      .catch(error => console.error(`Error al enviar a ${to}:`, error));
  });
}

app.get("/send/:hour", (req, res) => {
  const hour = req.params.hour;
  sendMessages(hour);
  res.send(`Mensajes enviados para la hora ${hour}`);
});

app.get("/", (req, res) => {
  res.send("Bot de WhatsApp para HM Encuadernaciones activo.");
});

app.listen(port, () => {
  console.log(`Servidor activo en puerto ${port}`);
});