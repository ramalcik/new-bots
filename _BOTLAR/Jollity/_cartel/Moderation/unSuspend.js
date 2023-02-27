const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const Jail = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Jails');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "şüpheliçıkart",
    Komut: ["unsuspend", "unsuspect"],
    Kullanim: "şüpheliçıkart <@munur/ID> <Sebep>",
    Aciklama: "Belirtilen üye yeni bir hesapsa onu şüpheliden çıkartır.",
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
    if(!roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let cezakontrol = await Jail.findById(ramalcim.id)
    if(cezakontrol) {
        message.channel.send(`${cevaplar.prefix} Belirtilen üye sistemsel tarafından cezalandırılmış, şüpheli çıkart komutu ile çıkartman münkün gözükmüyor.`).then(x => {
          setTimeout(() => {
            x.delete()
          }, 7500);
        });
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        return;
    };
    let User = await Users.findOne({_id: ramalcim.id});
    if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
        if(ramalcim && ramalcim.manageable) await ramalcim.setNickname(`${ayarlar.type ? ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ""}${User.Name}`)
        if(User.Gender == "Erkek") await ramalcim.setRoles(roller.erkekRolleri)
        if(User.Gender == "Kadın") await ramalcim.setRoles(roller.kadınRolleri)
        if(User.Gender == "Kayıtsız") ramalcim.setRoles(roller.kayıtsızRolleri)
        if(ramalcim.user.username.includes(ayarlar.tag)) ramalcim.roles.add(roller.tagRolü)
    } else {
        ramalcim.setRoles(roller.kayıtsızRolleri)
        if(ramalcim && ramalcim.manageable && ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
        if(ramalcim && ramalcim.manageable && !ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`İsim | Yaş`)
        if(ramalcim && ramalcim.manageable && !ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`Kayıtsız`)
        if(ramalcim && ramalcim.manageable && ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
    }
    let findChannel = message.guild.kanalBul("şüpheli-log")
    if(findChannel) findChannel.send({embeds: [new cartelinEmbedi().setDescription(`${ramalcim} kullanıcısının şüpheli durumu <t:${String(Date.now()).slice(0, 10)}:R> ${message.member} tarafından kaldırıldı.`)]})
    
    await message.reply({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim} isimli üye şüpheli hesap konumundan çıkartıldı!`)]})
    .then(x => {
      setTimeout(() => {
        x.delete()
      }, 7500);
    })
    if(ramalcim) ramalcim.send({embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.displayAvatarURL({dynamic: true})).setDescription(`${ramalcim.user.tag}, ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> şüpheliden çıkartıldın.`)]}).catch(x => {
      
    });
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
};