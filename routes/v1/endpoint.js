const express = require('express')
const route = express.Router()

const xmlbuilder = require('xmlbuilder')

const config = require("../../../shared_config/environments.config.json")

route.get('/', async (req, res) => {
    //Create discovery URL using XMLBuilder

    var environment;

    if (req.get("x-nintendo-servicetoken")) {
        const knex = require("knex")({
            client: 'mysql',
            connection: {
              host : config.environments.account.database.database_host,
              port : 3306,
              user : config.environments.account.database.database_user,
              password : config.environments.account.database.database_password,
              database : config.environments.account.database.database
            }
        });

        const account = (await knex("accounts").where(function() {
            this.where("wiiu_service_token", req.get("x-nintendo-servicetoken")).orWhere("3ds_service_token", req.get("x-nintendo-servicetoken"))
        }))[0]

        if (!account) { environment = config.environments.live; return; }

        switch (account.environment) {
            case 'testing':
                environment = config.environments.testing
                break;
            
            case 'dev':
                environment = config.environments.dev
                break;

            case 'live':
            default:
                environment = config.environments.live
                break;
        }
    } else {
        environment = config.environments.live
    }

    const discovery_xml = xmlbuilder.create("result", {version : "1.0", encoding : "UTF-8"})
        .ele('has_error', '0').up()
        .ele('version', '1').up()
        .ele('endpoint')
            .ele('host', environment.endpoints.host_url).up()
            .ele('api_host', environment.endpoints.api_url).up()
            .ele('portal_host', environment.endpoints.portal_url).up()
            .ele('n3ds_host', environment.endpoints.n3ds_url).up()
        .up()
    .end({pretty : true, allowEmpty : true});

    //Send full XML when completed
    res.header("Content-Type", "application/xml");
    res.header("X-Dispatch", "Olive::Web::Discovery::V1::Endpoint-index");
    res.header("Connection", "close");
    res.send(discovery_xml).status(200);
    res.end();
})

module.exports = route;
