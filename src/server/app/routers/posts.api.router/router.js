const { Router } = require('express');

const attachTo = (app, data) => {
    const apiRouter = new Router();

    apiRouter
        .get('/', (req, res) => {
            return data.post.findAll()
                .then((posts) => {
                    return res.send(posts);
                });
        });

    app.use('/v1/api/posts', apiRouter);
};

module.exports = { attachTo };

