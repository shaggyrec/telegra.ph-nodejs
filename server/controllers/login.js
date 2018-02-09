const qs = require('querystring')
const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const mongo = require('../config/mongo')
const crypto = require('crypto');
const { strcmp } = require('../lib/utils')
const ObjectID = require('../config/mongo').ObjectID

exports.init = function (app) {
  router.post('/login', login)
  app.use(router.routes())
}

async function login(ctx,next) {
    const authData = ctx.request.fields
    const checkHash = authData.hash
    delete authData['hash']
    let dataCheck = []
    for (let key in authData) {
        dataCheck.push(key + '=' + authData[key])
    }
    dataCheck.sort();
    dataCheck.join("\n")
    const secretKey = crypto.createHash('sha256')
        .update(config.oauth.telegram.botToken)

    const hash = crypto.createHmac('sha256', dataCheck.toString(), secretKey);
    if (strcmp(hash, checkHash) === -1) {
        ctx.status = 401
        ctx.body = 'Data is NOT from Telegram'
    }
    if ( +(new Date()) - authData.auth_date > 86400) {
        ctx.status = 401
        ctx.body = 'Data is outdated'
    }

    const user = await mongo.users.findOne({id:authData.id})
    if(!user){
        await mongo.users.insertOne(authData)
    }else{
        await mongo.users.updateOne({_id: new ObjectID(user._id)},{$set:{authData}})
    }
    const token = await jwt.sign(authData, config.app.secret)
    ctx.cookies.set('tgUser', token);
    ctx.status = 200
    ctx.body = {
        user: authData
    }
}
