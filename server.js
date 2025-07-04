const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Game server running at http://localhost:${PORT}`);
});