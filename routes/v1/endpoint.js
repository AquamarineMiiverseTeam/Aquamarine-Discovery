const express = require('express')
const route = express.Router()

const xmlbuilder = require('xmlbuilder')

const config = require('../../../Aquamarine-Utils/config/endpoints.json')

route.get('/', (req, res) => {
    //Create discovery URL using XMLBuilder
    const discovery_xml = xmlbuilder.create("result", {version : "1.0", encoding : "UTF-8"})
        .ele('has_error', '0').up()
        .ele('version', '1').up()
        .ele('endpoint')
            .ele('host', config.host_url).up()
            .ele('api_host', config.api_url).up()
            .ele('portal_host', config.portal_url).up()
            .ele('n3ds_host', config.n3ds_url).up()
        .up()
    .end({pretty : true, allowEmpty : true});

    //Send full XML when completed
    res.header("Content-Type", "application/xml");
    res.header("X-Dispatch", "Olive::Web::Discovery::V1::Endpoint-index");
    res.header("Connection", "close");
    res.send(discovery_xml).status(200);
    res.connection.end();
    res.end();
})

module.exports = route;
