const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const { guildBackup } = require('../../../../_SYSTEM/Reference/Guild.Backup');
module.exports = {
    Isim: "backup",
    Komut: ["yedekal"],
    Kullanim: "yedek @munur/ID",
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
    const embed = new cartelinEmbedi() 
    await guildBackup.guildChannels()
    await guildBackup.guildRoles()
    message.channel.send({embeds: [embed.setFooter("dilediğiniz zaman istediğiniz tarihin yedeğini tekrardan kurabilirsiniz.").setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla \`${message.guild.name}\` sunucusunun son bir saat olan yedeklemesi <t:${String(Date.now()).slice(0, 10)}:R> alındı ve kayıtlara işlendi.`)]})
    .then(x => {
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 8500);
    })
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    client.logger.log(`ROL => Manuel olarak backup işlemi gerçekleştirildi. (${message.author.tag})`, "backup") 
 }
};