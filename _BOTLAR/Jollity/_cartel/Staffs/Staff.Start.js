const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");
const Unleash = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "yetkibaşlat",
    Komut: ["ytbaşlat","ybaşlat","yetkiliyap","yetkili"],
    Kullanim: "yetkibaşlat <@munur/ID>",
    Aciklama: "Belirlenen üyeyi yetkiye davet etmek için istek gönderirsin.",
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
    let embed = new cartelinEmbedi()
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x)) && !roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kayıtsızRolleri.some(x => ramalcim.roles.cache.has(x))) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined),message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined);
    if(Date.now()-ramalcim.user.createdTimestamp < 1000*60*60*24*7 && !sistem._rooter.rooters.includes(message.member.id)) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined),message.reply(cevaplar.yenihesap).then(x => {
      setTimeout(() => {
        x.delete()
      }, 7500);
    });
    if(ayarlar.type && !ramalcim.user.username.includes(ayarlar.tag)) return message.reply({
      content: `Belirtilen üyenin üzerinde ${ayarlar.tag} sembolü bulunmadığından işleme devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    if((ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(x => ramalcim.user.username.includes(x))) return message.reply({
      content: `Belirtilen üyenin üzerinde bir tag bulunmakta! Bu nedenden dolayı yetki işlemine devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    let yetkiliRol = ramalcim.guild.roles.cache.get(roller.altilkyetki);
    let ramalcimUstRol = ramalcim.guild.roles.cache.get(ramalcim.roles.highest.id)
    if(yetkiliRol.rawPosition < ramalcimUstRol.rawPosition) return message.reply({
      content: `Belirtilen üyenin üzerinde yetkili rolü bulunmakta! Bu nedenden dolayı yetki işlemine devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    let yetkiSalma = await Unleash.findOne({_id: ramalcim.id})
    if(yetkiSalma) {
      if(yetkiSalma.unleashPoint && yetkiSalma.unleashPoint == 1) {
        embed.setFooter(`${ramalcim.user.tag} üyesi daha önce yetki salmış birdaha salarsa yetkili olamayacak.`)
      } else {
        embed.setFooter(`${ramalcim.user.tag} üyesinin yetki salma hakkı ${yetkiSalma.unleashPoint ? yetkiSalma.unleashPoint : 0} adet bulunuyor.`)
      }
      if(yetkiSalma.unleashPoint >= 2 && !sistem._rooter.rooters.includes(message.member.id)) {
        return message.reply({embeds: [new cartelinEmbedi().setFooter(`${yetkiSalma.unleashPoint} yetki salma hakkı bulunmakta.`).setDescription(`${message.guild.emojiGöster(emojiler.no_munur)} ${ramalcim} isimli üyesi birden fazla kez yetki saldığından dolayı işlem yapılamıyor.`)]}).then(x => {
          setTimeout(() => {
            x.delete()
          }, 12500);
          message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        })
      }
    }
    let kontrol = await Users.findOne({_id: ramalcim.id})
    if(kontrol && kontrol.Staff) return message.reply(`${cevaplar.prefix} ${ramalcim} isimli üye zaten yetkili olarak belirlenmiş.`);
    if(message.member.permissions.has('ADMINISTRATOR') || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) {
      message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
      await Users.updateOne({ _id: ramalcim.id }, { $set: { "Staff": true, "StaffGiveAdmin": message.member.id } }, { upsert: true })
      await Users.updateOne({ _id: message.member.id }, { $push: { "Staffs": { id: ramalcim.id, Date: Date.now() } } }, { upsert: true })
      message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim.toString()} üyesi ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> başarıyla yetkili olarak başlatıldı!`)], components: []});
      client.Upstaffs.addPoint(message.member.id,_statSystem.points.staff, "Yetkili")
      let yetkiliLog = message.guild.kanalBul("yetki-ver-log")
      if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${ramalcim} isimli üye <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından yetkili olarak başlatıldı.`)]}) 
      
      await Users.updateOne({ _id: ramalcim.id }, { $push: { "StaffLogs": {
        Date: Date.now(),
        Process: "BAŞLATILMA",
        Role: roller.başlangıçYetki,
        Author: message.member.id
      }}}, { upsert: true })
      message.member.Leaders("yetki", _statSystem.points.staff, {type: "STAFF", user: ramalcim.id})
      ramalcim.setNickname(ramalcim.displayName.replace(ayarlar.tagsiz, ayarlar.tag)).catch(err => {})      
      return ramalcim.roles.add(roller.başlangıçYetki).then(x => {
        ramalcim.roles.add(roller.altilkyetki)
  client.Upstaffs.addPoint(ramalcim.id,"1", "Bonus")
      });
    }
    let Row = new MessageActionRow().addComponents(
      new MessageButton()
      .setCustomId("OK")
      .setEmoji(message.guild.emojiGöster(emojiler.onay_munur))
      .setLabel("Kabul Ediyorum!")
      .setStyle("SUCCESS"),
      new MessageButton()
      .setCustomId("NO")
      .setEmoji(message.guild.emojiGöster(emojiler.no_munur))
      .setLabel("Kabul Etmiyorum!")
      .setStyle("SECONDARY"),
    )
    embed.setDescription(`${message.member.toString()} isimli yetkili seni **${message.guild.name}** sunucusunda ${roller.başlangıçYetki ? message.guild.roles.cache.get(roller.başlangıçYetki) ? `${message.guild.roles.cache.get(roller.başlangıçYetki)} yetkisinden yetkili` : "yetkili" : "yetkili"} yapmak istiyor. Kabul ediyor musun?`);
    await message.channel.send({content: ramalcim.toString(), embeds: [embed], components: [Row]}).then(async (msg) => {
      const filter = i => i.user.id === ramalcim.id
      const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], time: 30000 })
      collector.on('collect', async (i) => {
        if(i.customId == "OK") {
          message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
          await Users.updateOne({ _id: ramalcim.id }, { $set: { "Staff": true, "StaffGiveAdmin": message.member.id } }, { upsert: true })
          await Users.updateOne({ _id: message.member.id }, { $push: { "Staffs": { id: ramalcim.id, Date: Date.now() } } }, { upsert: true })
          msg.delete().catch(err => {})
          message.channel.send({content: null, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim.toString()} üyesi ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> başarıyla ${roller.başlangıçYetki ? message.guild.roles.cache.get(roller.başlangıçYetki) ? `${message.guild.roles.cache.get(roller.başlangıçYetki)} yetkisinde yetkili` : "yetkili" : "yetkili"} olarak başlatıldı!`)], components: []}).catch(err => {})
          let yetkiliLog = message.guild.kanalBul("yetki-ver-log")
          if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${ramalcim} isimli üye <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından yetkili olarak başlatıldı.`)]})      
          client.Upstaffs.addPoint(message.member.id,_statSystem.points.staff, "Yetkili")
          let verilcekRol = [roller.başlangıçYetki, roller.altilkyetki]
          ramalcim.setNickname(ramalcim.displayName.replace(ayarlar.tagsiz, ayarlar.tag)).catch(err => {})
          ramalcim.roles.add(verilcekRol).then(x => client.Upstaffs.addPoint(ramalcim.id,"1", "Bonus"))
          message.member.Leaders("yetki", _statSystem.points.staff, {type: "STAFF", user: ramalcim.id})
          i.deferUpdate().catch(err => {})
        }
        if(i.customId == "NO") {
          msg.edit({content: message.member.toString(), components: [],embeds: [new cartelinEmbedi().setColor("RED").setDescription(`${message.guild.emojiGöster(emojiler.no_munur)} ${ramalcim.toString()} isimli üye, **${message.guild.name}** sunucusunda yetkili olma teklifini reddetti!`)], components: []}).catch(err => {});
          message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
          i.deferUpdate().catch(err => {})
        }
      })
      collector.on('end', i => {
        msg.delete().catch(err => {})
      }) 
    }).catch(err => {})
    }
};