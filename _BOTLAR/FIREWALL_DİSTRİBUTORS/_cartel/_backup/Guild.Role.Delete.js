const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const { guildBackup } = require('../../../../_SYSTEM/Reference/Guild.Backup');
const roleBackup = require('../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Roles')
const guildSettings = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings')
module.exports = {
    Isim: "rolsil",
    Komut: ["rolsil"],
    Kullanim: "rolsil @munur/ID",
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
    let veriData = await guildSettings.findOne({ guildID: message.guild.id })
    let sunucuData = veriData.Ayarlar 
    const embed = new cartelinEmbedi() 
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if(!rol) message.reply({content: `${cevaplar.prefix} Lütfen geçerli bir rol belirtin!`}).then(x => setTimeout(() => {
        x.delete().catch(err => {})
    }, 7500)),message.reply(message.guild.emojiGöster(emojiler.no_munur)).catch(err => {})
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
    message.channel.send({ embeds: [embed.setFooter(`silinen rolü tekrardan kurmak istermisin? ${sistem.botSettings.Prefixs[0]}rolkur ${rol.id}`).setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **${rol.name}** (\`${rol.id}\`) isimli rol \`${message.guild.name}\` sunucusundan silindi.`)] }).then(x => {
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 35000)
    })
    setTimeout(async () => {
        await rol.delete().catch(err => {})
    }, 2500);

  }
};