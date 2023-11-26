const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

    const GreeneryModel = requireOption(objectrepository, 'GreeneryModel');

    return function (req, res, next) {
        if (
            (typeof req.body.greeneryname === 'undefined') &&
            (typeof req.body.source === 'undefined' ||
            typeof req.body.lowThresh === 'undefined' ||
            typeof req.body.highThresh === 'undefined')
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
                req.body.lowThresh === '' ||
                req.body.highThresh === ''
            ) {
                res.locals.error = 'Fill in all the fields!';
                return next();
            }

            switch (req.body.source) {
                case 'temp':
                    res.locals.greenery.tempLowThreshold = req.body.lowThresh;
                    res.locals.greenery.tempHighThreshold = req.body.highThresh;
                    break;
                case 'hum':
                    res.locals.greenery.humLowThreshold = req.body.lowThresh;
                    res.locals.greenery.humHighThreshold = req.body.highThresh;
                    break;
                case 'CO2':
                    res.locals.greenery.CO2LowThreshold = req.body.lowThresh;
                    res.locals.greenery.CO2HighThreshold = req.body.highThresh;
                    break;
                case 'moist':
                    res.locals.greenery.moistLowThreshold = req.body.lowThresh;
                    res.locals.greenery.moistHighThreshold = req.body.highThresh;
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