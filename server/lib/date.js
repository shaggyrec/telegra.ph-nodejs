const moment = require('moment');

exports.formate = (date) => {
    date = new Date(date);
    moment.locale('ru');
    return moment(date).format('lll');
};