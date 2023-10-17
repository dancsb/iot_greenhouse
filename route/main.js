const renderMW = require('../middleware/renderMW');

module.exports = function(app) {
    app.get(
        '/login',
        renderMW('login')
    );

    app.get(
        '/dashboard',
        renderMW('dashboard')
    );

    app.get(
        '/logout',
        function(req,res){res.redirect('/login');
    });

    app.get(
        '/',
        function(req,res){res.redirect('/login');
    });
};