const { Client, Message, Util, Intents, MessageActionRow, MessageButton, MessageAttachment, MessageSelectMenu} = require("discord.js");
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives')
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users')
const GUARDS_SETTINGS = require('../../../../_SYSTEM/Databases/Schemas/Guards/Global.Guard.Settings')
const GUILDS_SETTINGS = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings')
const { cartelinEmbedi } = require('../../../../_SYSTEM/Reference/Embed')

let BOTS = global.allBots = client.allBots = []
module.exports = {
    Isim: "bot",
    Komut: ["bot-dev","update-bots","botsu","acr-bot","bot-setting","dev-discord","bots","botpp"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: async function (client) {
    let cartelcim = require('../../../../_SYSTEM/GlobalSystem/server.json');

    // Bot Token's

let Stat = cartelcim.TOKENLER.Statistics
let Jollity = cartelcim.TOKENLER.Jollity
let Intanfry = sistem.TOKENLER.Intanfry
let Fairy = cartelcim.TOKENLER.FAİRY
let AUXLİARY = cartelcim.TOKENLER.AUXLİARY
let FIREWALL_ONE = cartelcim.TOKENLER.FIREWALL.FIREWALL_ONE
let FIREWALL_TWO = cartelcim.TOKENLER.FIREWALL.FIREWALL_TWO
let FIREWALL_THREE = cartelcim.TOKENLER.FIREWALL.FIREWALL_THREE
let FIREWALL_FOUR = cartelcim.TOKENLER.FIREWALL.FIREWALL_FOUR

    // Bot Token's

let allTokens = [Stat, Jollity,Intanfry, Fairy, AUXLİARY, FIREWALL_ONE, FIREWALL_TWO]
let guardSettings = await GUARDS_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
if(!guardSettings) await GUARDS_SETTINGS.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"auditLimit": 10, auditInLimitTime: "2m"}}, {upsert: true})
allTokens.forEach(async (token) => {
    let botClient;
    if(cartelcim.TOKENLER.FIREWALL.DISTS.includes(token) || FIREWALL_TWO == token) {
        botClient = new Client({
            intents: [32767],
            presence: {activities: [{name: sistem.botStatus.Name}], status: sistem.botStatus.Status, type: sistem.botStatus.type,url: sistem.botStatus.Url}
          }); 
    } else {
        botClient = new Client({
            intents: [32767],
            presence: {activities: [{name: sistem.botStatus.Name}], status: sistem.botStatus.Status, type: sistem.botStatus.type,url: sistem.botStatus.Url}
          });

    }
      botClient.on("ready", async () => {  
          BOTS.push(botClient)
          let guardSettings = await GUARDS_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
          if(!cartelcim.TOKENLER.WELCOME.WELCOMES.includes(botClient.token)) {
            if(guardSettings && guardSettings.BOTS && !guardSettings.BOTS.includes(botClient.user.id)) {
                await GUARDS_SETTINGS.updateOne({guildID: sistem.SUNUCU.GUILD}, {$push: {"BOTS": botClient.user.id} }, {upsert: true})
            }
          }  
      })
      await botClient.login(token).catch(err => {
      })
})

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let cartelcim = require('../../../../_SYSTEM/GlobalSystem/server.json');

        // Bot Token's

    let Stat = cartelcim.TOKENLER.Statistics
    let Jollity = cartelcim.TOKENLER.Jollity
    let AUXLİARY = cartelcim.TOKENLER.AUXLİARY
    let FIREWALL_ONE = cartelcim.TOKENLER.FIREWALL.FIREWALL_ONE
    let FIREWALL_TWO = cartelcim.TOKENLER.FIREWALL.FIREWALL_TWO
    let FIREWALL_THREE = cartelcim.TOKENLER.FIREWALL.FIREWALL_THREE
    let FIREWALL_FOUR = cartelcim.TOKENLER.FIREWALL.FIREWALL_FOUR
    
        // Bot Token's

    let allTokens = [Stat, Jollity, AUXLİARY, FIREWALL_ONE, FIREWALL_TWO, FIREWALL_THREE, FIREWALL_FOUR]
    let pubTokens = [Stat, Jollity, AUXLİARY, FIREWALL_ONE, FIREWALL_TWO, FIREWALL_THREE, FIREWALL_FOUR]
   
    let OWNBOTS = []

    BOTS.forEach(bot => {
        OWNBOTS.push({
            value: bot.user.id,
        
            label: `${bot.user.tag}`,
            description: `${bot.user.id}`
        })
    })
    let Row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("selectBot")
        .setPlaceholder("🎄 BOTS")
        .setOptions(
            [OWNBOTS]
        )
    )

    let msg = await message.channel.send({embeds: [new cartelinEmbedi().setColor("RANDOM").setAuthor(message.member.user.tag, message.member.user.avatarURL({dynamic: true})).setDescription(`Aşağıda sıralanmakta olan botların ismini, profil fotoğrafını, durumunu ve hakkındasını değişmesini istediğiniz bir botu seçiniz.`)],components: [Row]})
    const filter = i => i.user.id == message.member.id
    const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 35000 })

    collector.on('collect', async (i) => {
        if(i.customId == "selectBot") {
            let type = i.values
            if(!type) return await i.reply({content: "Bir bot veya işlem bulunamadı!", ephemeral: true})

                let botId = i.values
                let botClient = BOTS.find(bot => bot.user.id == type)
                if(!botClient) return await i.reply({content: "Bir bot veya işlem bulunamadı!", ephemeral: true})
                let updateRow = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId("selectAvatar")
                    .setEmoji("943286130357444608")
                    .setLabel("Profil Fotoğrafı Değişikliliği")
                    .setStyle("SECONDARY"),
                    new MessageButton()
                    .setCustomId("selectName")
                    .setEmoji("943290426562076762")
                    .setLabel("İsim Değişikliliği")
                    .setStyle("SECONDARY"),
                    new MessageButton()
                    .setCustomId("selectAbout")
                    .setEmoji("943290446329835570")
                    .setLabel("Hakkında Değişikliliği")
                    .setStyle("SECONDARY"),
                    new MessageButton()
                    .setCustomId("selectState")
                    .setEmoji("951514358377234432")
                    .setLabel("Durum Değişikliliği")
                    .setStyle("SECONDARY"),
                )
                msg.delete().catch(err => {})
                await message.channel.send({embeds: [new cartelinEmbedi().setColor("WHITE").setDescription(`${botClient.user} (**${botClient.user.tag}**) isimli bot üzerinde yapmak istediğiniz değişikliliği seçiniz?`)], components: [
                    updateRow
                ]}).then(msg => {
                    const filter = i => i.user.id == message.member.id 
                    const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 35000 })
                    collector.on("collect", async (i) => {
                        let botClient = BOTS.find(bot => bot.user.id == botId)
                        if(!botClient) return await i.reply({content: "Bir bot veya işlem bulunamadı!", ephemeral: true})
                        if(i.customId == "selectAbout" || i.customId == "selectState") {
                            await i.reply({content:`Şuan yapım aşamasında.`, ephemeral: true})
                        }
                        if(i.customId == "selectAvatar") {
                             msg.edit({embeds: [new cartelinEmbedi().setColor("WHITE").setDescription(`${message.guild.emojiGöster(emojiler.Icon)} ${botClient.user} isimli botun yeni profil resmini yükleyin veya bağlantısını girin.`)],components: []})
                            var isimfilter = m => m.author.id == message.member.id
                            let col = msg.channel.createMessageCollector({filter: isimfilter, time: 60000, max: 1, errors: ["time"]})

                            col.on('collect', async (m) => {
                                if (m.content == ("iptal" || "i")) {
                                    msg.delete().catch(err => {});
                                    message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                    await i.reply({content: `${cevaplar.prefix} Profil resmi değiştirme işlemi iptal edildi.`, ephemeral: true})
                                    return;
                                  };
                                  let eskinick = botClient.user.avatarURL({dynamic: true})
                                  let bekle = await message.reply(`Güncelleniyor....`)
                                   let isim = m.content || m.attachments.first().url
                                    if(!isim) {
                                        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                        msg.delete().catch(err => {});
                                        await i.reply({content: `${cevaplar.prefix} Profil resmi belirtilmediği için işlem iptal edildi.`, ephemeral: true})
                                        return;
                                    }
                                  botClient.user.setAvatar(isim).then(x => {
                                      bekle.delete().catch(err => {})
                                      msg.delete().catch(err => {})
                                      let logChannel = message.guild.kanalBul("guild-log")
                                      if(logChannel) logChannel.send({embeds: [new cartelinEmbedi().setFooter(`${tarihsel(Date.now())} tarihinde işleme koyuldu.`).setDescription(`${message.member} tarafından ${botClient.user} isimli botun profil resmi değiştirildi.`).setThumbnail(botClient.user.avatarURL())]})
                                      message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla! ${botClient.user} isimli botun profil resmi güncellendi!`).setThumbnail(botClient.user.avatarURL())]}).then(x => {
                                       message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 30000);
                                   })
                                  }).catch(err => {
                                       bekle.delete().catch(err => {})
                                       msg.delete().catch(err => {})
                                      message.channel.send(`${cevaplar.prefix} **${botClient.user.tag}**, Başarısız! profil resmi güncelleyebilmem için biraz beklemem gerek!`).then(x => {
                                       message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 7500);
                                   })
                                  })
                            });
                            
                            col.on('end', collected => {
                                msg.delete().catch(err => {});
                            });
                        }
                        if(i.customId == "selectName") {
                            msg.edit({embeds: [new cartelinEmbedi().setColor("DARK_GOLD").setDescription(`${message.guild.emojiGöster(emojiler.Icon)} ${botClient.user} isimli botun yeni ismini belirtin. İşlemi iptal etmek için (**iptal**) yazabilirsiniz. (**Süre**: \`60 Saniye\`)`)],components: []})
                            var isimfilter = m => m.author.id == message.member.id
                            let col = msg.channel.createMessageCollector({filter: isimfilter, time: 60000, max: 1, errors: ["time"]})

                            col.on('collect', async (m) => {
                                if (m.content == ("iptal" || "i")) {
                                    msg.delete().catch(err => {});
                                    message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                    await i.reply({content: `${cevaplar.prefix} İsim değiştirme işlemi iptal edildi.`, ephemeral: true})
                                    return;
                                  };
                                  let eskinick = botClient.user.username
                                  let bekle = await message.reply(`Güncelleniyor....`)
                                  let isim = m.content
                                  botClient.user.setUsername(isim).then(x => {
                                      bekle.delete().catch(err => {})
                                      msg.delete().catch(err => {})
                                      let logChannel = message.guild.kanalBul("guild-log")
                                      if(logChannel) logChannel.send({embeds: [new cartelinEmbedi().setFooter(`${tarihsel(Date.now())} tarihinde işleme koyuldu.`).setDescription(`${message.member} tarafından ${botClient.user} isimli botun ismi değiştirildi.\n**${eskinick}** isimli botun ismi **${botClient.user.username}** olarak güncellendi.`)]})
                                      message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla! **${eskinick}** isimli botun ismi **${botClient.user.username}** olarak değiştirildi.`)]}).then(x => {
                                       message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 30000);
                                   })
                                  }).catch(err => {
                                       bekle.delete().catch(err => {})
                                       msg.delete().catch(err => {})
                                      message.channel.send(`${cevaplar.prefix} **${botClient.user.tag}**, Başarısız! isim değiştirebilmem için biraz beklemem gerek!`).then(x => {
                                       message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 7500);
                                   })
                                  })
                            });
                            
                            col.on('end', collected => {
                                msg.delete().catch(err => {});
                            });
                        }
                    })
                })
   
        }
    })

    collector.on("end", async () => {
        msg.delete().catch(err => {})
    })
    }
  };