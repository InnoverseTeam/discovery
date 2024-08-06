const express = require('express');
const route = express.Router();
const xmlbuilder = require('xmlbuilder');
const config = require("../../config/environments.config.json");

route.get('/', async (req, res) => {
    try {
        if (!config.endpoints || !config.endpoints.host_url || !config.endpoints.api_url || !config.endpoints.portal_url || !config.endpoints.n3ds_url) {
            throw new Error('Configuration error');
        }

        const discovery_xml = xmlbuilder.create('result', { version: '1.0', encoding: 'UTF-8' })
            .ele('has_error', '0').up()
            .ele('version', '1').up()
            .ele('endpoint')
            .ele('host', config.endpoints.host_url).up()
            .ele('api_host', config.endpoints.api_url).up()
            .ele('portal_host', config.endpoints.portal_url).up()
            .ele('n3ds_host', config.endpoints.n3ds_url).up()
            .up()
            .end({ pretty: true, allowEmpty: true });

        res.header('Content-Type', 'application/xml');
        res.header('X-Dispatch', 'Olive::Web::Discovery::V1::Endpoint-index');
        res.header('Connection', 'close');
        res.status(200).send(discovery_xml);
    } catch (error) {
        const error_xml = xmlbuilder.create('result', { version: '1.0', encoding: 'UTF-8' })
            .ele('has_error', '1').up()
            .ele('version', '1').up()
            .ele('code', '400').up()
            .ele('error_code', '3').up()
            .ele('message', 'SERVICE_MAINTENANCE').up()
            .up()
            .end({ pretty: true, allowEmpty: true });

        res.header('Content-Type', 'application/xml');
        res.header('X-Dispatch', 'Olive::Web::Discovery::V1::Endpoint-index');
        res.header('Connection', 'close');
        res.status(400).send(error_xml);
    }
});

module.exports = route;