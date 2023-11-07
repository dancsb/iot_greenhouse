const authMW = require('../middleware/auth/authMW');
const reverseAuthMW = require('../middleware/auth/reverseAuthMW');
const checkPassMW = require('../middleware/auth/checkPassMW');
const logoutMW = require('../middleware/auth/logoutMW');
const renderMW = require('../middleware/renderMW');

const getUserMW = require('../middleware/user/getUserMW');

const UserModel = require('../models/user');

module.exports = function(app) {
    const objRepo = {
        UserModel: UserModel
    };

    app.get(
        '/dashboard',
        authMW(objRepo),
        getUserMW(objRepo),
        renderMW('dashboard')
    );

    app.get(
        '/greeneries',
        authMW(objRepo),
        getUserMW(objRepo),
        renderMW('greeneries')
    );

    app.get(
        '/users',
        authMW(objRepo),
        getUserMW(objRepo),
        renderMW('users')
    );

    app.get(
        '/logs',
        authMW(objRepo),
        getUserMW(objRepo),
        renderMW('logs')
    );

    app.use(
        '/login',
        reverseAuthMW(objRepo),
        checkPassMW(objRepo),
        renderMW('login')
    );

    app.use('/logout', logoutMW(objRepo));

    app.get(
        '/',
        function(req,res){res.redirect('/login');
    });
};