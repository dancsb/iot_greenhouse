const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const UserModel = requireOption(objectrepository, 'UserModel');
  
    return function (req, res, next) {
        UserModel.find()
        .sort({ username: 1 })
        .then (function (users) {
            if (!users) {
            	return next();
            }

        	res.locals.users = users;
            return next();
        })
        .catch(function (err) {
            return next(err);
        });
    };

};