const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const SensorboxModel = requireOption(objectrepository, 'SensorboxModel');
  
    return function (req, res, next) {
        SensorboxModel.find()
        .sort({ serialNumber: 1 })
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