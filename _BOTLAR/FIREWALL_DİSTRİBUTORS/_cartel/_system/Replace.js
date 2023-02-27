const { Client, Message, Collection } = Discord = require("discord.js");
const util = require("util")
const { cartelinEmbedi } = require('../../../../_SYSTEM/Reference/Embed')
module.exports = {
    Isim: "tagreplace",
    Komut: ["tagdegis","tagdeğiş","datadegis","datadeğiş", "datareplace"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let eski = args[0]
    if(!eski) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
    let yeni = args.splice(1).join(" ")
    if(!yeni) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined);
    
    const guildSettings = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
    let veriData = await guildSettings.findOne({ guildID: sistem.SUNUCU.GUILD })
    let sunucuData = veriData.Ayarlar 
    if(sunucuData) {              
        if(eski === sunucuData.tag) {
            await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.tag": yeni}}, {upsert: true})
            message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla sunucunun yeni tag'ı \`${yeni}\` olarak belirlendi.`).setFooter("sistemsel olarak değiştirildi.")]})
        }
        if(eski === sunucuData.serverName) {
          await guildSettings.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.serverName": yeni}}, {upsert: true})
      }
    }

    await message.guild.roles.cache.filter(x => x.name.includes(eski)).forEach(x => {
        x.setName(x.name.replace(eski, yeni))
    })

    await message.guild.channels.cache.filter(x => x.name.includes(eski)).forEach(x => {
        x.setName(x.name.replace(eski, yeni))
    })
    
    
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
  }
};