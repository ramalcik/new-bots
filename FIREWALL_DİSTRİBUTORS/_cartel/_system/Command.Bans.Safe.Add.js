const { Client, Message} = require("discord.js");
const cmdBans = require('../../../../_SYSTEM/Databases/Schemas/Others/Users.Command.Blocks')
const { cartelinEmbedi } = require('../../../../_SYSTEM/Reference/Embed');
module.exports = {
    Isim: "safecmd",
    Komut: ["scmd", "scom "],
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
    let cartelim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!cartelim) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
    await cmdBans.findByIdAndDelete(cartelim.id)
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${cartelim} isimli üyenin \`${message.guild.name}\` sunucusunda ki komut yasağı \`${tarihsel(Date.now())}\` tarihinde kaldırıldı.`)]})
    let logLa = message.guild.kanalBul("safe-command-log")
    if(logLa) logLa.send(({embeds: [new cartelinEmbedi().setDescription(`${cartelim} isimli üyenin \`${message.guild.name}\` sunucusunda ki komut yasağı ${message.member} tarafından \`${tarihsel(Date.now())}\` tarihinde kaldırıldı.`)]}))
  }
};