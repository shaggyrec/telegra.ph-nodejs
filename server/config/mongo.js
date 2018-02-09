const mongodb = require('mongodb')
const connect = mongodb.connect
const config = require('./config')

// extending and exposing top co-mongo namespace like this is not optimal but it saves the user from one extra require();
module.exports = mongodb;

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
mongodb.connect = async (ctx) => {
    if (mongodb.db) {
        await mongodb.db.close();
    }
    // export mongo db instance
    const db = mongodb.db = await connect(config.mongo.url);
    // export default collections
    mongodb.users = db.collection('users');
    mongodb.posts = db.collection('posts');
}