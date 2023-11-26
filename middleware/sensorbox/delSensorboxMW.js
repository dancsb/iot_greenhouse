const requireOption = require('../requireOption');

module.exports = function (objectrepository, sensorboxRepo) {

    const SensorboxModel = requireOption(objectrepository, 'SensorboxModel');

    return function(req, res, next) {
        SensorboxModel.deleteOne({
            serialNumber: req.params.sensorboxid
        })
        .then(() => {
            sensorboxRepo.find(entry => entry.serialNumber === req.params.sensorboxid && (entry.acknowledged = false));
            return res.redirect('/dashboard');
        })
        .catch(err => {
            return next(err);
        });
    };
};