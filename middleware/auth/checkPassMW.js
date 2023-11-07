const crypto = require('crypto');
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const UserModel = requireOption(objectrepository, 'UserModel');

	return function (req, res, next) {

		if (typeof req.body.password === 'undefined') {
			return next();
		}

        UserModel.findOne({
            username: req.body.username
		})
        .then (function (result) {
            if (!result) {
				res.locals.error = 'No such user!';
				return next();
			}

            if (result.hash !== crypto.createHash('sha512').update(result.salt + req.body.password).digest('hex')) {
				res.locals.error = 'Incorrect password!';
				return next();
			}

			req.session.userid = result._id;

            return res.redirect('/dashboard');
        })
        .catch(function (err) {
            return next(err);
        });
	};

};	