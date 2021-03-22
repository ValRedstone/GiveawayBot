const ms = require('ms');

exports.run = async (client, message, args) => {

    message.channel.bulkDelete(1);
    
    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Vous devez avoir la permission `MANAGE_MESSAGE` pour reroll un giveaway.');
    }

    // If no message ID or giveaway name is specified
    if(!args[0]){
        return message.channel.send(`:x: Merci de spécifier l'id d'un giveaway!\n\`${client.config.prefix}reroll giveawayID\``);
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Search with giveaway ID
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
        return message.channel.send('Impossible de trouver un giveaway pour `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.channel.send('Giveaway reroll!');
    })
    .catch((e) => {
        if(e.startsWith(`Le giveaway avec cet ID de message ${giveaway.messageID} n'est pas fini.`)){
            message.channel.send("Ce giveaway n'est pas terminé!");
        } else {
            console.error(e);
            message.channel.send("Une erreur c'est produite...");
        }
    });

};
