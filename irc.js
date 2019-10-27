const Banchojs = require('bancho.js');
const config = require('./config.json');

let lobby;

const client = new Banchojs.BanchoClient({
    username: config.irc.user,
    password: config.irc.password,
    apiKey: config.irc.apiKey
});

client.connect().then(async () => {
    console.log("Connected to Bancho.")
    const channel = await client.createLobby("osu!ucisdrbla");
    lobby = channel.lobby;
    lobby.setPassword(config.irc.lobby_password);
    console.log("Lobby created! Name: "+lobby.name+", password: "+ config.irc.lobby_password);
    console.log("Multiplayer link: https://osu.ppy.sh/mp/"+lobby.id);

    // Give host to first person
    lobby.once("playerJoined", (obj) => {
        lobby.setHost(obj.player.user.username);
    });
}).catch(console.error);

process.on("SIGINT", async () => {
    console.log("Closing lobby and disconnecting...");
    await lobby.closeLobby();
    await client.disconnect();
    console.log("Done")
});

