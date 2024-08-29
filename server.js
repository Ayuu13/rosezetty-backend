require('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
const indexRouter = require('./routes/index');

app.use(express.json());
app.use('/api', indexRouter);

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
