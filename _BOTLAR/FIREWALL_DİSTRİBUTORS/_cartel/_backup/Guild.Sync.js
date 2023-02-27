const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const { guildBackup } = require('../../../../_SYSTEM/Reference/Guild.Sync');
module.exports = {
    Isim: "sync",
    Komut: ["senk","senkronizasyon"],
    Kullanim: "sync",
    Aciklama: "Sunucudaki üyeler içerisinde tagı olmayanları kayıtsıza at.",
    Kategori: "-",
    Extend: false,
    
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
    if(!sistem._rooter.rooters.includes(message.member.id)) return;
    const embed = new cartelinEmbedi() 
    await guildBackup.guildChannels()
    await guildBackup.guildRoles()
    message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **${message.guild.name}** sunucusunun rol ve kanal senkronizasyonu güncellendi.`)]})
    .then(x => {
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 8500);
    })
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    client.logger.log(`ROL => Manuel olarak senkronizasyon işlemi gerçekleştirildi. (${message.author.tag})`, "backup") 
 }
};