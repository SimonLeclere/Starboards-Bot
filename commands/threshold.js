const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_CHANNELS')) {
        return message.channel.send(':x: You need to have the manage channel permissions to delete a starboard.');
    }

    // Emoji
    let emoji = args[0];
    if(!emoji) {
        emoji = client.config.defaultEmoji;
        message.channel.send(`No emoji specified. The default emoji (${emoji}) is used instead.`)
    }

    // threshold
    let threshold = parseInt(args[0]);
    if(!threshold) {
        threshold = 1;
        message.channel.send(`Threshold reseted!`)
    }
    else {
        message.channel.send('Threshold set to ' + threshold);
    }


    client.starboardsManager.edit(message.channel.id, emoji, { threshold: threshold });

};

