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
            { $lookup: {
                from: 'users',
                localField: '_supervisor',
                foreignField: '_id',
                as: 'supervisor'
            } },
            { $sort: { serialNumber: 1 } },
            { $unwind: { path: '$greenery' } },
            { $unwind: { path: '$supervisor' } }
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