const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const { guildBackup } = require('../../../../_SYSTEM/Reference/Guild.Backup');
const roleBackup = require('../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Roles')
const guildSettings = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings')
const CategoryChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Category.Channels");
const TextChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
module.exports = {
    Isim: "rolsenkronize",
    Komut: ["rolesync","rolsenkron","rolsync"],
    Kullanim: "rolsync @munur/ID",
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
    if (!args[0] || isNaN(args[0])) return message.reply("Lütfen eski bir rol id belirtin!")
    if (!args[1] || isNaN(args[1])) return message.reply("Lütfen izinleri senkronize olacak rol id belirtin!")
    let rolBul = message.guild.roles.cache.get(args[1])
    if(!rolBul) return message.reply("Senkron edilecek rol bulunamadı.");
    roleBackup.findOne({ roleID: args[0] }, async (err, data) => {
        const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(sistem.SUNUCU.GUILD).channels.cache.get(e.id))
        for await (const perm of channelPerm) {
          let kanal = message.guild.channels.cache.get(perm.id);
          let newPerm = {};
          perm.allow.forEach(p => {
            newPerm[p] = true;
          });
          perm.deny.forEach(p => {
            newPerm[p] = false;
          });
          kanal.permissionOverwrites.create(rolBul, newPerm).catch(error => client.logger.error(error));
        }
    })
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
  }
};