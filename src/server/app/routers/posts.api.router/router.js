const { Router } = require('express');
const authCheck = require('../../helpers/auth-check');
const attachTo = (app, data) => {
    const apiRouter = new Router();

    apiRouter
        .get('/', (req, res) => {
            authCheck(req, res, data);
            return data.post.findAll()
                .then((posts) => {
                    return res.send(posts);
                });
        });

    app.use('/v1/api/posts', apiRouter);
};
  
module.exports = { attachTo };
