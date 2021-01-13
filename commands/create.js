exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_CHANNELS')) {
        return message.channel.send(':x: You need to have the manage channel permissions to create a starboard.');
    }

    // Emoji
    let emoji = client.config.defaultEmoji;
    if(args[0]) emoji = args[0];

    if(client.starboardsManager.starboards.find(s => s.guildID === message.guild.id && s.options.emoji === emoji)) {
        return message.channel.send(`There is already a starboard on this server with the emoji ${emoji}`)
    }

    client.starboardsManager.create(message.channel, { emoji: emoji })
};