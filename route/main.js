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
const delGreeneryMW = require('../middleware/greenery/delGreeneryMW');
const delGreeneryConstraintMW = require('../middleware/greenery/delGreeneryConstraintMW');
const getGreeneryMW = require('../middleware/greenery/getGreeneryMW');
const getGreeneriesMW = require('../middleware/greenery/getGreeneriesMW');

const saveSensorboxMW = require('../middleware/sensorbox/saveSensorboxMW');
const delSensorboxMW = require('../middleware/sensorbox/delSensorboxMW');
const getSensorboxMW = require('../middleware/sensorbox/getSensorboxMW');
const getSensorboxesMW = require('../middleware/sensorbox/getSensorboxesMW');

const getLogsMW = require('../middleware/log/getLogsMW');
const getLogsForSensorboxMW = require('../middleware/log/getLogsForSensorboxMW');

const UserModel = require('../models/user');
const GreeneryModel = require('../models/greenery');
const SensorboxModel = require('../models/sensorbox');
const LogModel = require('../models/log');

module.exports = function(app) {
    const objRepo = {
        UserModel: UserModel,
        GreeneryModel: GreeneryModel,
        SensorboxModel: SensorboxModel,
        LogModel: LogModel
    };

    app.get(
        '/dashboard',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
        getSensorboxesMW(objRepo),
        getLogsMW(objRepo),
        renderMW('dashboard')
    );

    app.use(
        '/adopt',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
        getGreeneriesMW(objRepo),
        getUsersMW(objRepo),
        (req, res, next) => {res.locals.sensorboxRepo = app.get('sensorboxRepo'); return next();},
        saveSensorboxMW(objRepo, app.get('sensorboxRepo')),
        renderMW('adopt')
    );

    app.get(
        '/sensorbox/:sensorboxid/del',
        authMW(objRepo),
        delSensorboxMW(objRepo, app.get('sensorboxRepo'))
    );

    app.get(
        '/sensorbox/:sensorboxid',
        authMW(objRepo),
        getLogeedInUserMW(objRepo),
        getSensorboxMW(objRepo),
        getLogsForSensorboxMW(objRepo),
        renderMW('sensorbox')
    );

    app.get(
        '/greenery/:greeneryid/:constraint/del',
        authMW(objRepo),
        getGreeneryMW(objRepo),
        delGreeneryConstraintMW()
    );

    app.get(
        '/greenery/:greeneryid/del',
        authMW(objRepo),
        delGreeneryMW(objRepo)
    );

    app.use(
        '/greenery/:greeneryid',
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
        '/user/:userid/del',
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
        getLogsMW(objRepo),
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