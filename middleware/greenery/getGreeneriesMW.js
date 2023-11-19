const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const GreeneryModel = requireOption(objectrepository, 'GreeneryModel');
  
    return function (req, res, next) {
        GreeneryModel.find()
        .sort({ name: 1 })
        .then (function (greeneries) {
            if (!greeneries) {
            	return next();
            }

        	res.locals.greeneries = greeneries;
            return next();
        })
        .catch(function (err) {
            return next(err);
        });
    };

};