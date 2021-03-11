const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
client.config = config;

const StarboardsManager = require('discord-starboards');
const manager = new StarboardsManager(client, {
    storage: false,
});
client.starboardsManager = manager;

/* Load all events */
fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Event loaded: ${eventName}`);
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.commands = new Discord.Collection();

/* Load all commands */
fs.readdir("./commands/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        console.log(`Command loaded: ${commandName}`);
    });
});

// Login
client.login(config.token);


manager.on('starboardCreate', (data) => {
    const channel = client.channels.cache.get(data.channelID);
    channel.send(`The ${channel} channel is now a starboard!`);
});

manager.on('starboardDelete', (data) => {
    const channel = client.channels.cache.get(data.channelID);
    if (channel) channel.send(`Starboard deleted ! ChannelID: ${data.channelID}`);
});

manager.on('starboardReactionNsfw', (emoji, message, user) => {
    message.channel.send(`${user.username}, you cannot add messages from an nsfw channel to the starboard.`)
});

manager.on('starboardNoSelfStar', (emoji, message, user) => {
    message.channel.send(`${user.username}, you cannot star your own messages.`)
});

manager.on('starboardNoStarBot', (emoji, message, user) => {
    message.channel.send(`${user.username}, you cannot star bot messages.`)
});

manager.on('starboardAlreadyStarred', (emoji, message, user) => {
    message.channel.send(`${user.username}, this message is already in the starboard.`)
});

manager.on('starboardNoEmptyMsg', (emoji, message, user) => {
    message.channel.send(`${user.username}, you cannot star an empty message.`)
});



const transform = require('lodash.transform');
const isEqual = require('lodash.isequal');
const isObject = require('lodash.isobject');

function difference(object, base) {
	function changes(obj, base2) {
		return transform(obj, function(result, value, key) {
			if (!isEqual(value, base2[key])) {
				result[key] = (isObject(value) && isObject(base2[key])) ? changes(value, base2[key]) : value;
			}
		});
	}
	return changes(object, base);
}


manager.on('starboardEdited', (old, updated) => {

    const diff = difference(old.options, updated.options);

    const embed = new Discord.MessageEmbed()
        .setTitle('Starboard edited !')
        .setDescription('Here are the modified options')
    
    for(const element in diff) {
        embed.addField(element, diff[element], true);
    }

    const channel = client.channels.cache.get(updated.channelID);
    if(channel) return channel.send(embed);

})
