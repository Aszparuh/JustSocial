/* eslint-disable no-console */

const async = () => {
    return Promise.resolve();
};

const config = require('./config');

async()
    .then(() => require('./db').init(config.username, config.password, config.host, config.dbName))
    .then(() => require('./models').init())
    .then((data) => require('./app').init(data))
    .then((app) => {
        app.listen(config.appPort, () =>
            console.log(`Magic happends at :${config.appPort}`));
    })
    .catch((err) => {
        console.log(err.message);
    });
