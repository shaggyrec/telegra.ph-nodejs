const Router = require('koa-router')
const router = new Router()
const mongo = require('../config/mongo')
const date = require('../lib/date')
const {toHtml} = require('../lib/quill')

exports.init = function (app) {
    router.get('/', list);
    router.get('/:alias', show);
    app.use(router.routes());
};

async function list(ctx,next) {
    let posts = await mongo.posts.find(
        {},
        {limit: 15, sort: {_id: -1}}).toArray();
    posts.forEach(function (post) {
        delete post._id;
        post.created = date.formate(post.created);
    });

    await ctx.render('list',
        {
            post:{
                title:'Я - программист! Статьи на темы программирования для новичков и опытных',
                description: 'Статьи, полезные материалы, истории из жизни от программиста для програмиистов, авторский блог, всё из личного опыта'
            },
            posts: posts,
            user: ctx.state.user
        })
}

async function show(ctx,next) {
    let post = await mongo.posts.findOneAndUpdate({"path": ctx.params.alias/*,"isActive": true*/},{$inc: {countviews: 1}},{returnNewDocument:true});
    post = post.value
    if(!post) {
        await next();
        return;
    }
    post.content = toHtml(post.content)
    post.created = Math.round(+(post.created)/1000)

    await ctx.render('post', { post: post, user: ctx.state.user});
}