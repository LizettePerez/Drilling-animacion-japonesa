const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promise');

const PORT = 3000;

app.listen(PORT, () => console.log(`Iniciando en puerto ${PORT}`))