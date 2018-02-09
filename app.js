const config = require('./server/config/config')
const mongo = require('./server/config/mongo')
const koaConfig = require('./server/config/koa')
const koa = require('koa')
const app = new koa()


app.init = async (ctx) =>  {
    await mongo.connect();

    koaConfig(app);

    app.server = app.listen(config.app.port);
    if (config.app.env !== 'test') {
        console.log(config.app.name + ' listening on port ' + config.app.port);
    }
};

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
    app.init().catch(function (err) {
        console.error(err.stack);
        process.exit(1);
    });
}
