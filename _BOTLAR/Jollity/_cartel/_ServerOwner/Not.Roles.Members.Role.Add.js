const { Client, Message, MessageEmbed} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

module.exports = {
    Isim: "rolsuzver",
    Komut: ["rolsüzver"],
    Kullanim: "rolsüzver",
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
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new cartelinEmbedi()
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let rolsuzramalcim =  message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guildId).size == 0);
    rolsuzramalcim.forEach(roluolmayanlar => { 
        roluolmayanlar.setRoles(roller.kayıtsızRolleri).catch(err => {})
    });
    message.channel.send({embeds: [embed.setDescription(`Sunucuda rolü olmayan \`${rolsuzramalcim.size}\` üyeye kayıtsız rolü verilmeye başlandı!`)]}).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
    })

    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
};