const { munur } = require('../../_SYSTEM/Clients/Global.Clients');
const { Mongoose } = require('../../_SYSTEM/Databases/Global.MongoDB.Driver');
const client = global.client = new munur();
const { GUILD } = require('../../_SYSTEM/Reference/Settings');
const { Collection } = require('discord.js');

// Client Ayarları (Başlangıç)
client.invites = new Collection()
client.botİsmi = "Statistics"
// Client Ayarları (SON)

Mongoose.Connect()
GUILD.fetch(sistem.SUNUCU.GUILD)
client.fetchCommands(true, true)
client.fetchEvents()
client.connect(sistem.TOKENLER.Statistics)


// Haftalık Stat Temizleme

const StatsSchema = require('../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Stats');

var CronJob = require('cron').CronJob
let HaftalıkVeriler = new CronJob('00 00 00 * * 1', async function() { 
   let guild = client.guilds.cache.get(sistem.SUNUCU.GUILD);
   let safeMap = new Map()
   await StatsSchema.updateMany({ guildID: guild.id }, { voiceStats: safeMap, chatStats: safeMap, totalVoiceStats: 0, totalChatStats: 0 }, {multi: true});
   let stats = await StatsSchema.find({ guildID: guild.id });
   stats.filter(s => !guild.members.cache.has(s.userID)).forEach(async (s) =>  await StatsSchema.findByIdAndDelete(s._id));
   client.logger.log("Haftasonu otomatik istatistik veri temizliği!","stat")
   await StatsSchema.updateMany({ guildID: guild.id }, { voiceStats: safeMap, chatStats: safeMap, totalVoiceStats: 0, totalChatStats: 0 }, {multi: true});
}, null, true, 'Europe/Istanbul');

HaftalıkVeriler.start();

// Haftalık Stat Temizleme