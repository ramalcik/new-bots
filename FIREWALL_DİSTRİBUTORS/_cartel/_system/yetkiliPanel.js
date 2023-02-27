const { Client, Message, Util, MessageActionRow, MessageButton, MessageSelectMenu, Collection, Permissions} = Discord = require("discord.js");
const Mute = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Mutes');
const voiceMute = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Vmutes');
const ms = require('ms');
const CategoryChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Category.Channels");
const TextChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../_SYSTEM/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const voiceCollection = new Collection()
const GUILDS_SETTINGS = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
const Kullanici = require('../../../../_SYSTEM/Databases/Schemas/Client.Users')
let selectSebep;
let selectMute;
const Jail = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Jails')
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const getLimitVoiceMute = new Map();
const getLimitMute = new Map()
const getLimit = new Map();
const getUnderLimit = new Map();
const getReklamLimit = new Map();
const table = require('table')
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "komut",
    Komut: ["komutcuk","munurcik"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on("messageCreate", async (message) => {
      if(message.author.bot) return;
      if(message.channel.name == "yetkili-paneli") {
          message.delete().catch(err => {})
      }
    })
   client.on("interactionCreate", async (i) => {
    const member = i.guild.members.cache.get(i.user.id) 
    if(!member) return;
    if(i.values == "ygeçmiş") {
      i.reply({embeds: [new cartelinEmbedi().setDescription(`Bulunduğunuz ${i.guild.channels.cache.get(i.channelId)} kanalına lütfen yetkili geçmişi sorgulanacak bir üye belirtin.`).setFooter("30 saniye içinde iptal olcaktır.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (msg) => { 
        let message = msg
        if(!msg.content || msg.content.length < 0) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`Üye belirtmeyi boş bırakamazsın.`)]});
        let cartelim = msg.mentions.members.first() || i.guild.members.cache.get(msg.content)
        if(!cartelim) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Böyle bir üye bulunamadı.`)]});
        if(cartelim && cartelim.user.bot) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.bot}`)]});
  Users.findOne({_id: cartelim.id }, async (err, res) => {
  if (!res) return i.editReply({embeds: [new cartelinEmbedi().setAuthor(cartelim.user.tag, cartelim.user.avatarURL({dynamic: true})).setDescription(`${cartelim} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]})
  if(!res.StaffLogs) return i.editReply({embeds: [new cartelinEmbedi().setAuthor(cartelim.user.tag, cartelim.user.avatarURL({dynamic: true})).setDescription(`${cartelim} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]})
  let pages = res.StaffLogs.sort((a, b) => b.Date - a.Date).chunk(20); 
  var currentPage = 1
  if (!pages && !pages.length || !pages[currentPage - 1]) return i.editReply({embeds: [new cartelinEmbedi().setAuthor(cartelim.user.tag, cartelim.user.avatarURL({dynamic: true})).setDescription(`${cartelim} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]})
  let embed = new cartelinEmbedi().setColor("RANDOM").setAuthor(cartelim.user.tag, cartelim.user.avatarURL({dynamic: true})).setFooter(`${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length} • Diğer Sayfalar Yetkili Analiz Komutunda`, message.guild.iconURL({dynamic: true}))

  const curPage = await i.editReply({
  embeds: [embed.setDescription(`${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x.Role) ? message.guild.roles.cache.get(x.Role) : "@Rol Bulunamadı"} <t:${Number(String(x.Date).substring(0, 10))}:R> [**${x.Process}**] (<@${x.Author}>)`).join("\n")}`)],
  components: [], fetchReply: true,
  })
})
      })

  
    }
    if(i.values == "istifa") {
        let data = await Users.findOne({_id: member.id})
        if(!data) return i.reply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} İstifa verebilmen için önce bir yetkin olmalı :)`)],ephemeral: true});
        if(data && !data.Staff) return i.reply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} İstifa verebilmen için önce bir yetkin olmalı :)`)],ephemeral: true});
        if(data && data.Staff) {
          member.removeStaff()
          let yetkiliRol = i.guild.roles.cache.get(roller.altilkyetki);
          i.reply({embeds: [new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.onay_munur)} Başarıyla üzerinizde bulunan ${member.roles.cache.filter(rol => yetkiliRol.position <= rol.position && rol.id != roller.boosterRolü).map(x => x).join(",")} rolleri üzerinizden alındı ve yetkiniz sistemsel olarak çekildi.`).setFooter(`Bu işin dönüşü yok.`)], ephemeral: true})
          await member.roles.remove(member.roles.cache.filter(rol => yetkiliRol.position <= rol.position && rol.id != roller.boosterRolü)).catch(err =>{});
        }

    }
    if(i.values == "cezabilgisi") {
      i.reply({embeds: [new cartelinEmbedi().setDescription(`Bulunduğunuz ${i.guild.channels.cache.get(i.channelId)} kanalına lütfen ceza bilgisi getirelecek ceza numarası giriniz.`).setFooter("30 saniye içinde iptal olcaktır.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
        if(!collect.content || collect.content.length < 0) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`Ceza numarası belirtmeyi boş bırakamazsın.`)]});
        if(!Number(collect.content)) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Ceza numarası yerine rakam girmemelisin!`)]});
        let res = await Punitives.findOne({ No: collect.content})
        if(!res) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Böyle bir ceza numarasına ait bir ceza bulunamadı.`)]});
        collect.delete().catch(err => {})
        let cezalanan = await client.getUser(res.Member);
        let cezalananbilgi;
        if(cezalanan != `\`Bulunamayan Üye\`` && cezalanan.username) cezalananbilgi = `${cezalanan} (\`${cezalanan.id}\`)`;
        if(!cezalananbilgi) cezalananbilgi = "<@"+res.Member+">" + `(\`${res.Member}\`)`
        // Ceza Veren Üye
        let yetkili = await client.getUser(res.Staff);
        let yetkilibilgi;
        if(yetkili != `\`Bulunamayan Üye\`` && yetkili.username) yetkilibilgi = `${yetkili} (\`${yetkili.id}\`)`;
        if(!yetkilibilgi) yetkilibilgi = "Bilinmiyor"
        // Manuel Komut İle Kaldırıldıysa
        let kaldırılmadurumu;
        if(!res.Remover) kaldırılmadurumu = `` 
        if(res.Remover) kaldırılmadurumu = "• Ceza'yı Kaldıran: " + `${await client.getUser(res.Remover) ? i.guild.members.cache.get(res.Remover) ? i.guild.members.cache.get(res.Remover) : `<@${res.Remover}> (\`${res.Remover}\`)` : `<@${res.Remover}> (\`${res.Remover}\`)` }`
        i.editReply({embeds: [new cartelinEmbedi().setDescription(`**Ceza Detayı** (\`#${res.No}/${res.Type}\`)
• Üye Bilgisi: ${cezalanan}
• Yetkili Bilgisi: ${yetkili}
• Ceza Tarihi: \`${tarihsel(res.Date)}\`
• Ceza Süresi: \`${res.Duration ? moment.duration(res.Duration - res.Date).format('Y [Yıl,] M [Ay,] d [Gün,] h [Saat,] m [Dakika] ') : "Kalıcı"}\`
• Ceza Durumu: \`${res.Active == true ? "Aktif ✅" : "Aktif Değil ❌"}\`
${kaldırılmadurumu}`).addField(`Ceza Sebepi`,`\`${res.Reason}\``)]})
      })
    }
    if(i.values == "cezakontrol") {
      i.reply({embeds: [new cartelinEmbedi().setDescription(`Bulunduğunuz ${i.guild.channels.cache.get(i.channelId)} kanalına lütfen cezası listelenecek bir üye belirtin.`).setFooter("30 saniye içinde iptal olcaktır.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
        if(!collect.content || collect.content.length < 0) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`Üye belirtmeyi boş bırakamazsın.`)]});
        let cartelim = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
        if(!cartelim) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Böyle bir üye bulunamadı.`)]});
        if(cartelim && cartelim.user.bot) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.bot}`)]});
        collect.delete().catch(err => {})
        let Cezalar = await Punitives.find({Member: cartelim.id})
        let data = [["ID", "🔵", "Ceza Tarihi", "Ceza Türü", "Ceza Sebebi"]];
        data = data.concat(Cezalar.sort((a, b) => b.Date - a.Date).slice(0, 10).map(value => {          
            return [
                `#${value.No}`,
                `${value.Active == true ? "✅" : `❌`}`,
                `${tarihsel(value.Date)}`,
                `${value.Type}`,
                `${value.Reason}`
            ]
        }));
        let veriler = table.table(data, {
           columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
           border : table.getBorderCharacters(`void`),  
           drawHorizontalLine: function (index, size) {
               return index === 0 || index === 1 || index === size;
           }
        });
        if(!await Punitives.findOne({Member: cartelim.id})) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.onay_munur)} ${cartelim} isimli üyesine ait herhangi bir şekilde ceza bulunamadı.`)]})
        i.editReply({embeds: [], content:`Aşağıda ${cartelim} kişisine ait cezalar son 10 ceza listelenmektedir. (Detaylı Bilgi: \`${global.sistem.botSettings.Prefixs[0]}cezalar <@munur/ID>\`)
\`\`\`${veriler}\`\`\``})
      })
    }
    if(i.values == "reklam") {
      if(!roller.jailHammer.some(oku => member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => member.roles.cache.has(oku))  && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetersiz}`)], ephemeral: true})
      i.reply({embeds: [new cartelinEmbedi().setDescription(`Bulunduğunuz ${i.guild.channels.cache.get(i.channelId)} kanalına lütfen reklam olarak cezalandırılacak bir üye belirtin.`).setFooter("30 saniye içinde iptal olcaktır.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
       if (collect.content == ("iptal" || "i") || !collect) {
         collect.delete();
         i.editReply({embeds: [new cartelinEmbedi().setDescription(`İşlem iptal edildi.`)], ephemeral: true, components: []});
         return;
       };
       collect.delete().catch(err => {})
       let cartelim = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       let sunucudabul = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       if(!cartelim) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Böyle bir üye bulunamadı.`)]});
       if(collect.author.id === cartelim.id) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.kendi}`)]});
       if(sunucudabul && sunucudabul.user.bot) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.bot}`)]});
       if(sunucudabul && collect.member.roles.highest.position <= sunucudabul.roles.highest.position) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetkiust}`)]});
       if(await Jail.findById(cartelim.id)) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Belirtilen ${cartelim} cartelimsinin aktif bir cezalandırılması mevcut.`)]});
       cartelim.removeStaff()
       cartelim.dangerRegistrant()
       if(Number(ayarlar.reklamLimit)) {
           if(!collect.member.permissions.has('ADMINISTRATOR') && !sistem._rooter.rooters.includes(collect.member.id) && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) {
               getLimit.set(`${collect.member.id}`, (Number(getReklamLimit.get(`${collect.member.id}`) || 0)) + 1)
               setTimeout(() => {
                   getLimit.set(`${collect.member.id}`, (Number(getReklamLimit.get(`${collect.member.id}`) || 0)) - 1)
               },1000*60*5)
           }
       }
       return cartelim.addPunitives(3, collect.member, "Sunucu içerisinde reklam yapmak!", i, undefined, false, false, 0)
      })
    }
    if(i.values == "uyari") {
      if(!roller.warnHammer.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetersiz}`)], ephemeral: true})
      i.reply({embeds: [new cartelinEmbedi().setDescription(`Bulunduğunuz ${i.guild.channels.cache.get(i.channelId)} kanalına lütfen uyarılacak bir üye belirtin.`).setFooter("30 saniye içinde iptal olcaktır.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
       if (collect.content == ("iptal" || "i") || !collect) {
         collect.delete();
         i.editReply({embeds: [new cartelinEmbedi().setDescription(`İşlem iptal edildi.`)], ephemeral: true, components: []});
         return;
       };
       
       collect.delete().catch(err => {})
       let cartelim = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       let sunucudabul = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       if(!cartelim) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Böyle bir üye bulunamadı.`)]});
       if(collect.author.id === cartelim.id) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.kendi}`)]});
       if(sunucudabul && sunucudabul.user.bot) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.bot}`)]});
       if(sunucudabul && collect.member.roles.highest.position <= sunucudabul.roles.highest.position) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetkiust}`)]});
       i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cartelim} üyesine ${i.channel} kanalına uyarı sebebini yazmalısın.`).setFooter(`30 saniye içerisinde girmelisin.`)]}).then(async (msg) => {
        var filter = (cartelim) => cartelim.author.id == i.user.id
        let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000})
        collector.on('collect', async (collect) => {
          if(!collect.content || collect.content.length < 0) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`Geçerli bir sebep girilmediğinden dolayı işlem iptal edildi.`)]});
          let sebep = collect.content || "Bir sebep girilmedi."
          collect.delete().catch(err => {})
          let lastWarn = await Punitives.find({Member: cartelim.id, Type: "Uyarılma"})
          let checkRoles = [...roller.Yetkiler, ...roller.jailHammer, ...roller.üstYönetimRolleri, ...roller.yönetimRolleri,...roller.altYönetimRolleri, ...roller.kurucuRolleri]
          if(!checkRoles.some(x => cartelim.roles.cache.has(x)) && !cartelim.permissions.has("ADMINISTRATOR") && lastWarn.length >= 3) {
              if(roller.jailHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR')) {
                  if(Number(ayarlar.jailLimit) && client.fetchJailLimit.get(collect.member.id) >= ayarlar.jailLimit) return await cartelim.addPunitives(6, collect.member, sebep, i, undefined, false, false, 1)
                  cartelim.removeStaff()
                  cartelim.dangerRegistrant() 
                  return cartelim.addPunitives(3, collect.member, "Gereğinden fazla uyarı cezası bulunmak!" + ` (${sebep})`, i, undefined, false, false, 1) 
              }
         }
         await cartelim.addPunitives(6, collect.member, sebep, i, undefined, false, false, 0)
        })
      })
      })
    }


    if(i.values == "underworld") {
      if(!roller.banHammer.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetersiz}`)], ephemeral: true})
      i.reply({embeds: [new cartelinEmbedi().setDescription(`Bulunduğunuz ${i.guild.channels.cache.get(i.channelId)} kanalına lütfen underworld'e gönderilecek bir üye belirtin.`).setFooter("30 saniye içinde iptal olcaktır.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
       if (collect.content == ("iptal" || "i") || !collect) {
         collect.delete();
         i.editReply({embeds: [new cartelinEmbedi().setDescription(`İşlem iptal edildi.`)], ephemeral: true, components: []});
         return;
       };
       collect.delete().catch(err => {})
       let cartelim = collect.mentions.members.first() || i.guild.members.cache.get(collect.content) || await client.getUser(collect.content)
       let sunucudabul = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       if(!cartelim) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Böyle bir üye bulunamadı.`)]});
       if(collect.author.id === cartelim.id) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.kendi}`)]});
       if(sunucudabul && sunucudabul.user.bot) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.bot}`)]});
       if(sunucudabul && collect.member.roles.highest.position <= sunucudabul.roles.highest.position) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetkiust}`)]});
       if(sunucudabul && roller.Yetkiler.some(oku => sunucudabul.roles.cache.has(oku)) && !collect.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetkilinoban}`)]});
       if(getUnderLimit.get(collect.member.id) >= ayarlar.banLimit) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Underworld için yeterli limite sahip değilsin.`)]});
       let bul = await Punitives.findOne({Member: cartelim.id, Type: "Underworld", Active: true})
       if(bul) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Belirtilen ${cartelim} isimli üyenin aktif bir **Underworld** cezası bulunmakta.`)]})
        i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cartelim} üyesini Underworld'e göndermek için ${i.channel} kanalına sebep yazmalısın.`).setFooter(`30 saniye içerisinde girmelisin.`)]}).then(async (msg) => {
        var filter = (cartelim) => cartelim.author.id == i.user.id
        let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000})
        collector.on('collect', async (collect) => {
          if(!collect.content || collect.content.length < 0) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`Geçerli bir sebep girilmediğinden dolayı işlem iptal edildi.`)]});
          let sebep = collect.content || "Bir sebep girilmedi."
          collect.delete().catch(err => {})
          if(sunucudabul) {
            cartelim.removeStaff()
            cartelim.dangerRegistrant()
            cartelim.addPunitives(8, collect.member, sebep, i,  undefined, false, false, 0)
            message.react(i.guild.emojiGöster(emojiler.onay_munur))
          } else {
            let cezano = await Punitives.countDocuments()
            cezano = cezano == 0 ? 1 : cezano + 1;
            let ceza = new Punitives({ 
                No: cezano,
                Member: cartelim.id,
                Staff: msg.member.id,
                Type: "Underworld",
                Reason: sebep,
                Date: Date.now()
            })
            ceza.save().catch(err => {})
            let findedChannel = i.guild.kanalBul("underworld-log")
            if(findedChannel) findedChannel.send({embeds: [new cartelinEmbedi().setFooter(`${i.guild.name ? `${i.guild.name} •` : ''} Ceza Numarası: #${cezano}`,i.guild.name ? i.guild.iconURL({dynamic: true}) : cartelim.avatarURL({dynamic: true})).setDescription(`${cartelim.toString()} üyesine, <t:${String(Date.now()).slice(0, 10)}:R> \`${sebep}\` nedeniyle ${collect.member} tarafından ceza-i işlem uygulandı.`)]})
            i.editReply({embeds: [new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.onay_munur)} ${cartelim.toString()} isimli üyeye **${sebep}** sebebiyle "__Underworld__" türünde ceza-i işlem uygulandı.`).setFooter(`${cartelim.tag} • Ceza Numarası: #${cezano} • Underworld`,cartelim.avatarURL({dynamic: true}))]})
            await Users.updateOne({ _id: collect.member.id } , { $inc: { "Uses.Underworld": 1 } }, {upsert: true})
          }
          if(Number(ayarlar.banLimit)) {
            if(!i.member.permissions.has('ADMINISTRATOR') && !sistem._rooter.rooters.includes(i.member.id) && !roller.kurucuRolleri.some(oku => i.member.roles.cache.has(oku))) {
                getLimit.set(`${i.member.id}`, (Number(getLimit.get(`${i.member.id}`) || 0)) + 1)
                setTimeout(() => {
                    getLimit.set(`${i.member.id}`, (Number(getLimit.get(`${i.member.id}`) || 0)) - 1)
                },1000*60*5)
            }
        }
        })
      })
      })
    }


    if(i.values == "gg") {
      if(!roller.jailHammer.some(oku => member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => member.roles.cache.has(oku))  && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetersiz}`)], ephemeral: true})
      i.reply({embeds: [new cartelinEmbedi().setDescription(`Bulunduğunuz ${i.guild.channels.cache.get(i.channelId)} kanalına lütfen cezalandırılacak bir üye belirtin.`).setFooter("30 saniye içinde iptal olcaktır.")], ephemeral: true})
     var filter = (msg) => msg.author.id == i.user.id
     let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
     collector.on("collect", async (collect) => {
      if (collect.content == ("iptal" || "i")) {
        collect.delete();
        i.reply({embeds: [new cartelinEmbedi().setDescription(`Yasaklamktan vaz geçildi!`)], ephemeral: true, components: []});
        return;
      };
      let cartelim = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
      if(!cartelim) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Böyle bir üye bulunamadı.`)]});
      if(collect.author.id === cartelim.id) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.kendi}`)]});
      if(cartelim && cartelim.user.bot) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.bot}`)]});
      if(cartelim && collect.member.roles.highest.position <= cartelim.roles.highest.position) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetkiust}`)]});
    let jailButton = new MessageButton()
    .setCustomId(`onayla`)
    .setLabel(await Jail.findById(cartelim.id) ? `Aktif Cezalandırılması Mevcut!` : getLimit.get(collect.member.id) >= ayarlar.jailLimit ? `Limit Doldu (${getLimit.get(collect.member.id) || 0} / ${ayarlar.jailLimit})` : 'İşlemi Onaylıyorum!')
    .setEmoji(i.guild.emojiGöster(emojiler.Cezalandırıldı))
    .setStyle('SUCCESS')
    .setDisabled(await Jail.findById(cartelim.id) ? true : getLimit.get(collect.member.id) >= ayarlar.jailLimit ? true : false )
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('İşlemi İptal Et')
    .setEmoji(i.guild.emojiGöster(emojiler.no_munur))
    .setStyle('DANGER')
    let jailOptions = new MessageActionRow().addComponents(
            jailButton,
            iptalButton
    );

  i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cartelim} isimli üyeyi cezalandırmak istiyor musun?`)], components: [jailOptions]}).catch(err => {}).then(async (msg) => {

    const filter = i => i.user.id == collect.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })
    const sebeps = [
      { label: "Kışkırtma, Trol ve Dalgacı Davranış", description: "3 Gün", emoji: {name: "1️⃣"} , value: "1", date: "3d", type: 3},
      { label: `Ortamı (${ayarlar.serverName}) Kötülemek`, description: "5 Gün", emoji: {name: "2️⃣"} ,value: "2", date: "5d", type: 3},
      { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "1 Gün", emoji: {name: "3️⃣"} ,value: "3", date: "1d", type: 3},
      { label: "Sunucu Düzeni Ve Huzursuzluk Yaratmak", description: "4 Gün", emoji: {name: "4️⃣"} ,value: "4", date: "4d", type: 3},
      { label: "Kayıt Odalarında Gereksiz Trol Yapmak", description: "3 Gün", emoji: {name: "5️⃣"}, value: "5", date: "3d", type: 3},
  ]

    collector.on('collect', async cl => {
        if (cl.customId === `onayla`) {
            cl.deferUpdate()
            i.editReply({embeds: [new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.Cezalandırıldı)} ${cartelim} isimli üyesini hangi sebep ile cezalandırmak istiyorsun?\n${!roller.kurucuRolleri.some(x => collect.member.roles.cache.has(x)) && !sistem._rooter.rooters.includes(collect.member.id) && !collect.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.jailLimit) ? `Kullanılabilir Limit: \`${getLimit.get(collect.member.id) || 0} / ${ayarlar.jailLimit}\`` : `` : ``}`)], components: [new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId(`sebep`)
                .setPlaceholder('Cezalandırmak istediğiniz sebepi seçiniz!')
                .addOptions([
                    sebeps.filter(x => x.type == 3)
                ]),
            )]})
            }
        if (cl.customId === `sebep`) {
           let seçilenSebep = sebeps.find(x => x.value == cl.values[0])
           if(seçilenSebep) {
                if(Number(ayarlar.jailLimit)) {
                    if(!collect.member.permissions.has('ADMINISTRATOR') && !sistem._rooter.rooters.includes(collect.member.id) && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) {
                        getLimit.set(`${collect.member.id}`, (Number(getLimit.get(`${collect.member.id}`) || 0)) + 1)
                        setTimeout(() => {
                            getLimit.set(`${collect.member.id}`, (Number(getLimit.get(`${collect.member.id}`) || 0)) - 1)
                        },1000*60*5)
                    }
                }
                cl.deferUpdate()  
                cartelim.removeStaff()
                cartelim.dangerRegistrant()
                return cartelim.addPunitives(seçilenSebep.type, collect.member, seçilenSebep.label, i, seçilenSebep.date, false, false, 0)
        } else {
               return i.deferUpdate({components: [], embeds: [ new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.no_munur)} İşlem sırasında hata oluştu lütfen bot sahibine başvurun.`)]})
           }
         }
        if (cl.customId === `iptal`) {
            msg.delete().catch(err => {})
            return await i.editReply({components: [], embeds: [new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.no_munur)} ${cartelim} isimli üyenin cezalandırılma işlemi başarıyla iptal edildi.`)] , ephemeral: true});
        }
    });
    collector.on("end", async i => {
        msg.delete().catch(err => {})
    })

      collect.delete().catch(err => {})
       
       
     })
    })
    }


    // mute 


    if(i.values == "gg3") {
      if(!roller.muteHammer.some(oku => member.roles.cache.has(oku)) && !roller.voiceMuteHammer.some(oku => member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => member.roles.cache.has(oku))  && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetersiz}`)], ephemeral: true})
      i.reply({embeds: [new cartelinEmbedi().setDescription(`Bulunduğunuz ${i.guild.channels.cache.get(i.channelId)} kanalına lütfen metin kanalarında veya ses kanallarında susturulcak bir üye belirtin.`).setFooter("30 saniye içinde iptal olcaktır.")], ephemeral: true})
     var filter = (msg) => msg.author.id == i.user.id
     let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
     collector.on("collect", async (collect) => {
      if (collect.content == ("iptal" || "i")) {
        collect.delete();
        i.reply({embeds: [new cartelinEmbedi().setDescription(`Yasaklamktan vaz geçildi!`)], ephemeral: true, components: []});
        return;
      };
      collect.delete().catch(err => {})
      let cartelim = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
      if(!cartelim) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Böyle bir üye bulunamadı.`)]});
      if(collect.author.id === cartelim.id) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.kendi}`)]});
      if(cartelim && cartelim.user.bot) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.bot}`)]});
      if(cartelim && collect.member.roles.highest.position <= cartelim.roles.highest.position) return i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.yetkiust}`)]});
      const sebeps = [
        { label: "Kışkırtma, Trol, Dalgacı ve Ortam Bozucu Davranış", description: "10 Dakika", emoji: {name: "1️⃣"} , value: "1", date: "10m", type: 5},
        { label: "Dizi, Film ve Hikayeler Hakkında Spoiler Vermek", description: "5 Dakika", emoji: {name: "2️⃣"} ,value: "2", date: "5m", type: 5},
        { label: "Küçümseyici Ve Aşalayıcı Davranış", description: "20 Dakika", emoji: {name: "3️⃣"} ,value: "3", date: "20m", type: 5},
        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "20 Dakika", emoji: {name: "4️⃣"} ,value: "4", date: "20m", type: 5},
        { label: "Ailevi Değerlere Küfür/Hakaret", description: "15 Dakika", emoji: {name: "5️⃣"} ,value: "5", date: "15m", type: 5},
        { label: `Ortamı (${ayarlar.serverName}) Kötülemek`, description: "30 Dakika", emoji: {name: "6️⃣"} ,value: "6", date: "30m", type: 5},
        { label: "Seste Yaşanan Olayları Chat'e Yansıtmak ve Uzatmak", description: "10 Dakika", emoji: {name: "7️⃣"} ,value: "7", date: "10m", type: 5},
        
        { label: "Kışkırtma, Trol, Dalgacı ve Ortam Bozucu Davranış", description: "10 Dakika", emoji: {name: "1️⃣"} , value: "8", date: "10m", type: 4},
        { label: "Küçümseyici Ve Aşalayıcı Davranış", description: "20 Dakika", emoji: {name: "2️⃣"} ,value: "9", date: "20m", type: 4},
        { label: "Özel Odalara Uyarılmalara Rağmen İzinsiz Giriş", description: "30 Dakika", emoji: {name: "3️⃣"} ,value: "10", date: "30m", type: 4},
        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "20 Dakika", emoji: {name: "4️⃣"} ,value: "11", date: "20m", type: 4},
        { label: "Soundpad, Efekt ve Ses Programları Kullanımı", description: "10 Dakika", emoji: {name: "5️⃣"} ,value: "12", date: "10m", type: 4},
        { label: "Ailevi Değerlere Küfür/Hakaret", description: "15 Dakika", emoji: {name: "6️⃣"} ,value: "13", date: "15m", type: 4},
        { label: `Ortamı (${ayarlar.serverName}) Kötülemek`, description: "30 Dakika", emoji: {name: "7️⃣"} ,value: "14", date: "30m", type: 4} 
    ]
    let chatMuteButton = new MessageButton()
    .setCustomId(`chatmute`)
    .setLabel(`Metin Kanallarında ${roller.muteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR') ? await Mute.findById(cartelim.id) ? `(Aktif Cezası Var!)` : getLimitMute.get(collect.member.id) >= ayarlar.muteLimit ? `(Limit ${getLimitMute.get(collect.member.id)}/${ayarlar.muteLimit})` : `${!roller.kurucuRolleri.some(x => collect.member.roles.cache.has(x)) && !sistem._rooter.rooters.includes(collect.member.id) && !collect.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.muteLimit) ? `(Limit: ${getLimitMute.get(collect.member.id) || 0}/${ayarlar.muteLimit})`: `` : ``}` : "(Yetki Yok)"}`)
    .setEmoji(i.guild.emojiGöster(emojiler.chatSusturuldu))
    .setStyle('PRIMARY')
    .setDisabled(roller.muteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR') ? await Mute.findById(cartelim.id) ? true : getLimitMute.get(collect.member.id) >= ayarlar.muteLimit ? true : false : true)
    let voiceMuteButton = new MessageButton()
    .setCustomId(`voicemute`)
    .setLabel(`Ses Kanallarında ${roller.voiceMuteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR') ? await voiceMute.findById(cartelim.id) ? `(Aktif Cezası Var!)` : getLimitVoiceMute.get(collect.member.id) >= ayarlar.voiceMuteLimit ? `(Limit Doldu ${getLimitVoiceMute.get(collect.member.id)}/${ayarlar.voiceMuteLimit})` : `${!roller.kurucuRolleri.some(x => collect.member.roles.cache.has(x)) && !sistem._rooter.rooters.includes(collect.member.id) && !collect.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.voiceMuteLimit) ? `(Limit: ${getLimitVoiceMute.get(collect.member.id) || 0}/${ayarlar.voiceMuteLimit})`: `` : ``}` : "(Yetki Yok)"}`)
    .setEmoji(i.guild.emojiGöster(emojiler.sesSusturuldu))
    .setStyle('PRIMARY')
    .setDisabled(roller.voiceMuteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR') ? await voiceMute.findById(cartelim.id) ? true : getLimitVoiceMute.get(collect.member.id) >= ayarlar.voiceMuteLimit ? true : false : true)
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('İşlemi İptal Et')
    .setEmoji(i.guild.emojiGöster(emojiler.no_munur))
    .setStyle('DANGER')
    let muteOptions = new MessageActionRow().addComponents(
            chatMuteButton,
            voiceMuteButton,
            iptalButton,
    );
       i.editReply({embeds: [new cartelinEmbedi().setDescription(`${cartelim} isimli üyeyi hangi türde susturmak istiyorsun?`)], components: [muteOptions]}).then(ggwp => {
         var filter = (cartelim) => cartelim.user.id == collect.member.id
         let collector  = ggwp.createMessageComponentCollector({filter: filter, max: 3, time: 30000, errors: ["time"]})
         collector.on('collect', async cl => {
          if (cl.customId === `chatmute`) {
          selectMute = 5
          cl.deferUpdate() 
          i.editReply({embeds: [new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.chatSusturuldu)} ${cartelim} isimli üyesini hangi sebep ile **metin kanallarından** susturmamı istiyorsun?`)], components: [new MessageActionRow().addComponents(
              new MessageSelectMenu()
              .setCustomId(`sebep`)
              .setPlaceholder('Susturmak istediğiniz sebepi seçiniz!')
              .addOptions([
                  sebeps.filter(x => x.type == 5)
              ]),
          )]})
          }
          if (cl.customId === `voicemute`) {
              selectMute = 4
              cl.deferUpdate() 
              i.editReply({embeds: [new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.sesSusturuldu)} ${cartelim} isimli üyesini hangi sebep ile **ses kanallarından** susturmamı istiyorsun?`)], components: [new MessageActionRow().addComponents(
                  new MessageSelectMenu()
                  .setCustomId(`sebep`)
                  .setPlaceholder('Susturmak istediğiniz sebepi seçiniz!')
                  .addOptions([
                      sebeps.filter(x => x.type == 4)
                  ]),
              )]})
              }
          if (cl.customId === `sebep`) {
             let seçilenSebep = sebeps.find(x => x.value == cl.values[0])
             if(seçilenSebep) {
                 if(selectMute == 4) {
                  if(Number(ayarlar.voiceMuteLimit)) {
      let voiceMuteCheck = await voiceMute.findById(cartelim.id)
      if(voiceMuteCheck) return await i.editReply({content: `Belirtiğin ${cartelim} üyesinin, aktif bir susturulma cezası mevcut!`, ephemeral: true}),msg.delete().catch(err => {}),message.react(i.guild.emojiGöster(emojiler.no_munur))
                      if(!collect.member.permissions.has('ADMINISTRATOR') && !sistem._rooter.rooters.includes(collect.member.id) && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) {
                          getLimitVoiceMute.set(`${collect.member.id}`, (Number(getLimitVoiceMute.get(`${collect.member.id}`) || 0)) + 1)
                              setTimeout(() => {
                                  getLimitVoiceMute.set(`${collect.member.id}`, (Number(getLimitVoiceMute.get(`${collect.member.id}`) || 0)) - 1)
                              },1000*60*5)
                          }
                      }
                  }
                 if(selectMute == 5) {
      let chatMuteCheck = await Mute.findById(cartelim.id)
      if(chatMuteCheck) return await i.editReply({content: `Belirtiğin ${cartelim} üyesinin, aktif bir susturulma cezası mevcut!`, ephemeral: true}),msg.delete().catch(err => {}),message.react(i.guild.emojiGöster(emojiler.no_munur))
                  if(Number(ayarlar.muteLimit)) {
                      if(!collect.member.permissions.has('ADMINISTRATOR') && !sistem._rooter.rooters.includes(collect.member.id) && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) {
                          getLimitMute.set(`${collect.member.id}`, (Number(getLimitMute.get(`${collect.member.id}`) || 0)) + 1)
                              setTimeout(() => {
                                  getLimitMute.set(`${collect.member.id}`, (Number(getLimitMute.get(`${collect.member.id}`) || 0)) - 1)
                              },1000*60*5)
                          }
                      }
                  }
                  cl.deferUpdate()  
                return cartelim.addPunitives(seçilenSebep.type, collect.member, seçilenSebep.label, i, seçilenSebep.date, false, false, 0)
          } else {
                 return i.editReply({components: [], embeds: [ new cartelinEmbedi().setDescription(`${i.guild.emojiGöster(emojiler.no_munur)} İşlem sırasında hata oluştu lütfen bot sahibine başvurun.`)]})
             }
           }
          if (i.customId === `iptal`) {
              return await i.editReply({ content: `${i.guild.emojiGöster(emojiler.onay_munur)} Başarıyla mute işlemleri menüsü kapatıldı.`, components: [], embeds: [], ephemeral: true });
          }
      });
      collector.on("end", async i => {
          
      })
       })
     })
     function yetkiKontrol(message, type = 0) {
      if(type = 1) if(roller.voiceMuteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR')) return true
      
      if(type = 2) if(roller.muteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR')) return true
  }
    }
   })
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    console.log("undefined")
  }
};

async function rolDedect(rol) {
  return new Promise(function (resolve, reject) {
      if(rol && client.guilds.cache.get(sistem.SUNUCU.GUILD).roles.cache.get(rol)) {
        rol = client.guilds.cache.get(sistem.SUNUCU.GUILD).roles.cache.get(rol)
        resolve(rol);
    } else {
        reject("Rol Bulunamadı!");
    }
})
}