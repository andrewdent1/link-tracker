/**
 * Link Tracker Server
 * -------------------
 * When someone clicks your tracking link, this server:
 *  1. Logs the click (timestamp, IP, user agent)
 *  2. Sends a Slack notification
 *  3. Redirects the visitor to your product URL
 *
 * Setup:
 *   npm install express axios
 *   node server.js
 *
 * Your tracking link will be: http://localhost:3000/track
 */

const express = require("express");
const axios = require("axios");

// ─── CONFIGURE THESE ───────────────────────────────────────────────────────
const PRODUCT_URL = process.env.PRODUCT_URL; "https://app.toplinepro.com/checkout?session_id=9e237ce9-e88a-4d2d-87ab-e0f57ae59152";      // Where to redirect visitors
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL; // From api.slack.com/messaging/webhooks
const PORT = 3000;
// ───────────────────────────────────────────────────────────────────────────

const app = express();

app.get("/track", async (req, res) => {
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"] || "Unknown";
  const referrer = req.headers["referer"] || "Direct";

  // UTM params (optional — pass them along if present)
  const { utm_source, utm_medium, utm_campaign, utm_content } = req.query;

  console.log(`\n🔔 Link clicked at ${timestamp}`);
  console.log(`   IP: ${ip}`);
  console.log(`   Referrer: ${referrer}`);
  console.log(`   User Agent: ${userAgent}`);

  // Build Slack message
  const slackMessage = {
    text: "🛒 *Someone clicked your product link!*",
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "🛒 Product Link Clicked!" },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Time:*\n${timestamp}` },
          { type: "mrkdwn", text: `*IP Address:*\n${ip}` },
          { type: "mrkdwn", text: `*Referrer:*\n${referrer}` },
          { type: "mrkdwn", text: `*Device/Browser:*\n${userAgent.substring(0, 80)}` },
          ...(utm_source ? [{ type: "mrkdwn", text: `*UTM Source:*\n${utm_source}` }] : []),
          ...(utm_medium ? [{ type: "mrkdwn", text: `*UTM Medium:*\n${utm_medium}` }] : []),
          ...(utm_campaign ? [{ type: "mrkdwn", text: `*UTM Campaign:*\n${utm_campaign}` }] : []),
          ...(utm_content ? [{ type: "mrkdwn", text: `*UTM Content:*\n${utm_content}` }] : []),
        ],
      },
    ],
  };

  // Send Slack notification (non-blocking)
  try {
    await axios.post(SLACK_WEBHOOK_URL, slackMessage);
    console.log("   ✅ Slack notified");
  } catch (err) {
    console.error("   ❌ Slack notification failed:", err.message);
  }

  // Redirect visitor to product page
  res.redirect(302, PRODUCT_URL);
});

// Health check endpoint
app.get("/", (req, res) => {
  res.redirect("/track");
});

app.listen(PORT, () => {
  console.log(`\n✅ Link Tracker running on http://localhost:${PORT}`);
  console.log(`📎 Share this link: http://localhost:${PORT}/track`);
  console.log(`\n⚠️  Remember to update PRODUCT_URL and SLACK_WEBHOOK_URL in server.js\n`);
});
