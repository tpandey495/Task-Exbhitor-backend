const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const passport=require('./src/config/passport-config.js');
const routes=require('./src/routes/index');
//Invoking all the functionality of express as app
const app = express();
//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret:process.env.Session_Secret,
    resave: false,
    saveUninitialized: false,
  }));  
app.use(passport.initialize());
app.use(passport.session());
//base route of api
app.use("/api", routes);
app.get('/', (req, res) => {
    res.send({ message: 'server is working' });
})

app.listen(process.env.PORT, () => console.log('server has started'));