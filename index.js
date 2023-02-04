const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('./src/db');
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const routes = require('./src/routes/index');
app.use("/api", routes);
app.get('/', (req, res) => {
    res.send({ message: 'server is working' });
})

app.listen(process.env.PORT, () => console.log('server has started'));