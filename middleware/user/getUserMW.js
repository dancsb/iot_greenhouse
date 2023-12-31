const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const UserModel = requireOption(objectrepository, 'UserModel');
  
    return function (req, res, next) {
        UserModel.findOne({
        	_id: req.params.userid
        })
        .then (function (user) {
            if (!user) {
            	return next();
            }

        	res.locals.user = user;
            return next();
        })
        .catch(function (err) {
            return next(err);
        });
    };

};