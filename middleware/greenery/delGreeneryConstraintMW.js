module.exports = function () {
    return function (req, res, next) {
        switch (req.params.constraint) {
            case 'temp':
                res.locals.greenery.tempLowThreshold = undefined;
                res.locals.greenery.tempHighThreshold = undefined;
                break;
            case 'hum':
                res.locals.greenery.humLowThreshold = undefined;
                res.locals.greenery.humHighThreshold = undefined;
                break;
            case 'CO2':
                res.locals.greenery.CO2LowThreshold = undefined;
                res.locals.greenery.CO2HighThreshold = undefined;
                break;
            case 'moist':
                res.locals.greenery.moistLowThreshold = undefined;
                res.locals.greenery.moistHighThreshold = undefined;
                break;
            default:
                res.locals.error = 'Constraint not found!';
                return next();
        };

        res.locals.greenery.save()
        .then(() => {
            return res.redirect('/greeneries/' + req.params.greeneryid);
        })
        .catch(err => {
            return next(err);
        });
    };
};