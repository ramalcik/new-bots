const { Client, Message} = require("discord.js");
const cmdBans = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Guıild.Remove.Staffs')
const { cartelinEmbedi } = require('../../../../_SYSTEM/Reference/Embed');
module.exports = {
    Isim: "haksıfırla",
    Komut: ["hak-sıfırla", "hak"],
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
    message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${cartelim} isimli üyenin \`${message.guild.name}\` sunucusunda ki yetki salma hakları \`${tarihsel(Date.now())}\` tarihinde sıfırlandı.`)]})
  }
};