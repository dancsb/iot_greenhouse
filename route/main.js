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
        '/greeneries',
        renderMW('greeneries')
    );

    app.get(
        '/users',
        renderMW('users')
    );

    app.get(
        '/logs',
        renderMW('logs')
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