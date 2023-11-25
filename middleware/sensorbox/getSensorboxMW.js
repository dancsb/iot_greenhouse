const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const SensorboxModel = requireOption(objectrepository, 'SensorboxModel');
  
    return function (req, res, next) {
        SensorboxModel.aggregate([
            { $match: { serialNumber: req.params.sensorboxid } },
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
            { $unwind: { path: '$greenery' } },
            { $unwind: { path: '$supervisor' } }
        ])
        .then (function (sensorbox) {
            if (!sensorbox) {
            	return next();
            }

        	res.locals.sensorbox = sensorbox[0];
            return next();
        })
        .catch(function (err) {
            return next(err);
        });
    };

};