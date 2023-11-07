module.exports = function () {
    return function (req, res, next) {
        if (typeof req.session.userid !== 'undefined') {
            return res.redirect('/dashboard');
        }
        
        return next();
    };
};
