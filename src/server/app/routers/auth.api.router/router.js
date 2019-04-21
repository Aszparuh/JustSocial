const { Router } = require('express');
const validator = require('validator');
const config = require('config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const attachTo = (app, data) => {

    const apiRouter = new Router();

    apiRouter.get('/singnup', (req, res) => {
        const validationResult = validateSignupForm(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            });
        }

        data.user.create({ username: 'fnord', job: 'omnomnom' })
            .then(() => {
                data.user.findOrCreate({ where: { username: req.body.username, password: bcrypt.hashSync(req.body.password, 8) } })
            })
            .then(([user, created]) => {
                if (created) {
                    const token = jwt.sign({ id: user.id }, config.secret, {
                        expiresIn: 60 * 60 * 24 // expires in 24 hours
                    });
                    return res.status(200).json({
                        success: true,
                        message: 'You have successfully signed up! Now you should be able to log in.',
                        accessToken: token
                    });
                } else {
                    return res.status(409).json({
                        success: false,
                        message: 'Check the form for errors.',
                        errors: {
                            email: 'This email is already taken.'
                        }
                    });
                }
            })
    });

    apiRouter.post('/login', (req, res) => {
        const validationResult = validateLoginForm(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            });
        } else {
            data.user.findOne({ where: { username: req.body.username } })
                .then((user) => {
                    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                    if (!passwordIsValid) {
                        return res.status(401).json({ success: false, accessToken: null, reason: "Invalid Password!" });
                    } else {
                        var token = jwt.sign({ id: user.id }, config.secret, {
                            expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });

                        return res.status(200).send({ success: true, accessToken: token });
                    }
                })
        }
    });

    app.use('/v1/api/auth', apiRouter);
};

function validateSignupForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Please provide a correct email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Password must have at least 8 characters.';
    }

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }

    if (!isFormValid) {
        message = 'Check the form for errors.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

function validateLoginForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.email = 'Please provide your email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
    }

    if (!isFormValid) {
        message = 'Check the form for errors.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

module.exports = { attachTo };