const express = require('express');
const axios = require('axios');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
app.use(express.json());
console.log("CHATWOOT_API:", process.env.CHATWOOT_API);

app.post('/webhook', async (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));
  const message = req.body.content;

  if (message.startsWith('/ask')) {
    const query = message.replace('/ask', '').trim();

    try {
      // Call mock Outline API
      const response = await axios.get(`http://localhost:7001/api/docs`, { params: { q: query } });

      // Log bot response before sending
      console.log("Posting response:", response.data.answer);

      // Send response to Chatwoot
 await axios.post(
  `${process.env.CHATWOOT_API}/accounts/${process.env.ACCOUNT_ID}/conversations/${req.body.conversation.id}/messages`,
{
     content: response.data.answer,
    message_type: 'outgoing'
  },
  {
    headers: {
      api_access_token: process.env.CHATWOOT_BOT_TOKEN
    }
  }
);


    } catch (err) {
      console.error("❌ Error sending bot message to Chatwoot:", err.response?.data || err.message);
    }
  }

  res.sendStatus(200);
});

app.listen(process.env.PORT || 7000, () => console.log(`Bot running on port ${process.env.PORT || 7000}`));
