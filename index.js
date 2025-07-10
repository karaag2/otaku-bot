const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");
const readline = require("readline");

const BROWSERS = {
  chrome: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  edge: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


//functions

const clientInitialzer = (path)=>{
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: path,
      headless: false,
    },
  });
  return client;
}

function allTag(client) {
  client.on("message_create", async (msg) => {
    if (msg.body.startsWith("!nakama")) {
      const chat = await msg.getChat();

      if (chat.isGroup) {
        const senderId = await msg.getContact();

        if (!senderId) {
          await msg.reply("⚠️ Impossible de vérifier l’auteur du message.");
          return;
        }

        const sender = chat.participants.find(p => p.id.user == senderId.number);
        console.log(sender);
        if (!sender || !sender.isAdmin) {
          await msg.reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");
          return;
        }

        const mentions = [];
        let tagText = "";

        for (let participant of chat.participants) {
          const contact = await client.getContactById(participant.id._serialized);
          mentions.push(contact);
          tagText += `@${contact.number} `;
        }

        const customMessage = msg.body.slice("!nakama".length).trim();
        const finalMessage = `${tagText}\n\n${customMessage}`;

        try {
          await msg.delete(true);
        } catch (err) {
          console.warn("Impossible de supprimer le message :", err);
        }

        await chat.sendMessage(finalMessage, { mentions });
      }
    }
  });
}


function clientReadyMessage(client){
  client.on("ready", () => {
    console.log("✅ Client is ready!");
  });
}




rl.question("Quel navigateur veux-tu utiliser ? (chrome/edge): ", (choice) => {
  const path = BROWSERS[choice.toLowerCase()];

  if (!path) {
    console.log("❌ Navigateur non reconnu.");
    rl.close();
    return;
  }

  const client = clientInitialzer(path);
 
  clientReadyMessage(client);
  allTag(client);
  client.initialize();
  rl.close();
});
