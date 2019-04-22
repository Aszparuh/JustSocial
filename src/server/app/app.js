const express = require('express');
const config = require('./config');

const init = (data) => {
    const app = express();

    config.applyTo(app);
    // require('./auth').applyTo(app, data);

    // app.use(require('connect-flash')());
    // app.use((req, res, next) => {
    //     res.locals.messages = require('express-messages')(req, res);
    //     next();
    // });

    require('./routers')
        .attachTo(app, data);

    return Promise.resolve(app);
};

module.exports = {
    init,
};
