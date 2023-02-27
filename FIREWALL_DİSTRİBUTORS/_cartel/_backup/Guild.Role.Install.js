const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const { guildBackup } = require('../../../../_SYSTEM/Reference/Guild.Backup');
const roleBackup = require('../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Roles')
const guildSettings = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings')
const CategoryChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Category.Channels");
const TextChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
module.exports = {
    Isim: "rolkur",
    Komut: ["kur"],
    Kullanim: "rol @munur/ID",
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
    if (!args[0] || isNaN(args[0])) return message.reply("Lütfen bir rol belirtin!")
    await roleBackup.findOne({ roleID: args[0] }, async (err, data) => {
      if (!data) return message.channel.send(`${cevaplar.prefix} Belirtilen rol geçmişte bulunamadığından işlem iptal edildi `), message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
      let newRole;
      if(data.icon) {
       newRole = await message.guild.roles.create({
          name: data.name,
          color: data.color,
          hoist: data.hoist,
          icon: data.icon,
          permissions: data.permissions,
          position: data.position,
          mentionable: data.mentionable,
          reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
        });
      } else {
        newRole = await message.guild.roles.create({
          name: data.name,
          color: data.color,
          hoist: data.hoist,
          permissions: data.permissions,
          position: data.position,
          mentionable: data.mentionable,
          reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
        });
      }
      message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
      await message.channel.send({ embeds: [embed.setFooter("rol üyelerine dağıtılmaya ve kanal izinleri eklenmeye başlanıyor.").setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} <@&${newRole.id}> (\`${newRole.id}\`) isimli rol oluşturuldu ve gereken ayarları yapıldı.
**Dağıtılacak Rol**: ${newRole}
**Dağıtılacak Üye Sayısı**: ${data.members.length}
**Tahmini Dağıtım Süresi**: ${(data.members.length>1000 ? parseInt((data.members.length*(250/1000)) / 60)+" dakika" : parseInt(data.members.length*(250/1000))+" saniye")}`)] })
      await client.rolKur(args[0], newRole)
      await client.queryManage(args[0], newRole.id).catch(err => {})
    }).catch(err => {});

  }
};