const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const SensorboxModel = requireOption(objectrepository, 'SensorboxModel');
  
    return function (req, res, next) {
        SensorboxModel.aggregate([
            { $lookup: {
                from: 'greeneries',
                localField: '_greenery',
                foreignField: '_id',
                as: 'greenery'
            } },
            { $sort: { serialNumber: 1 } },
            { $unwind: { path: '$greenery' } }
        ])
        .then (function (sensorboxes) {
            if (!sensorboxes) {
            	return next();
            }

        	res.locals.sensorboxes = sensorboxes;
            return next();
        })
        .catch(function (err) {
            return next(err);
        });
    };

};