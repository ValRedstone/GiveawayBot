module.exports = (client) => {
        console.log(`Ready as giveaways of ${client.user.tag} to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);
}
