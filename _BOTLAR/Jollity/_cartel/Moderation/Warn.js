const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');

module.exports = {
    Isim: "uyarı",
    Komut: ["warn"],
    Kullanim: "warn <@munur/ID>",
    Aciklama: "Belirlenen üyeyi ceza şeklinde uyarır ve cezalarına işler.",
    Kategori: "yönetim",
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
        if(!roller.warnHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(!ramalcim && message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let sebep = args.splice(1).join(" ");
        if(!sebep) return message.reply(cevaplar.sebep).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let lastWarn = await Punitives.find({Member: ramalcim.id, Type: "Uyarılma"})
        let checkRoles = [...roller.Yetkiler, ...roller.jailHammer, ...roller.üstYönetimRolleri, ...roller.yönetimRolleri,...roller.altYönetimRolleri, ...roller.kurucuRolleri]
        if(!checkRoles.some(x => ramalcim.roles.cache.has(x)) && !ramalcim.permissions.has("ADMINISTRATOR") && lastWarn.length >= 3) {
            if(roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has('ADMINISTRATOR')) {
                if(Number(ayarlar.jailLimit) && client.fetchJailLimit.get(message.member.id) >= ayarlar.jailLimit) return await ramalcim.addPunitives(6, message.member, sebep, message),message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
                ramalcim.dangerRegistrant() 
                return ramalcim.addPunitives(3, message.member, "Gereğinden fazla uyarı cezası bulunmak!" + ` (${sebep})`, message) 
            }
        }
        await ramalcim.addPunitives(6, message.member, sebep, message)
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)

    }
};


