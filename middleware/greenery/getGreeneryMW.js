const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const GreeneryModel = requireOption(objectrepository, 'GreeneryModel');
  
    return function (req, res, next) {
        GreeneryModel.findOne({
        	_id: req.params.greeneryid
        })
        .then (function (greenery) {
            if (!greenery) {
            	return next();
            }

        	res.locals.greenery = greenery;
            return next();
        })
        .catch(function (err) {
            return next(err);
        });
    };

};