const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

    const GreeneryModel = requireOption(objectrepository, 'GreeneryModel');

    return async function (req, res, next) {
        if (
            (typeof req.body.greeneryname === 'undefined') &&
            (typeof req.body.source === 'undefined' ||
            typeof req.body.lowTresh === 'undefined' ||
            typeof req.body.highTresh === 'undefined')
        ) {
            return next();
        }

        var uj = false;
        if (typeof res.locals.greenery === 'undefined') {
            res.locals.greenery = new GreeneryModel();
            uj = true;

            res.locals.greenery.name = req.body.greeneryname;

            if (
                req.body.greeneryname === ''
            ) {
                res.locals.error = 'Fill in all the fields!';
                return next();
            }
        } else {
            if (
                req.body.lowTresh === '' ||
                req.body.highTresh === ''
            ) {
                res.locals.error = 'Fill in all the fields!';
                return next();
            }

            switch (req.body.source) {
                case 'temp':
                    res.locals.greenery.tempLowTreshold = req.body.lowTresh;
                    res.locals.greenery.tempHighTreshold = req.body.highTresh;
                    break;
                case 'hum':
                    res.locals.greenery.humLowTreshold = req.body.lowTresh;
                    res.locals.greenery.humHighTreshold = req.body.highTresh;
                    break;
                case 'CO2':
                    res.locals.greenery.CO2LowTreshold = req.body.lowTresh;
                    res.locals.greenery.CO2HighTreshold = req.body.highTresh;
                    break;
                case 'moist':
                    res.locals.greenery.moistLowTreshold = req.body.lowTresh;
                    res.locals.greenery.moistHighTreshold = req.body.highTresh;
                    break;
                default:
                    res.locals.error = 'Fill in all the fields!';
                    return next();
            };
        }

        res.locals.greenery.save()
        .then(() => {
            if (uj)
                return res.redirect('/greeneries');
            else
                return res.redirect('/greeneries/' + req.params.greeneryid);
        })
        .catch(err => {
            return next(err);
        });
    };

};