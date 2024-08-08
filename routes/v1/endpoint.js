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
        let message = '';
        let errorCode = 0;

        switch (error.message) {
            case 'SYSTEM_UPDATE_REQUIRED':
                message = 'SYSTEM_UPDATE_REQUIRED';
                errorCode = 1;
                break;
            case 'SETUP_NOT_COMPLETE':
                message = 'SETUP_NOT_COMPLETE';
                errorCode = 2;
                break;
            case 'SERVICE_MAINTENANCE':
                message = 'SERVICE_MAINTENANCE';
                errorCode = 3;
                break;
            case 'SERVICE_CLOSED':
                message = 'SERVICE_CLOSED';
                errorCode = 4;
                break;
            case 'PARENTAL_CONTROLS_ENABLED':
                message = 'PARENTAL_CONTROLS_ENABLED';
                errorCode = 5;
                break;
            case 'POSTING_LIMITED_PARENTAL_CONTROLS':
                message = 'POSTING_LIMITED_PARENTAL_CONTROLS';
                errorCode = 6;
                break;
            case 'NNID_BANNED':
                message = 'NNID_BANNED';
                errorCode = 7;
                break;
            default:
                message = 'SERVER_ERROR';
                errorCode = 15;
                break;
        }
    }
});

module.exports = route;