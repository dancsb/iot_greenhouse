module.exports = function () {
    return function (req, res, next) {
        switch (req.params.constraint) {
            case 'temp':
                res.locals.greenery.tempLowTreshold = undefined;
                res.locals.greenery.tempHighTreshold = undefined;
                break;
            case 'hum':
                res.locals.greenery.humLowTreshold = undefined;
                res.locals.greenery.humHighTreshold = undefined;
                break;
            case 'CO2':
                res.locals.greenery.CO2LowTreshold = undefined;
                res.locals.greenery.CO2HighTreshold = undefined;
                break;
            case 'moist':
                res.locals.greenery.moistLowTreshold = undefined;
                res.locals.greenery.moistHighTreshold = undefined;
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