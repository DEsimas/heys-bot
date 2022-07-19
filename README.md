# Heys bot

## Description

This is discord bot created for getting hentai arts. It provides an interactional embed with images from different websites. There is also a blacklisting system for disabling unwanted posts. Also works in DMs.

## Using
This bot can be added on your server using this [link](https://discord.com/api/oauth2/authorize?client_id=883051590959894538&permissions=0&scope=bot)

## Hosting
clone repository
```
git clone https://github.com/DEsimas/heys-bot
```
add .env file with all neded variables

install dependencies
```
npm i
```
build project
```
npm run build
```
start bot
```
npm run start
```

### OR

install bot to your project
```
npm i heys-bot
```
create .env file and declare variable MODE with value PACKAGE
```
MODE = PACKAGE
```
import and start bot
```
import { Bot } from "heys-bot";
const bot = new Bot({token: <token goes here>, mongo_uri: <mongodb uri goes here>});
bot.start();
```

## .env structure
<table>
    <tr>
        <th>TOKEN</th>
        <th>token for discord bot</th>
    </tr>
    <tr>
        <th>MONGO</th>
        <th>mongodb uri</th>
    </tr>
    </tr>
        <th>MODE</th>
        <th>state "BOT" to launch as idependent application, something else for using bot as package</th>
    <tr>
</table>

## Known issues:
 <ul>
  <li>Large files can't be displayed</li>
  <li>A lot of links from realbooru are in wrong format</li>
</ul> 