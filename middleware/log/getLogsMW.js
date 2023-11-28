const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

	const LogModel = requireOption(objectrepository, 'LogModel');
  
    return function (req, res, next) {
        LogModel.aggregate([
            { $sort: { date: -1 } },
            { $group: {
                _id: "$serialNumber",
                logs: { $push: "$$ROOT" }
            } },
            { $project: {
                _id: 0,
                serialNumber: "$_id",
                recentLogs: { $slice: ["$logs", 5] }
            } },
            { $sort: { serialNumber: 1 } },
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