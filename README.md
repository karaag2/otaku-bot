# 🤖 Otaku-Bot - WhatsApp Group Tag Bot

Otaku-Bot est un **bot WhatsApp** basé sur `whatsapp-web.js` qui permet aux **administrateurs de groupes** de taguer **automatiquement tous les membres** d’un groupe avec un message personnalisé.

---

## 🚀 Fonctionnalité principale

- ✅ Commande `!nakama` :
  - Mentionne **tous les membres** du groupe WhatsApp
  - Ajoute un message personnalisé
  - Supprime le message initial (si tu es admin)

Exemple :

```

!nakama Salut à tous, réunion à 18h 📢

```

Le bot enverra :

```

@237xxxxxx @229xxxxxx ... (tous les membres)
Salut à tous, réunion à 18h 📢

````

---

## 🧰 Prérequis

- Node.js >= v18
- pnpm (`npm install -g pnpm`)
- Navigateur installé : Google Chrome ou Microsoft Edge
- WhatsApp connecté via code QR (au premier lancement)

---

## 🧪 Installation

1. **Clone le dépôt :**

```bash
git clone https://github.com/ton-utilisateur/otaku-bot
cd otaku-bot
````

2. **Installe les dépendances :**

```bash
pnpm install
```

3. **Lance le bot :**

```bash
node index.js
```

> Le script te demandera : `Quel navigateur veux-tu utiliser ? (chrome/edge)`

---

## ⚙️ Technologies utilisées

* [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) – Client WhatsApp Web en Node.js
* `readline` – Interface console pour interagir avec l'utilisateur
* `puppeteer` – Contrôle automatisé du navigateur

---

## 🔐 Sécurité

* Authentification persistante via `LocalAuth` (les données sont stockées localement).
* Seuls les **administrateurs** peuvent utiliser `!nakama` dans un groupe.

---

## 📂 Arborescence recommandée

```
otaku-bot/
├── node_modules/
├─            # Fichiers d’authentification WhatsApp (LocalAuth)
├── index.js             # Script principal
├── package.json
└── README.md
```

---

## ❓ Questions fréquentes

### Pourquoi dois-je choisir un navigateur ?

`puppeteer` a besoin d’un navigateur pour simuler WhatsApp Web. Le script te demande si tu veux utiliser Chrome ou Edge.

### Le bot ne mentionne pas tous les membres ?

Assure-toi que :

* Tu es bien **admin du groupe**
* Le message commence par `!nakama`

---

## 🧪 À venir

* Ajout d’une commande `!ask` pour intégrer une IA (Gemini ou ChatGPT)
* Interface graphique
* Exécutable `.exe` pour Windows

---

## 🙌 Remerciements

* Projet basé sur [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js)
* Développé avec ❤️ par \Amos Issa

---

## 📝 Licence

Ce projet est open-source sous la licence MIT
