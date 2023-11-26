const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const GreeneryModel = requireOption(objectrepository, 'GreeneryModel');
  
    return function (req, res, next) {
        GreeneryModel.aggregate([
            { $lookup: {
                from: 'sensorboxes',
                localField: '_id',
                foreignField: '_greenery',
                as: 'sensorboxes'
            } },
            { $project: {
                _id: 1,
                name: 1,
                count: { $size: '$sensorboxes' }
            } },
            { $sort : { name : 1 } }
        ])
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