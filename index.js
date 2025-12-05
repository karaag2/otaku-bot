const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const readline = require("readline");
const { log } = require("console");

const BROWSERS = {
	chrome: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
	edge: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

//functions

const clientInitialzer = (path) => {
	const client = new Client({
		authStrategy: new LocalAuth(),
		puppeteer: {
			executablePath: path,
			headless: true,
		},
	});
	return client;
};
function Monitoring(client) {
	client.on("message_create", (message) => {
		console.log(message.body);
	});
}
function Tagall(client) {
	client.on("message_create", async (msg) => {
		if (msg.body.startsWith("!nakama")) {
			const chat = await msg.getChat();
			console.log(chat);
			let senderId = null;
			if (chat.isGroup) {
				try {
					senderId = msg.author || msg.from; // ID du contact
					console.log(senderId);
				} catch (err) {
					console.error("Erreur getContact():", err);
				}
			}

			if (!senderId) {
				msg.reply("⚠️ Impossible de vérifier l’auteur du message.");
				return;
			}
			console.log("====================================");
			console.log("steeeep passed");
			console.log("====================================");
			console.log(senderId);
			const sender = chat.participants.find(
				(p) => p.id.user === senderId.number,
			);
			try {
				const contact = await msg.getContact();
				console.log("voici le contact", contact);
			} catch (error) {
				console.log("error contact", error);
			}
			console.log(chat.participants);
			if (!sender || !sender.isAdmin) {
				await msg.reply(
					"❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.",
				);
				return;
			}

			const mentions = [];
			let tagText = "";

			for (const participant of chat.participants) {
				try {
					let participantId = participant.id;
					// Normalize different shapes of participant.id
					if (participantId && typeof participantId === "object") {
						if (participantId._serialized) {
							participantId = participantId._serialized;
						} else if (participantId.user) {
							participantId = `${participantId.user}@c.us`;
						} else {
							participantId = String(participantId);
						}
					}

					if (!participantId) {
						console.warn("Participant id missing, skipping:", participant);
						continue;
					}
					console.log("something happened");

					// const contact = await client.getContactById(participantId);
					// if (!contact) {
					// 	console.warn("Unable to fetch contact for", participantId);
					// 	continue;
					// }
					// mentions.push(contact);
					// const displayNum =
					// 	contact.number || contact.id?.user || participantId;
					// tagText += `@${displayNum} `;
				} catch (err) {
					console.warn(
						"Error fetching contact for participant:",
						participant,
						err,
					);
				}
			}

			// const customMessage = msg.body.slice("!nakama".length).trim();
			// const finalMessage = `${tagText}\n\n${customMessage}`;

			// try {
			// 	await msg.delete(true);
			// } catch (err) {
			// 	console.warn("Impossible de supprimer le message :", err);
			// }

			// await chat.sendMessage(finalMessage, { mentions });
		}
		// console.log("something happened", chat);
		// }
	});
}

function clientReadyMessage(client) {
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
	client.on("qr", (qr) => {
		qrcode.generate(qr, { small: true });
	});
	clientReadyMessage(client);
	Tagall(client);
	Monitoring(client);
	client.initialize();
	rl.close();
});
