const {MessageButton, MessageActionRow, MessageSelectMenu} = Discord = require('discord.js');
const GUILD_SETTINGS = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Settings');
const { 
  Modal,
  TextInputComponent, 
  showModal
} = dcmodal = require('discord-modals')
let değişkenler = require('../../../../_SYSTEM/GlobalSystem/setupDeğişken');

let özellikler = değişkenler.değişkenler || []

const { Client, Message } = require("discord.js");
const { cartelinEmbedi } = require('../../../../_SYSTEM/Reference/Embed');
const { type } = require('os');
  module.exports = {
      Isim: "setup",
      Komut: ["server","install","settings","sunucu-yönet","bot-yönet","sunucuyönet","kurulum","lisans"],
      Kullanim: "",
      Aciklama: "",
      Kategori: "-",
      Extend: true,
      
     /**
     * @param {Client} client 
     */
    onLoad: function (client) {
      client.on('modalSubmit', async (modal) => {
        if(modal.customId == "senkYükleme") {
          let guild = client.guilds.cache.get(global.sistem.SUNUCU.GUILD)
          if(!guild) {
            await modal.deferReply({ ephemeral: true })
            return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
          }
          let cartelim = guild.members.cache.get(modal.user.id)
          if(!cartelim)  {
            await modal.deferReply({ ephemeral: true })
            return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
          }
          let senkronkodu = modal.getTextInputValue('nameee')
          if(!senkronkodu) {
            await modal.deferReply({ ephemeral: true })
            return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
          }
          let backupSettings = require('../../../../_SYSTEM/Databases/Schemas/Guild.Settings.Backup');
          let getir = await backupSettings.find()
          let kodbul = await backupSettings.findOne({Code: senkronkodu})
          if(!getir) {
            await modal.deferReply({ ephemeral: true })
            return await modal.followUp({content: `Hiç senkronize yapılmadığından işlem iptal edildi. ${cevaplar.prefix}` , ephemeral: true })
          }
          if(!kodbul) {
            await modal.deferReply({ ephemeral: true })
            return await modal.followUp({content: `Belirtilen \`${senkronkodu}\` sistemde bulunamadı.` , ephemeral: true })
          }
          await GUILD_SETTINGS.updateOne({_id: "1"}, {$set: {
            guildID: guild.id,
            Ayarlar: kodbul.Ayarlar,
            talentPerms: kodbul.talentPerms,
            Caches: kodbul.Caches
          }}, {upsert: true})

          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `${guild.emojiGöster(emojiler.onay_munur)} Başarıyla **${guild.name} => ${kodbul.Ayarlar.serverName}** sunucu ayarı yüklendi.` , ephemeral: true })
        }
      })
    },
  
     /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     */
  
    onRequest: async function (client, message, args) {
      if(!(sistem._rooter.rooters && sistem._rooter.rooters.includes(message.member.id)) && message.guild.ownerId != message.member.id)  if(message.member.id != "719117042904727635") return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
      if(args[0] == "auto") return message.channel.send(`${özellikler.map(x => `.setup ${x.name}`).join("\n")}`)
      let _yedekdosyası = message.attachments.first()?.url
      if(_yedekdosyası) {
        const fetch = require('node-fetch');
        let yükleme = await message.reply({content: `Komut işlenirken bir dosya eklendiği için dosya yedek dosyası olarak kontrol edilmektedir. Lütfen bekleyin!`})
        let _yüklenecekveriler;
        try {
          const response = await fetch(_yedekdosyası);
          if(!response.ok) return yükleme.edit({content: `Bu dosya okunamadığından dolayı işlem iptal edildi.`}), setTimeout(() => {
              yükleme.delete().catch(err => {})
          }, 5000);
          let text = await response.text()
          if(text) {
            _yüklenecekveriler = JSON.parse(text)
            if(_yüklenecekveriler) {
              yükleme.edit({content: null, embeds: [
                new cartelinEmbedi()
                .setDescription(`Başarıyla ${_yüklenecekveriler.Date} tarihinde alınan ${_yüklenecekveriler.Ayarlar.serverName} sunucu ismine ait yedek kuruldu. ${message.guild.emojiGöster(emojiler.onay_munur)}`)
              ]})
              _yüklenecekveriler.Date = Date.now()
              await GUILD_SETTINGS.updateOne({_id: "1"}, {$set: _yüklenecekveriler}, {upsert: true})
            }
          } else {

            yükleme.edit({content: `Bu bir yedekleme dosyası olmadığı için işlem iptal edildi.`})
            setTimeout(() => {
              yükleme.delete().catch(err => {})
            }, 5000);
          return
          }
        } catch (err) {
          
        }
        return;
      }
      const buttonSatir = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("ayarciklar")
        .setPlaceholder("🎄 Server")
        .setOptions(
          {label: "Botları Yeniden Başlat", emoji: {id: "949921900589617182"} ,description: "Tüm botları yeniden başlatmaktadır.", value: "restleaq"},
          {label: "Settings", emoji: {id: "943286195406925855"}, description: "Düzenlenmesi münkün olan ayarların listesi bulunmaktadır.", value: "ayarlistesi"},
          {label: "Angels", emoji: {id:"943285868368633886"}, description: "Sunucu üzerinde ki güvenliğin kontrolünü sağlayan ayarlar bulunmaktadır.", value: "ayarlar2"},
          {label: "Botları Düzenle", emoji: {id: "925127916621291541"}, description: "Belirtilen botun profil resmi, isim ve hakkındasını düzenlenebilir.", value: "botsettings"},
          {label: "Options", emoji: {id: "1055524311533899776"}, description: "Sunucu üzerinde olan menü ve düğme sistemini kurulumunu sağlar.", value: "seçenekkur"},
          {label: "Gates Botlarını Başlat", emoji: {id: "1042586695582879816"}, description: "Sunucu Üzerindeki Belirtilen Welcome Botlarını Başlatır.", value: "gates"},
          {label: "Yasaklı Tag", emoji: {id: "943290426562076762"}, description: "Sunucu üyelerinin isminde, istemediğiniz bir sembolü yasaklayabilir/kaldırabilirsiniz.", value: "yasaklıtag"},
          {label: "Log Channels", emoji: {id: "925127916382220379"}, description: "Sunucu da gerekli olan tüm işlem kayıtlarının kurulumu ve düzenlemesini sağlar.", value: "logkur"},
          {label: "Emojis", emoji: {id:"927315417146458113"}, description: "Botların ihtiyacı olan, emoji kurulumunu sağlar.", value: "emojikur"},
          {label: "İstatistikleri Sıfırla", emoji: {id: "951149348484415488"}, description: "Sunucunun tüm genel ve haftalık istatistiklerini temizler.", value: "stattemizle"},
          {label: "Yapılan Ayarları Sıfırla", emoji: {id: "927314290732576809"}, description: "Sunucunun tüm veritabanını ve yedeklerini kalıcı olarak temizler.", value: "ayarlar3"},
          {label: "Yedeklemeler", emoji: {id:"927196659056791602"}, description: "Anlık sunucunun verilerini ve içeriklerini yedeklemektedir.", value: "ayarlar1"},
          {label: "Yedek Listesi", emoji: {id:"936399548178370683"}, description: "Sunucu ayarlarının yedeklerini listelemektedir.", value: "ayarlar31"},
          {label: "Yedekleri Kur", emoji: {id:"938077389022437446"}, description: "Sunucu ayarlarının yedeklerini yüklemektedir.", value: "ayarlar62"},
          )
 
      
      )
      
        let Database = await GUILD_SETTINGS.findOne({guildID: message.guild.id})
        const data = Database.Ayarlar
        let secim = args[0];
        const embed = new cartelinEmbedi() 
        if (!secim || !özellikler.some(ozellik => ozellik.name.toLowerCase() == secim.toLowerCase())) {
            return message.channel.send({embeds: [embed.setColor("WHITE").setAuthor(message.member.user.tag, message.member.user.avatarURL({dynamic: true})).setDescription(`**${message.guild.name}** Sunucusunun Yönetim Paneline Hoş Geldiniz.
Botunuz, sunucunuz, veriler ve ayarlanabilir ayarlarını buradan güncelleyebilir düzeltebilirsiniz ayrıca lisans, üyelik ve paket işlemlerini ister buradan ister de websitesi kontrolü üzerinden yapabilirsiniz.
`)], components: [buttonSatir]}).then(async (x) => {
                const filter = i =>  i.user.id === message.member.id && i.customId == "ayarciklar";

                const collector = await x.createMessageComponentCollector({ filter, time: 100000 });
                
                collector.on('collect', async i => {
                  if(i.values[0] === 'emojikur') {
                  
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "emojikur")
                    kom.onRequest(client, message, args)
                  }
                  
                  if(i.values[0] === 'yasaklıtag') {
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "yasak-tag")
                    kom.onRequest(client, message, args)
                  }
                  if(i.values[0] === 'stattemizle') {
                    
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "stattemizle")
                    kom.onRequest(client, message, args)
                  }
                  if(i.values[0] === 'logkur') {
                    
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "logkur")
                    kom.onRequest(client, message, args)
                  }
                  if(i.values[0] == "seçenekkur") {
                    
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "seçenek")
                    kom.onRequest(client, message, args)
                  }
                  
                  if(i.values[0] == "restleaq") {
                    const cartelÖĞRENCİSİ = require("child_process");
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined),
                    x.delete().catch(err => {})
                    const ls = cartelÖĞRENCİSİ.exec(`pm2 restart all`);
                    ls.stdout.on('data', async function (data) {
                      await i.reply({content: `${message.guild.emojiGöster(emojiler.onay_munur)} Başarılı! ${ayarlar ? ayarlar.serverName ? ayarlar.serverName :  message.guild.name : message.guild.name} sunucusunun botları yeniden başlatıldı!`, ephemeral: true})
                    });
  
                  }
                  if(i.values[0] == "gates") {
                    const children = require("child_process");
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined),
                    x.delete().catch(err => {})
                    const ls = children.exec(`pm2 start voices`);
                    ls.stdout.on('data', async function (data) {
                      await i.reply({content: `${message.guild.emojiGöster(emojiler.onay_munur)} Başarılı! ${ayarlar ? ayarlar.serverName ? ayarlar.serverName :  message.guild.name : message.guild.name} sunucusunun voices botları başlatıldı!`, ephemeral: true})
                    });
  
                  }
                  if(i.values[0] === 'botsettings') {
                    
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "bot")
                    kom.onRequest(client, message, args)
                  }







               
                  
                  if(i.values[0] === "ayarlistesi") {
                    await i.reply({content: `\` \` 

\` \` **${message.guild.name} CÂRTELE Ait Ayarlanabilir Özellikler** (\`${özellikler.length} adet bulunmaktadır.\`): ${özellikler.map(o => `${o.name}`).join(", ")}`, ephemeral: true}), message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined), x.delete().catch(err => {})
                  }
                
                  if(i.values[0] === "ayarlar2") {
                    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "cârtel")
                    kom.onRequest(client, message, args)
                    i.deferUpdate().catch(err => {})
                  }
                  if(i.values[0] === "ayarlar62") {
                    x.delete().catch(err => {})
                    let senkronEt = new Modal()
                    .setCustomId('senkYükleme')
                    .setTitle(`Senkronize Yedek Yükleme`)
                    .addComponents(
                      new TextInputComponent()
                      .setCustomId('nameee')
                      .setLabel('Senkronize Kodu (S.K):')
                      .setStyle('SHORT')
                      .setMinLength(5)
                      .setMaxLength(50)
                      .setPlaceholder(`Örn: AC-7K6Tv`)
                      .setRequired(true)
                    );
                    showModal(senkronEt, {
                      client: client,
                      interaction: i,
                    })
                  }
                  if(i.values[0] === "ayarlar31") {
                    const backupSettings = require('../../../../_SYSTEM/Databases/Schemas/Guild.Settings.Backup');
                    let getir = await backupSettings.find()
                    if(!getir) await i.reply({content: `Bu sunucunun hiç bir ayar yedeklemesi bulunamadı.`, ephemeral: true})
                    
                    x.delete().catch(err => {})
                    await i.reply({content: `Aşağıda ${message.guild.name} sunucusuna ait __son 10 adet yedekleme__ bulunmaktadır.
Kurulum yapmak için tekrardan kurulum ekranından "Yedek Kur" seçeneğini seçerek ekrana gelen menüye senkronize kodunu girmeniz yeterli olacaktır.

${getir.sort((a, b) => b.Date - a.Date).slice(0, 10).map((x, value) => `\` ${value + 1} \` Senkronize Kodu: **\`${x.Code}\`** (<t:${String(Date.parse(x.Date)).slice(0, 10)}:R>)`).join("\n")}`, ephemeral: true})
                  }
                  if(i.values[0] === "ayarlar3") {
                    await GUILD_SETTINGS.deleteOne({_id: "1"});
                    await GUILD_SETTINGS.updateOne({_id: "1", guildID: message.guild.id}, {$set: {"Date": Date.now()}}, {upsert: true})
                    x.delete().catch(err => {})
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla sunucunun tüm ayar verileri temizlendi.`, ephemeral: true})
                  }
                  if(i.values[0] === "ayarlar1") {
                    function secretOluştur(length) {
                      var result           = '';
                      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                      var charactersLength = characters.length;
                      for ( var i = 0; i < length; i++ ) {
                         result += characters.charAt(Math.floor(Math.random() * charactersLength));
                      }
                      return result;
                   }
                    const backupSettings = require('../../../../_SYSTEM/Databases/Schemas/Guild.Settings.Backup');
                    let _datas = {
                      guildID: message.guild.id,
                      Ayarlar: ayarlar,
                      talentPerms: Database.talentPerms,
                      Caches: Database.Caches,
                      Date: tarihsel(Date.now())
                    }

                    await backupSettings.updateOne({Code: `AC-${secretOluştur(5)}`}, {$set: {guildID: message.guild.id, "Ayarlar": ayarlar, "talentPerms": Database.talentPerms, "Caches": Database.Caches, "Date": Date.now()}}, {upsert: true})

                    x.delete().catch(err => {})
                     await i.reply({files: [{
                      attachment: Buffer.from(JSON.stringify(_datas)),
                      name: `AC-${secretOluştur(5)}.münür`,
                     }],content: `${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla sunucunun anlık verileri yedeklenmesi alındı.
Size verilen dosyayı indirerek \`.setup\` komutunu kullanırken ek olarak eklendiğinde bu aldığınız yedeklemeyi tekrardan kurabileceksiniz.`, ephemeral: true})
                  }
                 
                    if (i.values[0] === 'ayarlar') {
                      let sunucu = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "guild")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "üyeler") return `\` • \` ${o} - ${element.map(role => message.guild.members.cache.get(role) || message.guild.channels.cache.get(role) || message.guild.roles.cache.get(role)).join(', ') || "` Liste Boş! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                        
                      }).join('\n');
                      let register = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "register")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "üyeler") return `\` • \` ${o} - ${element.map(role => message.guild.members.cache.get(role) || message.guild.channels.cache.get(role) || message.guild.roles.cache.get(role)).join(', ') || "` Liste Boş! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                      }).join('\n');
                      let limit = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "limit")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "üyeler") return `\` • \` ${o} - ${element.map(role => message.guild.members.cache.get(role) || message.guild.channels.cache.get(role) || message.guild.roles.cache.get(role)).join(', ') || "` Liste Boş! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                      }).join('\n');
                      let role = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "role")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "üyeler") return `\` • \` ${o} - ${element.map(role => message.guild.members.cache.get(role) || message.guild.channels.cache.get(role) || message.guild.roles.cache.get(role)).join(', ') || "` Liste Boş! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                      }).join('\n');
                      let punitives = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "punitives")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "üyeler") return `\` • \` ${o} - ${element.map(role => message.guild.members.cache.get(role) || message.guild.channels.cache.get(role) || message.guild.roles.cache.get(role)).join(', ') || "` Liste Boş! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                        
                      }).join('\n');
                      let channel = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "channel")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "üyeler") return `\` • \` ${o} - ${element.map(role => message.guild.members.cache.get(role) || message.guild.channels.cache.get(role) || message.guild.roles.cache.get(role)).join(', ') || "` Liste Boş! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                        
                        
                      }).join('\n');
                      let stat = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "stat")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "üyeler") return `\` • \` ${o} - ${element.map(role => message.guild.members.cache.get(role) || message.guild.channels.cache.get(role) || message.guild.roles.cache.get(role)).join(', ') || "` Liste Boş! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                       
                      }).join('\n');
                      let listeTum = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a)).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - \`${element.map(tag => `${tag}`).join(', ') ||  " Ayarlı Değil! "}\``
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "üyeler") return `\` • \` ${o} - ${element.map(role => message.guild.members.cache.get(role) || message.guild.channels.cache.get(role) || message.guild.roles.cache.get(role)).join(', ') || "` Liste Boş! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        else if(ozellik.type == "type") return `\` • \` ${o} - \`${element ? "Taglı!" : "Tagsız!"}\``
                        
                      }).join('\n');
                      await i.reply({content: 'Başarıyla! Tüm sunucu içinde yapılan ayarları aşağıda ki düğmelerden seçerek listeleyebilirsiniz.', ephemeral: true});
                      let Rows = new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId("ayarlar_tum")
                        .setLabel("Tüm Ayarları Görüntüle")
                        .setStyle("DANGER")
                        .setEmoji("925127916537413692"),
                        new MessageButton()
                        .setCustomId("ayarlar_sunucu")
                        .setLabel("Genel Sunucu Ayarları")
                        .setStyle("PRIMARY")
                        .setEmoji("925128101774647296"),
                        new MessageButton()
                        .setCustomId("ayarlar_role")
                        .setLabel("Rol Ayarları")
                        .setStyle("PRIMARY")
                        .setEmoji("927297098272083988"),
                        new MessageButton()
                        .setCustomId("ayarlar_channel")
                        .setLabel("Kanal Ayarları")
                        .setStyle("PRIMARY")
                        .setEmoji("927297745071534140"),
                        new MessageButton()
                        .setCustomId("ayarlar_punitives")
                        .setLabel("Cezalandırma Ayarları")
                        .setStyle("PRIMARY")
                        .setEmoji("927297796317540392"),
                      )
                      let RowsTWO = new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId("ayarlar_register")
                        .setLabel("Teyit Ayarları")
                        .setStyle("SECONDARY")
                        .setEmoji("927298179467198464"),
                        new MessageButton()
                        .setCustomId("ayarlar_limit")
                        .setLabel("Limit Ayarları")
                        .setStyle("SECONDARY")
                        .setEmoji("927298481046052985"),
                        new MessageButton()
                        .setCustomId("ayarlar_stat")
                        .setLabel("Diğer Ayarlar")
                        .setStyle("SECONDARY")
                        .setEmoji("925128103741775892"),
                      )
                      x.delete().catch(err => {})
                      let ayarlist = await message.channel.send({embeds: [new cartelinEmbedi().setColor("RANDOM").setDescription(`:tada: Aşağıda ki ayarlar kategorisinden hangi yapılan ayar listesini görüntülemek istediğini seçerek görüntüleyebilirsiniz.`)], components: [Rows, RowsTWO]}).then(async (msg) => {
                        const filter = i =>  i.user.id === message.member.id && (i.customId == "ayarlar_sunucu" 
|| i.customId == "ayarlar_tum" 
|| i.customId == "ayarlar_register" 
|| i.customId == "ayarlar_limit"
|| i.customId == "ayarlar_role"
|| i.customId == "ayarlar_punitives"
|| i.customId == "ayarlar_channel"
|| i.customId == "ayarlar_stat" )
                        const collector = await msg.createMessageComponentCollector({ filter, time: 60000 });
                        collector.on('collect', async (i) => {
if(i.customId == "ayarlar_tum") {
  await i.reply({content: "Aşağıda listelenmekte olan tüm sunucu ayarları görüntülenmektedir.", ephemeral: true})

const arr = Discord.Util.splitMessage(`
\`\`\`fix
Tüm Sunucu Ayarları (Genel [Kategori İçermez])\`\`\`
\` \` **Doğru Kullanım!** **\`${sistem.botSettings.Prefixs[0]}setup <[Ayar İsmi]> <[Yeni Ayar]>\`**
${listeTum}`, { maxLength: 2000, char: "\n" });
for (const newText of arr) {
  message.channel.send({embeds: [new cartelinEmbedi().setColor("DARK_GOLD").setDescription(`${newText}`)], ephemeral: true})
}

}


                          if(i.customId == "ayarlar_sunucu") await i.reply({embeds: [ new cartelinEmbedi().setDescription(`
  \`\`\`fix
  Genel Sunucu Ayarları (Rol & Kanal & Diğer) \`\`\`
\` \` **Doğru Kullanım!** **\`${sistem.botSettings.Prefixs[0]}setup <[Ayar İsmi]> <[Yeni Ayar]>\`**
${sunucu}`)], ephemeral: true})
  if(i.customId == "ayarlar_register") await i.reply({embeds: [ new cartelinEmbedi().setDescription(`
\`\`\`fix
Kayıt Ayarlar (Rol & Kanal & Diğer)\`\`\`
\` \` **Doğru Kullanım!** **\`${sistem.botSettings.Prefixs[0]}setup <[Ayar İsmi]> <[Yeni Ayar]>\`**
${register}`)], ephemeral: true})
if(i.customId == "ayarlar_limit") await i.reply({embeds: [ new cartelinEmbedi().setDescription(`
\`\`\`fix
Limit Ayarları\`\`\`
\` \` **Doğru Kullanım!** **\`${sistem.botSettings.Prefixs[0]}setup <[Ayar İsmi]> <[Yeni Ayar]>\`**
${limit}`)], ephemeral: true})
if(i.customId == "ayarlar_role") await i.reply({embeds: [ new cartelinEmbedi().setDescription(`
\`\`\`fix
Rol Ayarları\`\`\`
\` \` **Doğru Kullanım!** **\`${sistem.botSettings.Prefixs[0]}setup <[Ayar İsmi]> <[Yeni Ayar]>\`**
${role}`)], ephemeral: true})
if(i.customId == "ayarlar_punitives") await i.reply({embeds: [ new cartelinEmbedi().setDescription(`
\`\`\`fix
Ceza Ayarları (Rol & Kanal & Diğer)\`\`\`
\` \` **Doğru Kullanım!** **\`${sistem.botSettings.Prefixs[0]}setup <[Ayar İsmi]> <[Yeni Ayar]>\`**
${punitives}`)], ephemeral: true})
if(i.customId == "ayarlar_channel") await i.reply({embeds: [ new cartelinEmbedi().setDescription(`
\`\`\`fix
Kanal Ayarları\`\`\`
\` \` **Doğru Kullanım!** **\`${sistem.botSettings.Prefixs[0]}setup <[Ayar İsmi]> <[Yeni Ayar]>\`**
${channel}`)], ephemeral: true})
if(i.customId == "ayarlar_stat") await i.reply({embeds: [ new cartelinEmbedi().setDescription(`
\`\`\`fix
Diğer Ayarlar (Rol & Kanal & Diğer)\`\`\`
\` \` **Doğru Kullanım!** **\`${sistem.botSettings.Prefixs[0]}setup <[Ayar İsmi]> <[Yeni Ayar]>\`**
${stat}`)], ephemeral: true})
                        })
                        collector.on('end', collected => {
                          msg.delete().catch(err => {})
                        });
                      })

                    }
                  
                });
                
                collector.on('end', collected => {
                  x.delete().catch(err => {})
                });
            })
 
        }
        let ozellik = özellikler.find(o => o.name.toLowerCase() === secim.toLowerCase());
        
        if (ozellik.type == "tekil"){
          let metin = args.splice(1).join(" ");
          if (!metin) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.no_munur)} **\`${ozellik.name}\`** isimli ayarı nasıl yapmamı düşünüyorsun?`)]}).then(x => setTimeout(() => {
              x.delete()
          }, 7500));
          let logKanal = message.guild.kanalBul("guild-log")
          if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("ORANGE").setFooter(message.member.user.tag + " tarafından güncellendi.",message.member.user.avatarURL({dynamic: true}))
        .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından güncellendi.`).addField(`Ayar Bilgisi`,`
