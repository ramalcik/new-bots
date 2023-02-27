const { Client, Message, MessageEmbed} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

module.exports = {
    Isim: "taşı",
    Komut: ["kanal-taşı"],
    Kullanim: "taşı <@munur/ID> <Kanal ID>",
    Aciklama: "Belirlenen üyeyi sesten atar.",
    Kategori: "yetkili",
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
    if(!roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let kanal = message.guild.channels.cache.get(args[1]);
    if(!kanal) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!kanal.type == "GUILD_VOICE") return message.reply(`${cevaplar.prefix} \`Ses kanalı değil!\` Belirtilen kanal ses kanalı değil.`).then(x => x.delete({timeout: 8500}));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim.voice.channel) return message.reply(`${cevaplar.prefix} \`Seste Bulunamadı!\` Belirtilen üye seste bulunamadı.`).then(x => x.delete({timeout: 8500}));
    await ramalcim.voice.setChannel(kanal.id)
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined);
    ramalcim.send({embeds: [new cartelinEmbedi().setDescription(`${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> ${kanal.name} adlı kanala taşındın.`)]}).catch(x => {
     
  })
    }
};