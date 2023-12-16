const express = require('express');
const path = require('path');
const colors = require('colors');

const app = express();

const config_http = require('./config/http.json');

//Grab logger middleware and use it. (Logs all incoming HTTP/HTTPS requests)
const logger = require('./middleware/log');
app.use(logger);

//Grab index of all routes and set them in our express app
const routes = require('./routes/index');

app.use('/v1/endpoint', routes.API_DISCOVERY_ENDPOINT);

//Set our app to listen on the config port
app.listen(config_http.port, () => {
    console.log("[INFO] Listening on port %d".green, config_http.port);
})
