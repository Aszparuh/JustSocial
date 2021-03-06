/* globals __dirname */

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
var cors = require('cors');

const applyTo = (app) => {

    app.use(cors());
    app.options('*', cors())
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const libsPath = path.join(__dirname, '../../node_modules/');
    app.use('/libs', express.static(libsPath));

    const staticsPath = path.join(__dirname, '../../static');
    app.use('/static', express.static(staticsPath));
};

module.exports = { applyTo };
