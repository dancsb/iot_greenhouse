const requireOption = require('../requireOption');
const mongoose = require('mongoose');

module.exports = function (objectrepository) {

    const GreeneryModel = requireOption(objectrepository, 'GreeneryModel');

    return function(req, res, next) {
        GreeneryModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(req.params.greeneryid)} },
            { $lookup: {
                from: 'sensorboxes',
                localField: '_id',
                foreignField: '_greenery',
                as: 'sensorboxes'
            } },
            { $project: {
                count: { $size: '$sensorboxes' }
            } }
        ])
        .then((greenery) => {
            if(greenery[0].count > 0) {
                res.locals.deleteError = 'You can not delete a greenery that is assigned to a sensorbox!';
                return next();
            }
            else {
                GreeneryModel.deleteOne({
                    _id: req.params.greeneryid
                })
                .then(() => {
                    return res.redirect('/greeneries');
                })
                .catch(err => {
                    return next(err);
                });
            }
        })
        .catch(err => {
            return next(err);
        });
    };

};