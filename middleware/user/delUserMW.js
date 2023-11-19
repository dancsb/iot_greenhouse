const requireOption = require('../requireOption');

module.exports = function (objectrepository) {

    const UserModel = requireOption(objectrepository, 'UserModel');

    return function(req, res, next) {
        UserModel.deleteOne({
            _id: req.params.userid
        })
        .then(() => {
            return res.redirect('/users');
        })
        .catch(err => {
            return next(err);
        });
    };
};