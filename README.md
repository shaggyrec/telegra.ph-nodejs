# Telegraph on NodeJS width Telegram OAuth
NodeJS realisation of Telegram's Telegraph and new Oauth

Telegram OAuth: https://core.telegram.org/widgets/login

## before run:
###### Create telegram bot
https://core.telegram.org/bots#3-how-do-i-create-a-bot

###### Linking your domain to the bot 
Once you have chosen a bot, send the /setdomain command to @Botfather to link your website's domain to the bot. Then configure your widget below and embed the code on your website.

###### Configure and get widget OAuth Telegram authorization
https://core.telegram.org/widgets/login

###### Edit config
in /server/config/config.js
app.secret - your secret key to crypt token
oauth.telegram.botToken - token of your bot

    npm i
    node app

_______________________

# Telegraph на NodeJS с авторизацией через Telegram OAuth

Telegram OAuth: https://core.telegram.org/widgets/login

## Предварительно:
###### Создайте бот телеграм
https://core.telegram.org/bots#3-how-do-i-create-a-bot

###### Привяжите домен к боту
Отправьте боту /setdomain @Botfather, он спросит адрес сайта

###### Сконфигурируйте виджет и получите его код
https://core.telegram.org/widgets/login

###### Поправьте кофиги
в /server/config/config.js
app.secret - секретный ключ для шифрования токена
oauth.telegram.botToken - токен бота

    npm i
    node app
