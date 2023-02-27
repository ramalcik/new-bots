const { munur } = require('../../_SYSTEM/Clients/Guard.Clients');
const { Mongoose } = require('../../_SYSTEM/Databases/Global.MongoDB.Driver');
const client = global.client = new munur();
const { GUILD } = require('../../_SYSTEM/Reference/Settings');
const { Collection } = require('discord.js');

// Client Ayarları (Başlangıç)
client.botİsmi = "FIREWALL_ONE"
// Client Ayarları (SON)

Mongoose.Connect()
GUILD.fetch(sistem.SUNUCU.GUILD)
client.fetchCommands(false)
client.fetchEvents()
client.connect(sistem.TOKENLER.FIREWALL.FIREWALL_ONE)

