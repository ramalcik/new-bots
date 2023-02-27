const { Client, Message, MessageEmbed } = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

module.exports = {
    Isim: "dağıt",
    Komut: ["dagit"],
    Kullanim: "dağıt",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {

    if(!sistem._rooter.rooters.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let voiceChannel = message.member.voice.channelId;
    if (!voiceChannel) return message.reply(`${cevaplar.prefix} Ses kanalında olmadığın için işlem iptal edildi.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    let publicRooms = message.guild.channels.cache.filter(c => c.parentId === kanallar.publicKategorisi && c.id !== kanallar.sleepRoom && c.type === "GUILD_VOICE");
    message.member.voice.channel.members.array().forEach((m, index) => {
      setTimeout(() => {
         if (m.voice.channelId !== voiceChannel) return;
         m.voice.setChannel(publicRooms.random());
      }, index*1000);
    });
    message.reply(`${message.guild.emojiGöster(emojiler.onay_munur)} \`${message.member.voice.channel.name}\` adlı ses kanalındaki üyeleri rastgele public odalara dağıtılmaya başladım!`);
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
  }
}