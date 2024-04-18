const express = require('express');
const path = require('path');
const colors = require('colors');
const cors = require("./middleware/access_control")

const app = express();

const config_http = require('./config/http.json');

//Grab logger middleware and use it. (Logs all incoming HTTP/HTTPS requests)
const logger = require('./middleware/log');
app.use(logger);
app.use(cors)

//Grab index of all routes and set them in our express app
const routes = require('./routes/index');

app.use('/v1/endpoint', routes.API_DISCOVERY_ENDPOINT);

app.get("/", (req, res) => {
    res.redirect("/v1/endpoint")
})

//Set our app to listen on the config port
app.listen(config_http.port, () => {
    console.log("[INFO] Current Environment: %s. Listening on port %d.".green, 
    JSON.parse(process.env.ENVIRONMENT)['ENV_NAME'], 
    process.env.PORT);
})
