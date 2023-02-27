const { Message, MessageEmbed } = require("discord.js");
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const GUILDS_SETTINGS = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
const Settings = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const commandBlocks = require('../../../../_SYSTEM/Databases/Schemas/Others/Users.Command.Blocks');
const ms = require('ms');
const spamCommandCount = new Map()
 /**
 * @param {Message} message 
 */

module.exports = async (message) => { 
    // Sync Data's
    let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
    ayarlar = client._settings = global.ayarlar = global._settings = kanallar = client._channels = global.kanallar = global.channels =  roller = client._roles = global.roller = global._roles = Data.Ayarlar
    emojiler = client._emojis = global.emojiler = global._emojis = require('../../../../_SYSTEM/GlobalSystem/emojiler.json');
    cevaplar = client._reply = global.cevaplar = global._reply = require('../../../../_SYSTEM/GlobalSystem/cevaplar');
    var reload = require('require-reload')(require);
    _statSystem = global._statSystem =  reload('../../../../_SYSTEM/Additions/Staff/Sources/_settings.js');
    // Sync Data's

    if (message.author.bot || !global.sistem.botSettings.Prefixs.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(global.sistem.botSettings.Prefixs.some(x => x.length)).split(" ");
    let komutcuklar = args[0].toLocaleLowerCase()
    let munur = message.client;
    args = args.splice(1);
    let calistirici;
    let TalentPerms;
    if(munur.commands.has(komutcuklar) || munur.aliases.has(komutcuklar)) {
      if((kanallar.izinliKanallar && !kanallar.izinliKanallar.some(x => message.channel.id == x)) && !message.member.permissions.has("ADMINISTRATOR") && !sistem._rooter.rooters.includes(message.member.id) && !["temizle","sil","booster","b","snipe","afk","kilit"].some(x => komutcuklar == x) ) {
        return 
      }
      try {
          calistirici = munur.commands.get(komutcuklar) || munur.aliases.get(komutcuklar);
          if(calistirici) calistirici.onRequest(munur, message, args);
      } catch (err) {
        message.channel.send({content: `Bu komut çalıştırılırken hata oluştu... \`\`\`${err}\`\`\` `}).then(x => { 
          client.logger.log(`${komutcuklar} isimli komut çalıştırılırken hata oluştu.`,"error")
          setTimeout(() => {
            x.delete()
          }, 7500)
        })
     }
    } 

};

module.exports.config = {
    Event: "messageCreate"
};
