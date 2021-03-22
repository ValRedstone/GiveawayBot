const ms = require('ms');

exports.run = async (client, message, args) => {

    message.channel.bulkDelete(1);
    
    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Vous devez avoir la permission `MANAGE_MESSAGE` pour commencer un giveaways.');
    }

    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.channel.send(`:x: Merci d'entrer un salon valide pour faire un giveaway \`${client.config.prefix}start #channel\``);
    }

    // Giveaway duration
    let giveawayDuration = args[1];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(`:x: Merci d'entrer une durée valide pour le giveaway \`${client.config.prefix}start #channel [1s/m/d]\``);
    }

    // Number of winners
    let giveawayNumberWinners = args[2];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send(`:x: Merci d'entrer un nombre valide de gagnants \`${client.config.prefix}start #channel [1s/m/d] [nombre]\``);
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(`:x: Merci de spécifier un cadeau \`${client.config.prefix}start [#channel] [1s/m/d] [nombre] [cadeau]\``);
    }

    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: giveawayNumberWinners,
        // Who hosts this giveaway
        hostedBy: client.config.hostedBy ? message.author : null,
        // Messages
        messages: {
            giveaway: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **GIVEAWAY TERMINE** 🎉🎉",
            timeRemaining: "Temps restant: **{duration}**!",
            inviteToParticipate: "Réagis avec 🎉 pour participer!",
            winMessage: "Félicitations, {winners}! Tu as gagné **{prize}**!",
            embedFooter: "Giveaways",
            noWinner: "Giveaway annulé, aucune participations.",
            hostedBy: "Offert par: {user}",
            winners: "Gagnant(s)",
            endedAt: "Terminé à",
            units: {
                seconds: "secondes",
                minutes: "minutes",
                hours: "heures",
                days: "jours",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });

    message.channel.send(`Giveaway démaré dans ${giveawayChannel}!`);

};
