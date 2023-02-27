const { Client, Message, MessageEmbed} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const Beklet = new Set();
module.exports = {
    Isim: "kes",
    Komut: ["bağlantı-kes", "bkes"],
    Kullanim: "kes <@munur/ID> <Sebep>",
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
    if(Beklet.has(message.author.id)) return message.channel.send(`${cevaplar.prefix} \`Günlük Limit Aşıldı!\` ikiden fazla bağlantı kesme işlemi uygulandığı için.`).then(x => x.delete({timeout: 7500}));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if(!ramalcim) return message.channel.send(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.reply(cevaplar.sebep).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let findChannel = message.guild.kanalBul("bkes-log")
    if(findChannel) findChannel.send({embeds: [new cartelinEmbedi().setDescription(`${ramalcim} üyesi ${message.author} tarafından ${tarihsel(Date.now())} tarihinde ${ramalcim.voice.channel ? ramalcim.voice.channel : "#Kanal Bulunamadı"} belirtilen sesli kanalından atıldı.`)]})
    await ramalcim.voice.disconnect()
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined);
  

    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR') && !sistem._rooter.rooters.includes(message.member.id)) Beklet.add(message.author.id);
        setTimeout(() => {
          Beklet.delete(message.author.id);
        }, 86400000);

    ramalcim.send({embeds: [new cartelinEmbedi().setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile <t:${String(Date.now()).slice(0, 10)}:R> bulunduğun sesten atıldın.`)]}).catch(x => {
      
  })
    }
};