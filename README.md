# 🔔 Link Tracker with Slack Notifications

Track every click on your product link and get instantly notified in Slack.

---

## Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Edit `server.js` — set your two values
```js
const PRODUCT_URL = "https://your-product-page.com";
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL";
```

> **Get a free Slack Webhook URL:**
> 1. Go to https://api.slack.com/messaging/webhooks
> 2. Click "Create your Slack app"
> 3. Enable "Incoming Webhooks"
> 4. Add to your workspace & copy the Webhook URL

### 3. Start the server
```bash
node server.js
```

### 4. Your tracking link is ready
```
http://localhost:3000/track
```

---

## Sharing Your Link Publicly (3 options)

Your `localhost` link only works on your own machine. To share it with real buyers, use one of these:

### Option A: ngrok (easiest, free)
Expose your local server to the internet instantly.

```bash
# Install ngrok from https://ngrok.com
ngrok http 3000
```
ngrok gives you a public URL like `https://abc123.ngrok.io/track` — share that link.

### Option B: Deploy to Railway (free tier, permanent)
1. Push this folder to a GitHub repo
2. Go to https://railway.app → "New Project" → "Deploy from GitHub"
3. Set env variables `PRODUCT_URL` and `SLACK_WEBHOOK_URL` in the Railway dashboard
4. Railway gives you a permanent public URL

### Option C: Deploy to Render (free tier, permanent)
1. Push to GitHub
2. Go to https://render.com → "New Web Service"
3. Connect your repo, set env variables
4. Free permanent URL provided

---

## Your Tracking Link with UTM Parameters

You can add UTM tags to your link and they'll appear in your Slack notification:

```
http://localhost:3000/track?utm_source=instagram&utm_medium=social&utm_campaign=launch
```

Each click will show in Slack:
- 🕐 Timestamp
- 🌍 IP address
- 🔗 Referrer (where they came from)
- 📱 Device / browser
- 📊 UTM parameters (if present)
