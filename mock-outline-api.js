const express = require('express');
const app = express();

app.get('/api/docs', (req, res) => {
  const q = req.query.q || '';
  res.json({ answer: `You asked about "${q}". Here's your answer.` });
});

app.listen(7001, () => console.log('Mock Outline API running on port 7001'));
