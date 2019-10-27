const config = require('./config.json');
const Discord = require('discord.js');
const util = require('util');
const Danbooru = require('danbooru')
const irc_client = require('./irc.js');
const bot = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ['TYPING_START']
});

const multiEmbed = new Discord.RichEmbed()
    .setColor('#f988ed')
    .setTitle('Weekly osu!std lobby')
    .setDescription('The weekly osu!std lobby is up!')
    .addField('Room Name:', "osu!UCISDRBLA Standard", false)
    .addField('Password:', "maxisagod", true)
    .setFooter('<@&637950916934238218>')

bot.on("ready", () => {
    console.log(`Bot is online!\n${bot.users.size} users, in ${bot.guilds.size} servers connected.`);
    //irc_client.test();
});

bot.on("message", async message => {

    if(message.author.bot || message.system) return;

    if (message.content.indexOf(config.prefix) === 0) {
        console.log(message.author.username,': ',message.content);

        let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message

        let args = msg.split(" ");
        args.shift(); // delete the first word from the args
        let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case

        if (cmd === 'hi' || cmd === 'hello') { // the first command [I don't like ping > pong]
            message.channel.send(`Hi there ${message.author.toString()}`);
            return;
        }
        else if (cmd === 'dan') {
          const booru = new Danbooru()
          booru.posts({ tags: 'rating:safe order:rank' }).then(posts => {
            // Select a random post from posts array
            const index = Math.floor(Math.random() * posts.length)
            const post = posts[index]

            // Get post's url and create a filename for it
            const url = booru.url(post.file_url)
            const name = `${post.md5}.${post.file_ext}`
            message.channel.send(url.href);
          })
        }
        else if(cmd === 'open'){
            irc_client.open();
            message.channel.send(multiEmbed);
        }
        else if(cmd === 'close'){
            message.channel.send('Closing...');
            irc_client.close();
            message.channel.send('Done.');
        }
        else if (cmd === 'ping') { // ping > pong just in case..
            return message.channel.send('pong');
        }

        else {
            message.channel.send(`I don't know what command that is.`);
            return;
        }


    } else if (message.content.indexOf("<@"+bot.user.id) === 0 || message.content.indexOf("<@!"+bot.user.id) === 0) {

        return message.channel.send(`Use \`${config.prefix}\` to interact with me.`);
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
