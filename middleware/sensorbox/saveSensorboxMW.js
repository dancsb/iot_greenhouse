const requireOption = require('../requireOption');

module.exports = function (objectrepository, sensorboxRepo) {

    const SensorboxModel = requireOption(objectrepository, 'SensorboxModel');

    return function (req, res, next) {
        if (
            typeof req.body.sensorbox === 'undefined' ||
            typeof req.body.greenery === 'undefined' ||
            typeof req.body.supervisor === 'undefined'
        ) {
            return next();
        }

        if (typeof res.locals.sensorbox === 'undefined') {
            res.locals.sensorbox = new SensorboxModel();
        }

        res.locals.sensorbox.serialNumber = req.body.sensorbox;
        res.locals.sensorbox._greenery = req.body.greenery;
        res.locals.sensorbox._supervisor = req.body.supervisor;

        if (
            req.body.sensorbox === '' ||
            req.body.greenery === '' ||
            req.body.supervisor === ''
        ) {
            res.locals.error = 'Fill in all the fields!';
            return next();
        }

        res.locals.sensorbox.save()
        .then(() => {
            sensorboxRepo.find(entry => entry.serialNumber === res.locals.sensorbox.serialNumber && (entry.greenery = res.locals.sensorbox._greenery));
            return res.redirect('/dashboard');
        })
        .catch(err => {
            return next(err);
        });
    };

};