> Ayar İsmi: **\`${ozellik.name}\`**
> Yeni Verisi: **\`${metin}\`**
> Eski Verisi: **\`${ayarlar[`${ozellik.name}`] ? ayarlar[`${ozellik.name}`] : "Daha önce ayarlanmamış!"}\`**
> Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`)]})
          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: String(metin)}}, {upsert: true}).catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli ayar veritabanına \`${metin}\` olarak ayarlandı.`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
        }, 7500));
        }
        else if (ozellik.type == "roller") {
          let roller;
          if(message.mentions.roles.size >= 1)
            roller = message.mentions.roles.map(role => role.id);
          else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
          if(roller.length <= 0) return message.channel.send({embeds: [embed.setDescription(`${ozellik.name} isimli ayarı yapmak için belirli bir argüman belirtin!`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
        let logKanal = message.guild.kanalBul("guild-log")
        if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("WHITE").setFooter(message.member.user.tag + " tarafından güncellendi.",message.member.user.avatarURL({dynamic: true}))
      .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından güncellendi.`).addField(`Ayar Bilgisi`,`
> Ayar İsmi: **\`${ozellik.name}\`**
> Yeni Verisi: ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")}
> Eski Verisi: ${ayarlar[`${ozellik.name}`] ? ayarlar[`${ozellik.name}`].map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ") : "**`Daha önce ayarlanmamış!`**"}
> Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`)]})
            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: roller}}, {upsert: true}).catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli rol ayarını ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak tanımladın.`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
        }, 7500));
        }
        else if (ozellik.type == "kanallar") {
          let kanallar1;
          if(message.mentions.channels.size >= 1)
          kanallar1 = message.mentions.channels.map(role => role.id);
          else kanallar1 = args.splice(1).filter(role => message.guild.channels.cache.some(role2 => role == role2.id));
          if(kanallar1.length <= 0) return message.channel.send({embeds: [embed.setDescription(`${ozellik.name} isimli ayarı yapmak için belirli bir argüman belirtin!`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
        let logKanal = message.guild.kanalBul("guild-log")
        if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("ORANGE").setFooter(message.member.user.tag + " tarafından güncellendi.",message.member.user.avatarURL({dynamic: true}))
      .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından güncellendi.`).addField(`Ayar Bilgisi`,`
> Ayar İsmi: **\`${ozellik.name}\`**
> Yeni Verisi: ${kanallar1.map(role => message.guild.channels.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")}
> Eski Verisi: ${ayarlar[`${ozellik.name}`] ? ayarlar[`${ozellik.name}`].map(role => message.guild.channels.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ") : "**`Daha önce ayarlanmamış!`**"}
> Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`)]})
            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: kanallar1}}, {upsert: true}).catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli kanal ayarını ${kanallar1.map(role => message.guild.channels.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak tanımladın.`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
        }, 7500));
        }
        else if (ozellik.type == "üyeler") {
          let kanallar1;
          if(message.mentions.members.size >= 1 )
          kanallar1 = message.mentions.members.map(role => role.id) 
          else kanallar1 = args.splice(1).filter(role => message.guild.members.cache.some(role2 => role == role2.id));
          if(kanallar1.length <= 0) return message.channel.send({embeds: [embed.setDescription(`${ozellik.name} isimli ayarı yapmak için belirli bir argüman belirtin!`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: kanallar1}}, {upsert: true}).catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli üye listesini ${kanallar1.map(role => message.guild.members.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak tanımladın.`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
        }, 7500));
        }
        else if (ozellik.type == "rol") {
          let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(' '));
          if(!rol) return message.channel.send({embeds: [embed.setDescription(`${ozellik.name} isimli ayarı yapmak için belirli bir argüman belirtin!`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
        let logKanal = message.guild.kanalBul("guild-log")
        if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("ORANGE").setFooter(message.member.user.tag + " tarafından güncellendi.",message.member.user.avatarURL({dynamic: true}))
      .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından güncellendi.`).addField(`Ayar Bilgisi`,`
> Ayar İsmi: **\`${ozellik.name}\`**
> Yeni Verisi: ${rol}
> Eski Verisi: ${ayarlar[`${ozellik.name}`] ? message.guild.roles.cache.has(ayarlar[`${ozellik.name}`]) ? message.guild.roles.cache.get(ayarlar[`${ozellik.name}`]) : "**`Daha önce ayarlanmamış!`**" : "**`Daha önce ayarlanmamış!`**"}
> Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`)]})
          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli rol ayarını ${rol} olarak tanımladın.`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
        }, 7500));
        }
        else if (ozellik.type == "kanal"){
          let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
          if(!channel) return message.channel.send({embeds: [embed.setDescription(`${ozellik.name} isimli ayarı yapmak için belirli bir argüman belirtin!`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
        let logKanal = message.guild.kanalBul("guild-log")
        if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("ORANGE").setFooter(message.member.user.tag + " tarafından güncellendi.",message.member.user.avatarURL({dynamic: true}))
      .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından güncellendi.`).addField(`Ayar Bilgisi`,`
> Ayar İsmi: **\`${ozellik.name}\`**
> Yeni Verisi: ${channel}
> Eski Verisi: ${ayarlar[`${ozellik.name}`] ? message.guild.channels.cache.has(ayarlar[`${ozellik.name}`]) ? message.guild.channels.cache.get(ayarlar[`${ozellik.name}`]) : "**`Daha önce ayarlanmamış!`**" : "**`Daha önce ayarlanmamış!`**"}
> Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`)]})
        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: channel.id}}, {upsert: true}).catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli kanal ayarını ${channel} olarak tanımladın.`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
        }, 7500));
        }
        else if (ozellik.type == "cogul"){
  if(args[1] == "-temizle") {
    let logKanal = message.guild.kanalBul("guild-log")
    if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("ORANGE").setFooter(message.member.user.tag + " tarafından temizlendi.",message.member.user.avatarURL({dynamic: true}))
  .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından temizlendi.`).addField(`Ayar Bilgisi`,`
> Ayar İsmi: **\`${ozellik.name}\`**
> Yeni Verisi: **Temizlendi!**
> Eski Verisi: **\`${ayarlar[`${ozellik.name}`] ? ayarlar[`${ozellik.name}`].join(", ") : "Daha önce ayarlanmamış!"}\`**
> Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`)]})
    await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$unset: {[`Ayarlar.${ozellik.name}`]: []}}, {upsert: true}).catch(e => console.log(e))
    return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli çoklu ayar temizlendi.`)]}).then(x => setTimeout(() => {
      x.delete().catch(err => {})
      message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
    }, 7500));
  }  else {
    let tag = args.splice(1).join(' ');
    if(!tag) return message.channel.send({embeds: [embed.setDescription(`${ozellik.name} isimli ayarı yapmak için belirli bir argüman belirtin!`)]}).then(x => setTimeout(() => {
      x.delete()
  }, 7500));
    let arr = ayarlar[`${ozellik.name}`] || []
    let index = arr.find(e => e == tag);
    if(index) arr.splice(arr.indexOf(tag), 1);
    else arr.push(tag);
    let logKanal = message.guild.kanalBul("guild-log")
    if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("ORANGE").setFooter(message.member.user.tag + " tarafından güncellendi.",message.member.user.avatarURL({dynamic: true}))
  .setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından güncellendi.`).addField(`Ayar Bilgisi`,`
> Ayar İsmi: **\`${ozellik.name}\`**
> Yeni Verisi: ${tag} **(\`${arr.join(", ")}\`)**
> Eski Verisi: ${ayarlar[`${ozellik.name}`] ? ayarlar[`${ozellik.name}`].join(", ") : "**`Daha önce ayarlanmamış!`**"}
> Güncellenme Tarihi: **\`${tarihsel(Date.now())}\`**`)]})
    await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: arr}}, {upsert: true}).catch(e => console.log(e))
    return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli ayara \`${tag}\` ayarın eklendi. \`${arr.join(", ")}\` bulunuyor.`)]}).then(x => setTimeout(() => {
      x.delete().catch(err => {})
      message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
    }, 7500));
  }
        }
        else if (ozellik.type == "acmali"){
            let ozellikGetir = data[ozellik.name]
            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: !ozellikGetir}}, {upsert: true}).catch(e => console.log(e))
            let logKanal = message.guild.kanalBul("guild-log")
            if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("RANDOM").setFooter(message.member.user.tag + " tarafından güncellendi.",message.member.user.avatarURL({dynamic: true}))
.setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından **${!ozellikGetir ? "açıldı!" : "kapatıldı!"}**`)]})
            return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla **\`${ozellik.name}\`** isimli ayar ${!ozellikGetir ? "açıldı!" : "kapatıldı!"}`)]}).then(x => setTimeout(() => {
              x.delete().catch(err => {})
              message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
          }, 7500));
        }
        else if (ozellik.type == "type"){
          let ozellikGetir = data[ozellik.name]
          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: !ozellikGetir}}, {upsert: true}).catch(e => console.log(e))
          let logKanal = message.guild.kanalBul("guild-log")
          if(logKanal) logKanal.send({embeds: [new cartelinEmbedi().setColor("RANDOM").setFooter(message.member.user.tag + " tarafından güncellendi.",message.member.user.avatarURL({dynamic: true}))
.setDescription(`Sunucuda **${ozellik.name}** ayar'ı ${message.member} tarafından **${!ozellikGetir ? "taglı" : "tagsız"}** olarak ayarlandı.`)]})      
return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla \` ${message.guild.name} \` sunucusu isimli ${!ozellikGetir ? "**taglı** sisteme geçti!" : "**tagsız** sisteme geçti."}`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {})
        }, 7500));
      }
  }
  };

  