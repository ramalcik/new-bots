const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const GUILDS_SETTINGS = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
const MEETING_INFO = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Guilds.Meetings');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Staffs');
module.exports = {
    Isim: "toplantı",
    Komut: ["toplanti", "yoklama","bireysel"],
    Kullanim: "toplantı <[Bireysel: toplantı <@munur/ID>]>",
    Aciklama: "Belirtilen üyenin profil resmini büyültür.",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: async function (client) {
    client._cached = new Map();

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!ayarlar && !roller && !roller.Katıldı || !roller.üstYönetimRolleri || !roller.yönetimRolleri || !roller.kurucuRolleri || !roller.altYönetimRolleri) return message.reply(cevaplar.notSetup)
    if(!message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let embed = new cartelinEmbedi()
    let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
    let MeetingData = await MEETING_INFO.findOne({ guildID: message.guild.id })
    let meetingStatus = Data.Ayarlar.Toplantı || false
    const toplantiKanal = message.member.voice.channel;
    if(!toplantiKanal) return message.reply(`Toplantı sistemi için herhangi bir ses kanalında bulunmalısınız. ${cevaplar.prefix}`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));
    if(message.mentions.members.first() || message.guild.members.cache.get(args[0])) {
      let ramalcim = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
      if(!ramalcim) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined);
   
      let _getBireysel = client._cached.get(ramalcim.id)

      let buttons = [
        new MessageButton()
        .setLabel(`Bireysel ${_getBireysel ? "Katıldı Olarak Bitir!" : "Başlat!"}`)
        .setCustomId(_getBireysel ? "b_end" : "b_start")
        .setEmoji(_getBireysel ? "943265806547038310" : "943265806341513287")
        .setStyle("SUCCESS"),
      ]

      if(_getBireysel && _getBireysel.state == "START") buttons.push(
        new MessageButton()
        .setLabel("İzinli/Mazeretli Olarak Bitir!")
        .setCustomId("b_izinli")
        .setStyle("PRIMARY"),
        new MessageButton()
        .setLabel("Katılmadı Olarak Bitir!")
        .setCustomId("b_katilmadi")
        .setStyle("DANGER"),
        )
      let _row = new MessageActionRow().addComponents(
        buttons
      )
      
      let bmsg = await message.reply({content: `Bireysel toplantı ${ramalcim.user.tag} için yükleniyor...`})

      bmsg.edit({content: null, embeds: [new cartelinEmbedi().setDescription(`Belirtilen ${ramalcim} isimli üye için bireysel toplantı yönetimi aşağıda bulunan düğmeler ile yönetilebilir.`)], components: [_row]})

      var filter = (i) => i.user.id == message.author.id
      let _collector = bmsg.createMessageComponentCollector({filter: filter, time: 30000})

      _collector.on('collect', async (i) => {
        if(i.customId == "b_katilmadi") {
          client._cached.delete(ramalcim.id)
          await Users.updateOne({_id: ramalcim.id}, {$push: {
            "Meetings": {
            Meeting: "BİREYSEL",
            Channel: message.member.voice.channel.id,
            Date: Date.now(),
            Status: "KATILMADI"
          }}}, {upsert: true}) 
          bmsg.edit({content: null, components: [], embeds: [new cartelinEmbedi().setDescription(`${ramalcim} isimli üyenin bireysel toplantısı katılmadı olarak kaydedildi.`)]})
          i.reply({content: `Başarıyla ${ramalcim} isimli üyenin toplantısı katılmadı olarak kaydedildi.`, ephemeral: true})
          setTimeout(() => {
            bmsg.delete().catch(err => {})
          }, 5000)
        }
        if(i.customId == "b_izinli") {
          client._cached.delete(ramalcim.id)
          await Users.updateOne({_id: ramalcim.id}, {$push: {
            "Meetings": {
            Meeting: "BİREYSEL",
            Channel: message.member.voice.channel.id,
            Date: Date.now(),
            Status: "MAZERETLİ"
          }}}, {upsert: true}) 
          bmsg.edit({content: null, components: [], embeds: [new cartelinEmbedi().setDescription(`${ramalcim} isimli üyenin bireysel toplantısı mazeretli olarak kaydedildi.`)]})
          i.reply({content: `Başarıyla ${ramalcim} isimli üyenin toplantısı mazeretli olarak kaydedildi.`, ephemeral: true})
          setTimeout(() => {
            bmsg.delete().catch(err => {})
          }, 5000)
        }
        if(i.customId == "b_start") {
          bmsg.delete().catch(err => {})
          let _get = client._cached.get(ramalcim.id)
          if(_get && _get.state == "START") return i.reply({content: `Belirtilen ${ramalcim} isimli üyenin aktif bireysel toplantısı bulunmaktadır.`, ephemeral: true})
          client._cached.set(ramalcim.id, {
            state: "START",
            date: Date.now(),
            channel: toplantiKanal.id,
            author: message.author.id,
          })
          if(ramalcim.voice && !ramalcim.voice.channel) {
            ramalcim.send({content: `Merhaba! **${ramalcim.user.tag}**
Şuan da ${toplantiKanal} kanalında bireysel toplantınız başladı. 
Lütfen sese katılın aksi taktirde sizin yetkinize yaptırım olacaktır.`}).catch(err => {
  i.reply({ephemeral: true, content: `Başarıyla ${ramalcim} isimli üyenin bireysel toplantısı başladı fakat **DM** kutusu kapalı olduğundan bildiremedim. Benim yerime sen bildirir misin?`, ephemeral: true})
})
i.reply({content: `Başarıyla ${ramalcim} isimli üye ile bireysel toplantıyı başlattın.`, ephemeral :true })
          } else {
            ramalcim.send({content: `Merhaba! **${ramalcim.user.tag}**
Şuan da ${toplantiKanal} kanalında bireysel toplantınız başladı.`}).catch(err => {})
            i.reply({content: `Başarıyla ${ramalcim} isimli üyenin bireysel toplantısı başlattın. Belirtilen üye ${ramalcim.voice.channel} kanalında seste bulunuyor.`, ephemeral :true })
          }
        }
        if(i.customId == "b_end") {
          let _get = client._cached.get(ramalcim.id)
          if(!_get) return i.reply({content: `Belirtilen ${ramalcim} isimli üyenin aktif bireysel toplantısı bulunmamaktadır.`, ephemeral: true}) 
                    await Users.updateOne({_id: ramalcim.id}, {$inc: {
                      "Gold": 2
                    },$push: {
                      "Meetings": {
                      Meeting: "BİREYSEL",
                      Channel: message.member.voice.channel.id,
                      Date: Date.now(),
                      Status: "KATILDI"
                    },
                    "Transfers": { 
                      ramalcim: ramalcim.id, 
                      Tutar: 2, 
                      Tarih: Date.now(),
                      Islem: "Altın (Bireysel Toplantı Bahşişi)"
                    }
                  }}, {upsert: true}) 
                  let staffCheck = await Users.findOne({_id: ramalcim.id})
                  let Upstaff = await Upstaffs.findOne({_id: ramalcim.id})
                  if(staffCheck && staffCheck.Staff && Upstaff) await client.Upstaffs.addPoint(ramalcim.id, 50, "Toplantı")
          bmsg.edit({content: `${ramalcim.user.tag} Kişisinin bireysel toplantısı kapatılıyor.`, embeds: [], components: []})
          setTimeout(() => {
            client._cached.delete(ramalcim.id)
            bmsg.edit({content: `${ramalcim.user.tag} Kişisinin bireysel toplantısı kapatıldı.`, embeds: [
              new cartelinEmbedi().setDescription(`**Bireysel Toplantı Kapatıldı!**

${ramalcim} isimli kişisinin toplantısı ${meetingTime(Date.now() - _get.date)} sürmüş.
Toplantı verileri yetkisine yansıyacak şekilde kaydedildi ve ${message.member} tarafından sonlandırıldı.`)
            ], components: []})
          }, 3000)
        }
      })
      return;
    }
    if(toplantiKanal && toplantiKanal.members.size < 1) return message.reply(`Toplantı sistemi için ses kanalınızda en az bir kişi olmalı. ${cevaplar.prefix}`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));


    if(MeetingData && MeetingData.authorId && MeetingData.channelId && Data.Ayarlar.Toplantı && message.guild.channels.cache.get(MeetingData.channelId) && message.member.voice.channel.id != MeetingData.channelId) return message.reply(`Şuan da aktif bir toplantı var. ${message.guild.channels.cache.get(MeetingData.channelId) ? message.guild.channels.cache.get(MeetingData.channelId) : "#silinen-kanal"} kanalına girerek toplantıyı yönetebilirsin. ${cevaplar.prefix}`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));
    let Row = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId("toplantıAç")
      .setLabel(`Toplantı ${meetingStatus ? "Bitir" : "Başlat"}`)
      .setStyle(meetingStatus ? "DANGER" : "SUCCESS"),
      new MessageButton()
      .setCustomId("Yoklama")
      .setLabel("Yoklama")
      .setStyle("SECONDARY")
      .setDisabled(meetingStatus ? false : true)
    )
    if(MeetingData && MeetingData.authorId && MeetingData.channelId && MeetingData.Date && MeetingData.endAuthorId && MeetingData.endDate && MeetingData.Joining && MeetingData.Leaving) {
      embed.addField(`Son Toplantı Bilgisi ${message.guild.emojiGöster("943286130357444608")}`,`
> Toplantıya **\`${MeetingData.Joining.length}\`** yetkili katılmış ${message.guild.emojiGöster(emojiler.onay_munur)}
> Toplantıya **\`${MeetingData.Leaving.length}\`** yetkili katılmamış ${message.guild.emojiGöster(emojiler.no_munur)}
> Toplantıya **\`${MeetingData.Leaving.length + MeetingData.Joining.length}\`** yetkili katılması beklendi.
> Yetkililerin **\`%${(MeetingData.Joining.length/(MeetingData.Leaving.length + MeetingData.Joining.length)*100).toFixed(1)}\`** katılmış. **\`%${(MeetingData.Leaving.length/(MeetingData.Leaving.length + MeetingData.Joining.length)*100).toFixed(1)}\`** katılmamış. 
> Toplantı ${message.guild.channels.cache.get(MeetingData.channelId) ? message.guild.channels.cache.get(MeetingData.channelId) : "#silinen-kanal"} kanalında gerçekleşmiş.
> Toplantı **\`${tarihsel(MeetingData.Date)}\`** tarihinde <@${MeetingData.authorId}> tarafından başlatılmış.
> Toplantı **\`${tarihsel(MeetingData.endDate)}\`** tarihinde <@${MeetingData.endAuthorId}> tarafından bitirilmiş.
> Toplantı **\`${meetingTime(MeetingData.endDate - MeetingData.Date)}\`** sürmüş.`)
    }
    message.reply({components: [Row], embeds: [embed
    .setDescription(`**Merhaba** ${message.member.user.tag}
**${ayarlar.serverName}** sunucusunda şuan da toplantı durumu: **${meetingStatus ? "Aktif" : "Devre-dışı"}** ${meetingStatus ? message.guild.emojiGöster(emojiler.onay_munur) : message.guild.emojiGöster(emojiler.no_munur)}`)

    ]}).then(async (msg) => {
        var filter = (i) => i.user.id == message.member.id
        let collector = msg.createMessageComponentCollector({filter: filter, time: 120000})
        collector.on('collect', async (i) => {
          if(i.customId == "toplantıAç") {
              Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
              let meetingStatus = Data.Ayarlar.Toplantı || false
              if(meetingStatus) {
                await GUILDS_SETTINGS.updateOne({_id: 1}, {$set: {"Ayarlar.Toplantı": false}}, {upsert: true})
                await MEETING_INFO.updateOne({guildID: message.guild.id}, {$set: {
                  "endDate": Date.now(),
                  "endAuthorId": i.user.id,
                }}, {upsert: true})
                let KatilimData = await MEETING_INFO.findOne({guildID: message.guild.id}) || {Joining: [],Leaving: []};
                msg.delete().catch(err => {})
                await message.channel.send({embeds: [new cartelinEmbedi().setDescription(`Başarıyla ${message.member.voice.channel} kanalında bulunan toplandı bitirildi.
Son olarak katılım sağlayan tüm yetkililere ${message.guild.roles.cache.has(roller.Katıldı) ? message.guild.roles.cache.get(roller.Katıldı) : "@Silinen Rol"} rolü dağıtılmaya başlandı.\n
**Bitirilen Toplantı Bilgisi** ${message.guild.emojiGöster("943286130357444608")}
> Bu toplantıda katılması beklenen **(\`${KatilimData.Joining.length + KatilimData.Leaving.length} yetkili\`)**
> Bu toplantıda katılım sağlayan: **(\`${KatilimData.Joining.length} yetkili\`)** ${message.guild.emojiGöster(emojiler.onay_munur)}
> Bu toplantıda katılım sağlamayan: **(\`${KatilimData.Leaving.length} yetkili\`)** ${message.guild.emojiGöster(emojiler.no_munur)}
> Bu toplantı  **\`${meetingTime(KatilimData.endDate - KatilimData.Date)}\`** sürmüş.`)], components: []})
                if(KatilimData && KatilimData.Joining.length > 0) {
                  KatilimData.Joining.forEach(async (id) => {
                    let ramalcim = message.guild.members.cache.get(id)
                    if(ramalcim) ramalcim.roles.add(roller.Katıldı).catch(err => {}) 
                    await Users.updateOne({_id: ramalcim.id}, {$inc: {
                      "Gold": 1
                    },$push: {
                      "Meetings": {
                      Meeting: "GENEL",
                      Channel: message.member.voice.channel.id,
                      Date: Date.now(),
                      Status: "KATILDI"
                    },
                    "Transfers": { 
                      ramalcim: ramalcim.id, 
                      Tutar: 1, 
                      Tarih: Date.now(),
                      Islem: "Altın (Toplantı Bahşişi)"
                    }
                  }}, {upsert: true}) 
                  let staffCheck = await Users.findOne({_id: ramalcim.id})
                  let Upstaff = await Upstaffs.findOne({_id: ramalcim.id})
                  if(staffCheck && staffCheck.Staff && Upstaff) await client.Upstaffs.addPoint(ramalcim.id, 75, "Toplantı")
                  })
                }
                if(KatilimData && KatilimData.Leaving.length > 0) {
                  KatilimData.Leaving.forEach(async (id) => {
                    let ramalcim = message.guild.members.cache.get(id)
                    if(roller.mazeretliRolü && ramalcim.roles.cache.has(roller.mazeretliRolü)) {
                      await Users.updateOne({_id: id}, {$push: {"Meetings": 
                      {
                        Meeting: "GENEL",
                        Channel: message.member.voice.channel.id,
                        Date: Date.now(),
                        Status: "MAZERETLİ"
                      }
                    }}, {upsert: true}) 
                    } else {
                    await Users.updateOne({_id: id}, {$push: {"Meetings": 
                      {
                        Meeting: "GENEL",
                        Channel: message.member.voice.channel.id,
                        Date: Date.now(),
                        Status: "KATILMADI"
                      }
                    }}, {upsert: true}) 
                  }
                  })
                }
                await i.deferUpdate().catch(err => {})
              } else {
                msg.delete().catch(err => {})
                let katildiRolü = message.guild.roles.cache.get(roller.Katıldı)
                if(katildiRolü) katildiRolü.members.array().map(x => {
                  x.roles.remove(katildiRolü.id).catch(err => {})
                })
                await message.channel.send({embeds: [new cartelinEmbedi().setDescription(`Başarıyla ${message.member.voice.channel} kanalında toplantı başladı.`)]})
                await i.deferUpdate().catch(err => {})
                await GUILDS_SETTINGS.updateOne({_id: 1}, {$set: {"Ayarlar.Toplantı": true}}, {upsert: true})
                await MEETING_INFO.deleteMany({guildID: message.guild.id})
                await MEETING_INFO.updateOne({guildID: message.guild.id}, {$set: {
                  "Date": Date.now(),
                  "authorId": i.user.id,
                  "channelId": message.member.voice.channel.id,
                }}, {upsert: true})
              }
          }
          if(i.customId == "Yoklama") {
            let KatilimData = await MEETING_INFO.findOne({guildID: message.guild.id}) || {Joining: [],Leaving: []};
            let enAltYetkiliRolü = await message.guild.roles.cache.get(roller.altilkyetki)
            await msg.edit({embeds: [new cartelinEmbedi().setDescription(`Şuan da ${message.member.voice.channel} toplantı kanalında, yoklama alınmaya başlandı.`)]})
            let ramalcimler = message.guild.members.cache.array()
            let filterramalcim = ramalcimler.filter(ramalcim => !ramalcim.user.bot  && ramalcim.roles.highest.position >= enAltYetkiliRolü.position)
            let sestekiYetkililer = filterramalcim.filter(ramalcim => ramalcim.voice.channel && ramalcim.voice.channel.id == KatilimData.channelId);
            let sesteOlmayanYetkililer = filterramalcim.filter(ramalcim => !ramalcim.voice.channel);
            sestekiYetkililer.map(async (ramalcim) => {
              if (!KatilimData.Joining.includes(ramalcim.id) ) {
                  if(KatilimData.Leaving.includes(ramalcim.id)) {
                    await MEETING_INFO.updateOne({guildID: message.guild.id}, {$pull: {Leaving: ramalcim.id}}, {upsert: true})
                  } else {
                    await MEETING_INFO.updateOne({guildID: message.guild.id}, {$push: {Joining: ramalcim.id}}, {upsert: true})
                  }
              }
            })

            sesteOlmayanYetkililer.map(async (ramalcim) => {
              if (!KatilimData.Leaving.includes(ramalcim.id) ) {
                  if(KatilimData.Joining.includes(ramalcim.id)) {
                    await MEETING_INFO.updateOne({guildID: message.guild.id}, {$pull: {Joining: ramalcim.id}}, {upsert: true})
                  } else {
                    await MEETING_INFO.updateOne({guildID: message.guild.id}, {$push: {Leaving: ramalcim.id}}, {upsert: true})
                }
              }
            })
            await msg.edit({embeds: [new cartelinEmbedi().setDescription(`Başarıyla ${message.member.voice.channel} toplantı kanalında, yoklama alındı. ${message.guild.emojiGöster(emojiler.onay_munur)}`)]})
            await i.deferUpdate().catch(err => {})
          }
        })
        collector.on('end', async (i) => {
          msg.delete().catch(err => {})
        })
    })

      function meetingTime(duration) {  
        let arr = []
        if (duration / 3600000 > 1) {
          let val = parseInt(duration / 3600000)
          let durationn = parseInt((duration - (val * 3600000)) / 60000)
          arr.push(`${val} saat`)
          arr.push(`${durationn} dakika`)
        } else {
          let durationn = parseInt(duration / 60000)
          arr.push(`${durationn} dakika`)
        }
        return arr.join(", ") 
      };
    }
};