const path = require('path');

module.exports = {
    app: {
        name: 'telegra.ph-nodejs',
        root: path.normalize(__dirname + '/../..'),
        env: process.env.NODE_ENV,
        secret: process.env.SECRET || 'secret key' /* used in signing the jwt tokens */,
        pass: process.env.PASS || 'pass', /* generic password for seed user logins */
        port: process.env.PORT || 3010,
        cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    },
    mongo: {
        url: process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/telegraph'
    },
    oauth: {
        telegram:{
            botToken:'token'
        }
    }
}

