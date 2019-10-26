const config = require('./config.json');
const Discord = require('discord.js');
const util = require('util');
const bot = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ['TYPING_START']
});

bot.on("ready", () => {
    console.log(`Bot is online!\n${bot.users.size} users, in ${bot.guilds.size} servers connected.`);
});

bot.on("message", async message => {

    if(message.author.bot || message.system) return;
    /*
    if(message.channel.type === 'dm') { // Direct Message
        return; //Optionally handle direct messages
    }
    */
    console.log(message.content); // Log chat to console

    if (message.content.indexOf(config.prefix) === 0) {

        let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message

        let args = msg.split(" ");
        args.shift(); // delete the first word from the args
        let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case

        if (cmd === 'hi' || cmd === 'hello') { // the first command [I don't like ping > pong]
            message.channel.send(`Hi there ${message.author.toString()}`);
            return;
        }

        else if (cmd === 'ping') { // ping > pong just in case..
            return message.channel.send('pong');
        }

        else { // if the command doesn't match anything you can say something or just ignore it
            message.channel.send(`I don't know what command that is.`);
            return;
        }


    } else if (message.content.indexOf("<@"+bot.user.id) === 0 || message.content.indexOf("<@!"+bot.user.id) === 0) { // Catch @Mentions

        return message.channel.send(`Use \`${config.prefix}\` to interact with me.`); //help people learn your prefix
    }
    return;
});

// Catch Errors before they crash the app.
process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
});

process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
});

bot.login(config.token);
