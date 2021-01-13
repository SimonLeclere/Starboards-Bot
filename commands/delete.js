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

    const starboardsInThisChannel = client.starboardsManager.starboards.filter(s => s.channelID === message.channel.id);
    if(starboardsInThisChannel.length < 1) return message.channel.send('There is no starboard in this channel.');

    if(!starboardsInThisChannel.find(s => s.options.emoji === emoji)) {
        return message.channel.send(
            `There is no starboard in this channel with the emoji ${emoji}.\n` +
            'Here is the list of the starboards of this channel :\n' +
            starboardsInThisChannel.map((s, r) => `${r+1}. ${s.options.emoji}`).join('\n')
        )
    }

    client.starboardsManager.delete(message.channel.id, emoji)

    message.channel.send(`The ${message.channel} channel is no longer a starboard!`);

};