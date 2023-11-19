const crypto = require('crypto');
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

    const UserModel = requireOption(objectrepository, 'UserModel');

    return async function (req, res, next) {
        if (
            typeof req.body.username === 'undefined' ||
            typeof req.body.note === 'undefined' ||
            typeof req.body.password === 'undefined'
        ) {
            return next();
        }

        if (typeof res.locals.user === 'undefined') {
            res.locals.user = new UserModel();
        }

        res.locals.user.username = req.body.username;
        res.locals.user.note = req.body.note;
        
        crypto.generateKey('aes', { length: 256 }, (err, key) => {
            if (err) {
                res.locals.error = 'Cryptography error!';
                return next();
            };

            res.locals.user.salt = key.export().toString('hex');
            res.locals.user.hash = crypto.createHash('sha512').update(res.locals.user.salt + req.body.password).digest('hex');
        });

        if (await UserModel.exists({ username: req.body.username })) {
            res.locals.error = 'The username is already in use!';
            return next();
        }

        if (req.body.password.length < 8) {
            res.locals.error = 'The password must be at least 8 characters long!';
            return next();
        }

        if (
            req.body.username === '' ||
            req.body.password === ''
        ) {
            res.locals.error = 'Fill in all the fields!';
            return next();
        }

        res.locals.user.save()
        .then(() => {
            return res.redirect('/users');
        })
        .catch(err => {
            return next(err);
        });
    };

};