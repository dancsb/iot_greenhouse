const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const LogModel = requireOption(objectrepository, 'LogModel');
  
    return function (req, res, next) {
        LogModel.aggregate([
            { $match: { serialNumber: req.params.sensorboxid } },
            { $sort: { date: -1 } },
            { $limit: 5 }
        ])
        .then (function (logs) {
            if (!logs) {
            	return next();
            }

        	res.locals.logs = logs;
            return next();
        })
        .catch(function (err) {
            return next(err);
        });
    };

};