const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "none",
  },
  puppeteer: {
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
  },
});

client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Bot prêt !");
});
// Listening to all incoming messages
client.on("message_create", message => {
  console.log(message.body);
});
client.on("message_create", async message => {
  if (message.body === "!ping") {
    // send back "pong" to the chat the message was sent in
    client.sendMessage(message.from, "pong");
  }
  if (message.body === "!hello") {
    // send back "Hello!" to the chat the message was sent in
    client.sendMessage(message.from, "Hello!");
    const chat = await message.getChat();

    if (!chat.isGroup) return;

    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      mentions.push(participant.id._serialized);
      text += `@${participant.id.user} `;
    }
    client.sendMessage(message.from, `${text}Hello! ${mentions}`);
  }
});

client.on("message", async msg => {
  if (msg.body === "!everyone") {
    const chat = await msg.getChat();
    if (!chat.isGroup) return;

    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      mentions.push(participant.id._serialized);
      text += `@${participant.id.user} `;
    }

    chat.sendMessage(text, { mentions });
  }
});

client.initialize();
