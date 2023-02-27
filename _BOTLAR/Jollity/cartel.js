const { munur } = require('../../_SYSTEM/Clients/Global.Clients');
const { Mongoose } = require('../../_SYSTEM/Databases/Global.MongoDB.Driver');
const client = global.client = new munur();
const { GUILD } = require('../../_SYSTEM/Reference/Settings');

// Client Ayarları (Başlangıç)
client.botİsmi = "Jollity"
// Client Ayarları (SON)

Mongoose.Connect()
GUILD.fetch(sistem.SUNUCU.GUILD, client)

client.fetchCommands(true, true)
client.fetchEvents()
client.connect(sistem.TOKENLER.Jollity)

// Requires Manager from discord-giveaways
const { GiveawaysManager } = require('../../_SYSTEM/Additions/Giveaway');
// Starts updating currents giveaways
const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    updateCountdownEvery: 10000,
    hasGuildMembersIntent: true,
    default: {
        botsCanWin: false,
        exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
        embedColor: 'RANDOM',
        reaction: '<:munur_giveaway:997955638195929279>'
    }
});

client.giveawaysManager = manager;