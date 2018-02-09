const Router = require('koa-router')
const router = new Router()
const mongo = require('../config/mongo')
const date = require('../lib/date')
const md5 = require('md5')
const fs = require('fs')
const path = require('path')
const appDir = path.dirname(require.main.filename)
const S = require('string')
const translit = require('../lib/translit')
const ObjectID = require('../config/mongo').ObjectID

exports.init = function (app) {
    router.get('/new', newPost)
    router.post('/edit/check', checkUser)
    router.post('/upload', uploadPhoto)
    router.post('/edit/save', savePost)
    app.use(router.routes())
}


function checkUser(ctx, next) {
    const user = ctx.state.user
    if(!user){
        ctx.status = 403
        return
    }

    ctx.status = 200
    ctx.body = {
        author_name: user.first_name,
        author_url: 'https://t.me/' + user.username,
        can_edit: user.username === 'shogenov',
        short_name: user.first_name
    }
}

async function newPost(ctx, next){
    await ctx.render('create', { post:{title:'New Post'}, user: ctx.state.user});
}

async function uploadPhoto(ctx,next){
    const files = ctx.request.files
    const targetPath = appDir + '/client/upload/'

    if(!files) return;
    try {
       fs.readdirSync(targetPath);
    }catch(e){
        fs.mkdirSync(targetPath);
    }
    let pictures = []
    for(let file of files)
    {
        const pictureName =  md5(new Date() + Math.random() * (1000 - 9999) + 1000)
        await fs.renameSync(file.path, targetPath + pictureName + '.jpg')
        pictures.push({src:'/upload/' + pictureName + '.jpg'})
    }
    ctx.status = 201;
    ctx.body = pictures;

}

async function savePost(ctx,next) {
    let post = ctx.request.fields
    const user = ctx.state.user
    const files = ctx.request.files
    const now = new Date()
    for (let file of files){
       post.content = await fs.readFileSync(file.path, 'utf8')
    }
    if(!post.page_id){
        post.path = S(translit(post.title,5)).slugify().s
        let findPostWithSameUrl = await mongo.posts.findOne({path: post.path})
        if(findPostWithSameUrl){
            post.path += `-${now.getDate()}-${+(now.getMonth())+1}`
        }
        findPostWithSameUrl = await mongo.posts.findOne({path: post.path})
        if(findPostWithSameUrl){
            post.path += `-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
        }
        const result = await mongo.posts.insertOne({
            title: post.title,
            author: post.author,
            author_url:post.author_url,
            authorId: user.id,
            content: post.content,
            path: post.path,
            created: now.getTime()
        })
        ctx.status = 201;
        ctx.body = {path: post.path};
    }else{
        const postId = new ObjectID(post.page_id)
        const checkPost = await mongo.posts.findOne({_id:postId},{path:1})
        if(!checkPost){
            return
        }
        const result = await mongo.posts.updateOne(
            {_id:  postId},
            {$set:
                {
                    title: post.title,
                    author: post.author,
                    author_url:post.author_url,
                    content: post.content
                }
            })
        ctx.status = 200
        ctx.body = {
            path: checkPost.path,
            page_id:post.page_id
        }
    }
}