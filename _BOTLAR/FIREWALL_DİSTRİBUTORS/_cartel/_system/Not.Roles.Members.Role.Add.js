const { Client, Message, MessageEmbed} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

module.exports = {
    Isim: "rolsuzver123",
    Komut: ["rolsüzver123"],
    Kullanim: "rolsüzver123",
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
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
    let rolsuzcartelim =  message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guildId).size == 0);
    rolsuzcartelim.forEach(roluolmayanlar => { 
        roluolmayanlar.setRoles(roller.kayıtsızRolleri).catch(err => {})
    });
    message.channel.send({embeds: [embed.setDescription(`Sunucuda rolü olmayan \`${rolsuzcartelim.size}\` üyeye kayıtsız rolü verilmeye başlandı!`)]}).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
    })

    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
};