'use strict';

const  fs = require('fs')
const cors = require('koa2-cors')
const bodyParser = require('koa-better-body')
const convert = require('koa-convert')
const config = require('./config')
const serve = require('koa-static')
const jwt = require('jsonwebtoken')
const path = require('path')
const views = require('koa-views')
const appDir = path.dirname(require.main.filename)

module.exports = function (app) {
    app.use(cors({
        maxAge: config.app.cacheTime / 1000,
        credentials: true,
        methods: 'GET, HEAD, OPTIONS, PUT, POST, DELETE',
        headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }));
    app.use(convert(bodyParser()))
    app.use(views(appDir + '/server/views', {
        map: {
            html: 'pug'
        },
        extension: 'pug'
    }));
    app.use(serve(appDir + '/client'));
    app.use(async (ctx,next) => {
        const token = ctx.cookies.get('tgUser')
        if(token){
            ctx.state.user = await jwt.verify(token, config.app.secret)
        }
        await next(ctx)
    })
    require('../controllers/login').init(app)
    require('../controllers/posts').init(app)

// middleware below this line is only reached if jwt token is valid
    app.use(async (ctx,next)=>{
        if(!ctx.state.user){
            ctx.status = 404
            await ctx.render('404', {post:{title: 'Ничего такого здесь нет!'}})
        }else{
            await next()
        }
    })
// mount all the routes defined in the api controllers
    fs.readdirSync(appDir+'/server/controllers').forEach(function (file) {
        require('../controllers/' + file).init(app);
    });
};
