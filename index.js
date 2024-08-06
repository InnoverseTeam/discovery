const express = require('express');
const path = require('path');
const colors = require('colors');
const config = require('./config/http.json');
const app = express();
const { http: { port } } = config;

const routes = require('./routes/index');

app.use('/v1/endpoint', routes.API_DISCOVERY_ENDPOINT);

app.get("/", (req, res) => {
    res.redirect("/v1/endpoint");
})

app.get("/endpoint", (req, res) => {
    res.redirect("/v1/endpoint");
})

app.listen(port, () => {
    console.log(`[SERVER] The server has been successfully launched on port ${port}.`.green);
})