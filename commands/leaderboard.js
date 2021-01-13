const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    // Emoji
    let emoji = client.config.defaultEmoji;
    if(args[0]) emoji = args[0];

    // Channel
    const channel = message.mentions.channels.first() || message.channel;

    const starboard = client.starboardsManager.starboards.find(s => s.channelID === channel.id && s.options.emoji === emoji)
    if(!starboard) return message.channel.send('No starboard found.');

    await starboard.leaderboard()
    .then(lb => {
        const content = lb.map((m, i) => `**${i+1}.** ${m.stars} ${emoji} ${m.embeds[0].description ? clean(m.embeds[0].description) : ''} ${m.image ? `[Image](${m.image})` : ''}`);
        
        const leaderboard = new Discord.MessageEmbed()
            .setTitle(`${channel.name}'s starboard - ${emoji}`)
            .setDescription(content.join('\n'))
        message.channel.send(leaderboard);
    })
    .catch((e) => {
        console.log(e);
        message.channel.send('An error occured.')
    })

};

const clean = (str) => str.startsWith('```') && str.endsWith('```') ? `\`\`\`${str.slice(3, -3)}\`\`\`` : `\`\`\`${str}\`\`\``;