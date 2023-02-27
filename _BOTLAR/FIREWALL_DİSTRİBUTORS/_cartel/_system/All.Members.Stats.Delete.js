const { Client, Message, Util} = require("discord.js");
const StatsSchema = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Stats');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const ms = require('ms')
module.exports = {
    Isim: "stattemizle",
    Komut: ["stat-temizle"],
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
    message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **${tarihsel(Date.now() - ms("7d"))}** tarihinden itibaren olan tüm veriler temizlendi.`).setFooter("işlemi geri almak için bot yapımcısına başvurun.")]}).then(async (x) => {
    
     await StatsSchema.updateMany({ guildID: message.guild.id }, { voiceStats: new Map(), chatStats: new Map(), totalVoiceStats: 0, totalChatStats: 0 });
            let stats = await StatsSchema.find({ guildID: message.guild.id});
            stats.filter(s => !message.guild.members.cache.has(s.userID)).forEach(s => StatsSchema.findByIdAndDelete(s._id));
            await StatsSchema.updateMany({ guildID: message.guild.id }, { voiceStats: new Map(), chatStats: new Map(), totalVoiceStats: 0, totalChatStats: 0 });
            await StatsSchema.updateMany({ guildID: message.guild.id }, { voiceStats: new Map(), chatStats: new Map(), totalVoiceStats: 0, totalChatStats: 0 });
            await StatsSchema.deleteMany({ guildID: message.guild.id})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
            setTimeout(() => {
              x.delete()
            }, 13500);
    })
    }
};