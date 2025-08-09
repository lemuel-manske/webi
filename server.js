const express = require('express');
const path = require('path');

const PORT = 3000;

const SOURCES = path.join(__dirname, 'src');

const app = express();

app.use(express.static(SOURCES));

app.get('/', (_req, res) => {
  res.sendFile(path.join(SOURCES, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Local server started: http://localhost:${PORT}`);
});
