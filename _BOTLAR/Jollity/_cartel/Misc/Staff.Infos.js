const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = Discord = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");

module.exports = {
    Isim: "yetkilidurum",
    Komut: ["yetkili-ses","ses-yetkili","yetkili-durum","yetkilisay","yetkili-say","ysay"],
    Kullanim: "yetkilisay",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000)); 
    let Row = new MessageActionRow().addComponents(
        new MessageButton()
        .setLabel("Aktif Seste Olmayanlar")
        .setStyle("PRIMARY")
        .setCustomId("aktifseste"),
        new MessageButton()
        .setLabel("Toplam Seste Olmayanlar")
        .setStyle("PRIMARY")
        .setCustomId("toplam"),
        new MessageButton()
         .setLabel(`Toplam Yetkili Bilgisi`)
         .setStyle("SUCCESS")
         .setDisabled(false)
         .setCustomId("testt")
    )
    message.channel.send({embeds: [new cartelinEmbedi().setDescription(`Aşağıda bulunan düğmelerden yetkili aktifliğinin filtresini seçiniz.`)], components: [Row]}).then(async (msg) => {
        var filter = (i) => i.user.id == message.member.id
        let collector = msg.createMessageComponentCollector({filter: filter, max: 1})
        collector.on("collect", async (i) => {
            if(i.customId == "testt"){
                let Aloo = []
                let altyetkiler = message.guild.roles.cache.get(roller.altilkyetki)
                if(altyetkiler) altyetkiler.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri)).map(ramalcim => {
                    if(!Aloo.includes(ramalcim.id)) Aloo.push(ramalcim.id)
                })
                                     
                                         roller.altYönetimRolleri.some(x => {
                                             let rol = message.guild.roles.cache.get(x)
                                             rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri)).forEach(ramalcim => {
                                              if(!Aloo.includes(ramalcim.id)) Aloo.push(ramalcim.id)
                                             })
                                         })
                                         roller.yönetimRolleri.some(x => {
                                             let rol = message.guild.roles.cache.get(x)
                                             rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri)).forEach(ramalcim => {
                                              if(!Aloo.includes(ramalcim.id)) Aloo.push(ramalcim.id)
                                             })
                                         })
                                     
                                         roller.üstYönetimRolleri.some(x => {
                                             let rol = message.guild.roles.cache.get(x)
                                             rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri)).forEach(ramalcim => {
                                              if(!Aloo.includes(ramalcim.id)) Aloo.push(ramalcim.id)
                                             })
                                         })
                                         roller.kurucuRolleri.some(x => {
                                             let rol = message.guild.roles.cache.get(x)
                                             rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri) ).forEach(ramalcim => {
                                              if(!Aloo.includes(ramalcim.id)) Aloo.push(ramalcim.id)
                                             })
                                         })
                                         message.channel.send(`${message.guild.emojiGöster(emojiler.serverTag)} Aşağı da **${message.guild.name}** sunucusunun bulunan tüm yetkilileri listelenmektedir. (Yetkili sayısı: **${Aloo ? Aloo.length : 0}**)`).then(x => {
                                            const arr = Discord.Util.splitMessage(`${Aloo.length >= 1 ? Aloo.map(x => `<@${x}>`).join(", ") : "Tebrikler! Tüm yetkilileriniz seste."}`, { maxLength: 1950, char: "," });
                                            arr.forEach(element => {
                                                message.channel.send(Discord.Formatters.codeBlock("js", element));
                                            });
                                          })
            }
            if(i.customId == "aktifseste") {
                let GUILD_MEMBERS = await client.guilds.cache.get(message.guild.id).members.fetch({ withPresences: true })

                            let Genel = []
                             let altyetkiler = message.guild.roles.cache.get(roller.altilkyetki)
                             if(altyetkiler) altyetkiler.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri)  && ramalcim.presence && ramalcim.presence?.status !== "offline" && !ramalcim.voice.channel).map(ramalcim => {
                                if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                             })
                         
                             roller.altYönetimRolleri.some(x => {
                                 let rol = message.guild.roles.cache.get(x)
                                 rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri) && ramalcim.presence && ramalcim.presence?.status !== "offline" && !ramalcim.voice.channel).forEach(ramalcim => {
                                  if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                                 })
                             })
                             roller.yönetimRolleri.some(x => {
                                 let rol = message.guild.roles.cache.get(x)
                                 rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri) && ramalcim.presence && ramalcim.presence?.status !== "offline" && !ramalcim.voice.channel).forEach(ramalcim => {
                                  if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                                 })
                             })
                         
                             roller.üstYönetimRolleri.some(x => {
                                 let rol = message.guild.roles.cache.get(x)
                                 rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri) && ramalcim.presence && ramalcim.presence?.status !== "offline"  && !ramalcim.voice.channel).forEach(ramalcim => {
                                  if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                                 })
                             })
                             roller.kurucuRolleri.some(x => {
                                 let rol = message.guild.roles.cache.get(x)
                                 rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri) && ramalcim.presence && ramalcim.presence?.status !== "offline" && !ramalcim.voice.channel).forEach(ramalcim => {
                                  if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                                 })
                             })
                         
                             //
                         
                             message.channel.send(`${message.guild.emojiGöster(emojiler.serverTag)} Aşağı da aktif fakat seste olmayan **${message.guild.name}** sunucusunun tüm yetkilileri listelenmektedir. (Seste olmayan yetkili sayısı: **${Genel ? Genel.length : 0}**)`).then(x => {
                               const arr = Discord.Util.splitMessage(`${Genel.length >= 1 ? Genel.map(x => `<@${x}>`).join(", ") : "Tebrikler! Tüm yetkilileriniz seste."}`, { maxLength: 1950, char: "," });
                               arr.forEach(element => {
                                   message.channel.send(Discord.Formatters.codeBlock("js", element));
                               });
                             })
            }
            if(i.customId == "toplam") {

                let Genel = []
                 let altyetkiler = message.guild.roles.cache.get(roller.altilkyetki)
                 if(altyetkiler) altyetkiler.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri)   && !ramalcim.voice.channel).map(ramalcim => {
                    if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                 })
             
                 roller.altYönetimRolleri.some(x => {
                     let rol = message.guild.roles.cache.get(x)
                     rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri)   && !ramalcim.voice.channel).forEach(ramalcim => {
                      if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                     })
                 })
                 roller.yönetimRolleri.some(x => {
                     let rol = message.guild.roles.cache.get(x)
                     rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri) && !ramalcim.voice.channel).forEach(ramalcim => {
                      if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                     })
                 })
             
                 roller.üstYönetimRolleri.some(x => {
                     let rol = message.guild.roles.cache.get(x)
                     rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri)   && !ramalcim.voice.channel).forEach(ramalcim => {
                      if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                     })
                 })
                 roller.kurucuRolleri.some(x => {
                     let rol = message.guild.roles.cache.get(x)
                     rol.members.filter(ramalcim => !ramalcim.user.bot && !ramalcim.permissions.has('ADMINISTRATOR') && !ramalcim.roles.cache.has(roller.kurucuRolleri) && !ramalcim.voice.channel).forEach(ramalcim => {
                      if(!Genel.includes(ramalcim.id)) Genel.push(ramalcim.id)
                     })
                 })
             
                 //
             
                 message.channel.send(`${message.guild.emojiGöster(emojiler.serverTag)} Aşağı da seste olmayan **${message.guild.name}** sunucusunun tüm yetkilileri listelenmektedir. (Seste olmayan yetkili sayısı: **${Genel ? Genel.length : 0}**)`).then(x => {
                   const arr = Discord.Util.splitMessage(`${Genel.length >= 1 ? Genel.map(x => `<@${x}>`).join(", ") : "Tebrikler! Tüm yetkilileriniz seste."}`, { maxLength: 1950, char: "," });
                   arr.forEach(element => {
                       message.channel.send(Discord.Formatters.codeBlock("js", element));
                   });
                 })
            }
        })
        collector.on("end", i => {
            msg.delete().catch(err => {})
        })
    })
    }
}







