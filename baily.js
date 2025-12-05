const {
	default: makeWASocket,
	useMultiFileAuthState,
	DisconnectReason,
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

async function startBot() {
	const { state, saveCreds } = await useMultiFileAuthState("session");

	const sock = makeWASocket({
		auth: state,
		syncFullHistory: false,
	});

	// Sauvegarder automatiquement les credentials
	sock.ev.on("creds.update", saveCreds);

	// Afficher le QR code quand il est généré
	sock.ev.on("connection.update", (update) => {
		const { qr, connection } = update;

		if (qr) {
			console.log("📌 Scan ce QR Code pour te connecter :");
			qrcode.generate(qr, { small: true });
		}

		if (connection === "open") {
			console.log("✅ Bot connecté !");
		}

		if (connection === "close") {
			console.log("❌ Déconnecté !");
		}
	});
	sock.ev.on("connection.update", (update) => {
		const { connection, lastDisconnect } = update;
		if (connection === "close") {
			console.log("❌ Déconnecté !", lastDisconnect?.error?.output?.statusCode);
			// Reconnecte sauf si c’est une déconnexion volontaire (401)
			if (lastDisconnect?.error?.output?.statusCode !== 401) {
				startBot();
			}
		} else if (connection === "open") {
			console.log("✅ Connecté à WhatsApp !");
		}
	});
	// Exemple simple pour tester
	sock.ev.on("messages.upsert", async ({ messages }) => {
		// const msg = messages[0];
		// if (!msg.message) return;

		// const text =
		// 	msg.message.conversation || msg.message.extendedTextMessage?.text || "";

		// const from = msg.key.remoteJid;

		// if (text.startsWith("!pan")) {
		// 	await sock.sendMessage(from, { text: "🏓 Pong!" });
		// }

		const msg = messages[0];
		if (!msg.message) return;

		const from = msg.key.remoteJid;
		const isGroup = from.endsWith("@g.us");

		const text =
			msg.message.conversation || msg.message.extendedTextMessage?.text || "";

		if (text.startsWith("!nakama") && isGroup) {
			const metadata = await sock.groupMetadata(from);
			const sender = msg.key.participant;

			const isAdmin = metadata.participants.some(
				(p) =>
					p.id === sender && (p.admin === "admin" || p.admin === "superadmin"),
			);

			// if (!isAdmin) {
			// 	await sock.sendMessage(from, {
			// 		text: "❌ Seuls les administrateurs peuvent utiliser cette commande.",
			// 	});
			// 	return;
			// }

			const mentions = metadata.participants.map((p) => p.id);
			const customMsg = text.replace("!nakama", "").trim();

			const msgText =
				metadata.participants.map((p) => `@${p.id.split("@")[0]}`).join(" ") +
				"\n\n" +
				customMsg;

			await sock.sendMessage(from, {
				text: msgText,
				mentions,
			});
		}
	});
}

startBot();
