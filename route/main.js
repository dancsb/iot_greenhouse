const authMW = require('../middleware/auth/authMW');
const reverseAuthMW = require('../middleware/auth/reverseAuthMW');
const checkPassMW = require('../middleware/auth/checkPassMW');
const logoutMW = require('../middleware/auth/logoutMW');
const renderMW = require('../middleware/renderMW');

const saveUserMW = require('../middleware/user/saveUserMW');
const delUserMW = require('../middleware/user/delUserMW');
const getLogeedInUserMW = require('../middleware/user/getLogeedInUserMW');
const getUserMW = require('../middleware/user/getUserMW');
const getUsersMW = require('../middleware/user/getUsersMW');

const saveGreeneryMW = require('../middleware/greenery/saveGreeneryMW');
const getGreeneryMW = require('../middleware/greenery/getGreeneryMW');
const getGreeneriesMW = require('../middleware/greenery/getGreeneriesMW');

const UserModel = require('../models/user');
const GreeneryModel = require('../models/greenery');

module.exports = function(app) {
    const objRepo = {
        UserModel: UserModel,
        GreeneryModel: GreeneryModel
    };

    app.get(
        '/dashboard',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
        renderMW('dashboard')
    );

    app.get(
        '/adopt',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
        getGreeneriesMW(objRepo),
        renderMW('adopt')
    );

    app.use(
        '/greeneries/:greeneryid',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
        getGreeneryMW(objRepo),
        saveGreeneryMW(objRepo),
        renderMW('greenery')
    );

    app.use(
        '/greeneries',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
        getGreeneriesMW(objRepo),
        saveGreeneryMW(objRepo),
        renderMW('greeneries')
    );

    app.get(
        '/users/:userid/del',
        authMW(objRepo),
        delUserMW(objRepo),
    );

    app.use(
        '/users',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
        getUsersMW(objRepo),
        saveUserMW(objRepo),
        renderMW('users')
    );

    app.get(
        '/logs',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
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