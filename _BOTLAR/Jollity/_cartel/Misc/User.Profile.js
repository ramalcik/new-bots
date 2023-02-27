const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const moment = require("moment");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
require("moment-duration-format");
const Spotify = require('../../../../_SYSTEM/Additions/Spotify/_index')
const Seens = require('../../../../_SYSTEM/Databases/Schemas/Guild.Users.Seens');
module.exports = {
    Isim: "profil",
    Komut: ["me", "info"],
    Kullanim: "profil <@munur/ID>",
    Aciklama: "Belirlenen kişinin veya kullanan kişinin sunucu içerisindeki detaylarını ve discord içerisindeki bilgilerini aktarır.",
    Kategori: "diğer",
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
  let kullanici = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
  if(!kullanici) return message.reply(cevaplar.üyeyok).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
  let ramalcim = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member
  if(!ramalcim) return message.reply(cevaplar.üyeyok).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
  if(kullanici.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
  ramalcim = message.guild.members.cache.get(kullanici.id)
  kullanici = message.guild.members.cache.get(ramalcim.id)


  let SonGörülme = await Seens.findOne({userID: kullanici.id})

  let yetkiliKullanim = await Users.findOne({ _id: ramalcim.id })
  let cezapuanoku = await message.guild.members.cache.get(ramalcim.id).cezaPuan() 
  let platform = { web: '`İnternet Tarayıcısı` `🌍`', desktop: '`PC (App)` `💻`', mobile: '`Mobil` `📱`' }
  let bilgi;
  let ramalcimsesdurum;
  let yetkiliDurum;
  let obj;
  if(ramalcim.presence && ramalcim.presence.status !== 'offline') { bilgi = `\`•\` Bağlandığı Cihaz: ${platform[Object.keys(ramalcim.presence.clientStatus)[0]]}` } else { bilgi = '`•` Bağlandığı Cihaz: Çevrimdışı `🔻`' }
  let takipçi = yetkiliKullanim.Follower ? yetkiliKullanim.Follower.filter(x => message.guild.members.cache.get(x)).length : 0
  let arkadaşş = yetkiliKullanim.Friends ? yetkiliKullanim.Friends.filter(x => message.guild.members.cache.get(x)).length : 0
  let goruntulenme = yetkiliKullanim.Views || 0
  let begeni = yetkiliKullanim.Likes ? yetkiliKullanim.Likes.filter(x => message.guild.members.cache.get(x)).length : 0
  let takipçiPuan = Number(takipçi * 3.5) + Number(arkadaşş * 2.5) + Number(begeni * 1) + Number(goruntulenme / 200)
  let rozetler = []
  if(ramalcim.id == message.guild.ownerId) rozetler.push("guild_owner")
  if(ramalcim.user.username == "munur" && ramalcim.user.discriminator == "0001") {
    rozetler.push("staffscik", "dev","bughunter")
  }
  if(roller.Yetkiler && roller.Yetkiler.some(x => ramalcim.roles.cache.has(x))) rozetler.push("shield")
  if(ayarlar.type && ramalcim.user.username.includes(ayarlar.tag)) rozetler.push(emojiler.serverTag)
  if(roller.haftaninBirinciRolü && message.guild.roles.cache.has(roller.haftaninBirinciRolü) && ramalcim.roles.cache.has(roller.haftaninBirinciRolü)) rozetler.push("a_top")
  if(roller.vipRolü && message.guild.roles.cache.has(roller.vipRolü) && ramalcim.roles.cache.has(roller.vipRolü)) rozetler.push("a_vip")
  if(roller.boosterRolü && message.guild.roles.cache.has(roller.boosterRolü) && ramalcim.roles.cache.has(roller.boosterRolü)) rozetler.push("a_booster")
  if(takipçiPuan > 2 && takipçiPuan < 18) rozetler.push("a_one")
  if(takipçiPuan > 17 && takipçiPuan < 35) rozetler.push("a_two")
  if(takipçiPuan > 34 && takipçiPuan < 60) rozetler.push("a_three")
  if(takipçiPuan > 60 && takipçiPuan < 100) rozetler.push("a_four")
  if(takipçiPuan > 100 && takipçiPuan < 200) rozetler.push("a_five")
  if(takipçiPuan > 200 && takipçiPuan < 400) rozetler.push("a_six")
  if(takipçiPuan > 400 && takipçiPuan < 800) rozetler.push("a_seven")
  if(takipçiPuan > 800 && takipçiPuan < 1600) rozetler.push("a_eight")
  if(takipçiPuan > 1600 && takipçiPuan < 3200) rozetler.push("a_nine")
  if(takipçiPuan > 3200) rozetler.push("a_ten")
  


  

  const embed = new cartelinEmbedi().setAuthor(kullanici.user.tag, kullanici.user.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.user.avatarURL({dynamic: true, size: 2048}))
  .addField(`${message.guild.emojiGöster(emojiler.ramalcimEmojiID)} **Kullanıcı Bilgisi**`, 
`${yetkiliKullanim ? `${yetkiliKullanim.Biography ? `\`•\` Biyografi: \` ${yetkiliKullanim.Biography} \`\n` : ""}` : ``}\`•\` Rozetler: ${rozetler.length > 0 ? rozetler.map(x => message.guild.emojiGöster(x)).join(", ") : "**` Rozet Bulunamadı! `**"}
\`•\` Profil: ${kullanici}
\`•\` ID: \`${kullanici.id}\`
\`•\` Oluşturulma Tarihi: <t:${Number(String(Date.parse(kullanici.user.createdAt)).substring(0, 10))}:R>
${bilgi}
\`•\` Ceza Puanı: \`${cezapuanoku}\`
\`•\` Katılma Tarihi: <t:${Number(String(Date.parse(ramalcim.joinedAt)).substring(0, 10))}:R>
\`•\` Katılım Sırası: \`${(message.guild.members.cache.filter(a => a.joinedTimestamp <=ramalcim.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\`
\`•\` Rolleri (\`${ramalcim.roles.cache.size - 1 >= 0 ? ramalcim.roles.cache.size - 1 : 0}\`): ${ramalcim.roles.cache.size <= 5 ? ramalcim.roles.cache.filter(x => x.name !== "@everyone").array().listRoles() : `Listelenemedi!`}
${SonGörülme ? `\`•\` Son Görülme: <t:${String(SonGörülme.lastSeen).slice(0, 10)}:R> (\`${SonGörülme.last.type}\`)` : "`•` Son Görülme: ~"}
${yetkiliKullanim ? yetkiliKullanim.Registrant ? `\`•\` Teyit Sorumlusu: ${message.guild.members.cache.get(yetkiliKullanim.Registrant) ? message.guild.members.cache.get(yetkiliKullanim.Registrant)  : `<@${yetkiliKullanim.Registrant}>`} `:"" :""}`)
.addField(`${message.guild.emojiGöster(emojiler.ramalcimEmojiID)} **Sosyal Bilgisi**`, `\`•\` Takipçi: \`${takipçi}\` (Puan Etkisi: **\`+${takipçiPuan.toFixed(1)}\`** Tölerans: **\`+%${Number((takipçiPuan)*4/100).toFixed(1)}\`**) 
\`•\` Arkadaş: \`${arkadaşş}\` Takip Edilen: \`${yetkiliKullanim.FollowUp ? yetkiliKullanim.FollowUp.filter(x => message.guild.members.cache.get(x)).length : 0}\`
\`•\` Görütülenme: \`${yetkiliKullanim.Views || 0}\` Beğeni: \`${yetkiliKullanim.Likes ? yetkiliKullanim.Likes.filter(x => message.guild.members.cache.get(x)).length : 0}\``)
if(await ramalcim.voice.channel) {
    ramalcimsesdurum = `\`•\` Bulunduğu Kanal: ${ramalcim.voice.channel}`
    ramalcimsesdurum += `\n\`•\` Mikrofon Durumu: \`${ramalcim.voice.selfMute ? '❌' : '✅'}\``
    ramalcimsesdurum += `\n\`•\` Kulaklık Durumu: \`${ramalcim.voice.selfDeaf ? '❌' : '✅'}\``
    if(ramalcim.voice.selfVideo) ramalcimsesdurum += `\n\`•\` Kamera Durumu: \`✅\``
    if(ramalcim.voice.streaming) ramalcimsesdurum += `\n\`•\` Yayın Durumu: \`✅\``
    embed.addField(`${message.guild.emojiGöster("support")} **Sesli Kanal Bilgisi**`, ramalcimsesdurum);
  }
if(roller.Yetkiler.some(x => ramalcim.roles.cache.has(x)) || roller.kurucuRolleri.some(oku => ramalcim.roles.cache.has(oku)) || ramalcim.permissions.has('ADMINISTRATOR')) {
  if(yetkiliKullanim && yetkiliKullanim.Uses) {
    let uyari = yetkiliKullanim.Uses.Warns || 0
    let chatMute = yetkiliKullanim.Uses.Mutes || 0
    let sesMute = yetkiliKullanim.Uses.VoiceMute || 0
    let Kick = yetkiliKullanim.Uses.Kick || 0
    let ban = yetkiliKullanim.Uses.Ban || 0
    let jail = yetkiliKullanim.Uses.Jail || 0
    let forceban = yetkiliKullanim.Uses.Forceban || 0
    let Underworld = yetkiliKullanim.Uses.Underworld || 0
    let toplam = uyari+chatMute+sesMute+Kick+ban+jail;
    yetkiliDurum = `Yetkililik boyunca toplamda \`${toplam}\` yetki komutu kullanmış.\n(**${uyari}** uyarma, **${chatMute}** chat mute, **${sesMute}** ses mute, **${jail}** jail, **${Kick}** atma, **${Underworld}** underworld, **${ban}** yasaklama, **${forceban}** kalkmaz yasaklama)`;
    embed.addField(`${message.guild.emojiGöster("925127916537413692")} **Yaptırım Bilgileri**`, yetkiliDurum);
  }
}


let Row = new MessageActionRow()
.addComponents(
  new MessageSelectMenu()
    .setPlaceholder(`${ramalcim.user.tag} isimli kullanıcının detayları`)
    .setCustomId("process")
    .setOptions(
      {label: "Genel İstatistikler", description: `${ramalcim.user.tag} üyesinin sunucu içerisinde aktifliğini gösterir.`,emoji: {id: "948674910425853993"}, value: "statcim"},
      {label: "Ekonomi Durumu", description: `${ramalcim.user.tag} üyesinin ekonomi durumunu gösterir.`, emoji: {id: "948674949567111248"}, value: "coincim"},
      {label: "Ceza Geçmişi", description: `${ramalcim.user.tag} üyesinin ceza geçmişini listelenir.`, emoji: {id: "948677924561752104"}, value: "cezalarim"},
      {label: "Ses Geçmişi",description: `${ramalcim.user.tag} üyesinin ses kayıtlarını gösterir.`,  emoji: {id: "948679866562277456"}, value: "sesgecmisim"},
      {label: "Arkadaş Listesi",description: `${ramalcim.user.tag} üyesinin arkadaş listesini görüntüler.`,  emoji: {id: "943286130357444608"}, value: "arkadaşListesi"},
      {label: "Takipçi Listesi",description: `${ramalcim.user.tag} üyesinin takipçi listesini görüntüler.`,  emoji: {id: "943286130357444608"}, value: "takipçiListesi"},
      {label: "Takip Edilen Listesi", description: `${ramalcim.user.tag} üyesinin takip edilen listesini görüntüler.`, emoji: {id: "951514358515638362"}, value: "takipEdilenListesi"},
      {label: "Beğeni Listesi", description: `${ramalcim.user.tag} üyesinin beğenilme listesini görüntüler.`, emoji: {id: "629785162649174016"}, value: "beğeniListesi"},
      {label: "Profil Fotoğrafı", description: `${ramalcim.user.tag} üyesinin profil resmini büyütür.`, emoji: {id: "926954863647150140"}, value: "pp"},
      {label: "Profil Kapağı",  description: `${ramalcim.user.tag} üyesinin profil arkaplanını büyütür.`, emoji: {id: "926954863647150140"},value: "banner"},

    )
)
if (ramalcim && ramalcim.presence && ramalcim.presence.activities && ramalcim.presence.activities.some(x => x.name == "Spotify" && x.type == "LISTENING")) {
  let presence = ramalcim.presence.activities.find(x => x.name == "Spotify");
  let x = Date.parse(presence.timestamps.start)
  let y = Date.parse(presence.timestamps.end)
  let time = Date.now() - presence.timestamps.start

  const spotify = await new Spotify()
  .setAuthor(presence.state)
  .setAlbum(presence.assets.largeText)
  .setBackground("image", message.guild.bannerURL({dynamic: true}))
  .setImage(`https://i.scdn.co/image/${presence.assets.largeImage.slice(8)}`)
  .setTimestamp(time, y - Date.now())
  .setTitle(presence.details)
  .build();

  embed.setImage('attachment://spotify.png')
  obj = {embeds: [embed], components: [Row], files: [{
    attachment: spotify.toBuffer(),
    name: `spotify.png`
  }]}
} else {
  obj = {embeds: [embed], components: [Row]}
}
let x = await message.reply({embeds: [new cartelinEmbedi().setDescription(`${ramalcim} isimli üyenin detaylı bilgileri yükleniyor...`)]})
x.edit(obj).then(x => {
  var filter = (i) => i.user.id == message.member.id
  let collector = x.createMessageComponentCollector({filter: filter, max: 1, time: 60000})
  collector.on('collect', async (i) => {
    if(i.values[0] == "beğeniListesi") {
      const button1 = new MessageButton()
      .setCustomId('geri')
      .setLabel('◀ Geri')
      .setStyle('PRIMARY');
const buttonkapat = new MessageButton()
      .setCustomId('kapat')
      .setLabel('❌')
      .setStyle('SECONDARY');
const button2 = new MessageButton()
      .setCustomId('ileri')
      .setLabel('İleri ▶')
      .setStyle('PRIMARY');
Users.findOne({_id: ramalcim.id }, async (err, res) => {
if (!res) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin hiç beğenisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
if(!res.Likes) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin hiç beğenisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
let pages = res.Likes.filter(x => message.guild.members.cache.get(x)).chunk(10);
var currentPage = 1
if (!pages && !pages.length || !pages[currentPage - 1]) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin hiç beğenisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
let embed = new cartelinEmbedi().setColor("RANDOM")
const row = new MessageActionRow().addComponents([button1, buttonkapat, button2]);
if (message.deferred == false){
await message.deferReply()
};
const curPage = await i.reply({
embeds: [embed.setDescription(`${ramalcim} üyesinin beğenileri yükleniyor. Lütfen bekleyin...`)],
components: [row], fetchReply: true
}).catch(err => {});

await curPage.edit({embeds: [embed.setDescription(`Aşağıda ${ramalcim} isimli üyenin beğeni listesi listelenmektedir.

${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x)} (${message.guild.members.cache.get(x).user.tag})`).join("\n")}`)]}).catch(err => {})

const filter = (i) => i.user.id == message.member.id

const collector = await curPage.createMessageComponentCollector({
filter,
time: 30000,
});

collector.on("collect", async (i) => {
switch (i.customId) {
case "ileri":
  if (currentPage == pages.length) break;
  currentPage++;
  break;
case "geri":
  if (currentPage == 1) break;
  currentPage--;
  break;
default:
  break;
case "kapat": 
  i.deferUpdate().catch(err => {});
  curPage.delete().catch(err => {})
  return message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined);
}
await i.deferUpdate();
await curPage.edit({
embeds: [embed.setDescription(`Aşağıda ${ramalcim} isimli üyenin arkadaş listesi listelenmektedir.

${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x)} (${message.guild.members.cache.get(x).user.tag})`).join("\n")}`)]
}).catch(err => {});
collector.resetTimer();
});
collector.on("end", () => {
if(curPage) curPage.edit({
embeds: [embed.setDescription(`${ramalcim} isimli üyesinin toplamda \`${res.Likes.length || 0}\` beğenisi mevcut.`)],
components: [],
}).catch(err => {});
})
})

    }



    if(i.values[0] == "arkadaşListesi") {
      const button1 = new MessageButton()
      .setCustomId('geri')
      .setLabel('◀ Geri')
      .setStyle('PRIMARY');
const buttonkapat = new MessageButton()
      .setCustomId('kapat')
      .setLabel('❌')
      .setStyle('SECONDARY');
const button2 = new MessageButton()
      .setCustomId('ileri')
      .setLabel('İleri ▶')
      .setStyle('PRIMARY');
Users.findOne({_id: ramalcim.id }, async (err, res) => {
if (!res) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin hiç arkadaşı bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
if(!res.Friends) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin hiç arkadaşı bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
let pages = res.Friends.filter(x => message.guild.members.cache.get(x)).chunk(10);
var currentPage = 1
if (!pages && !pages.length || !pages[currentPage - 1]) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin hiç arkadaşı bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
let embed = new cartelinEmbedi().setColor("RANDOM")
const row = new MessageActionRow().addComponents([button1, buttonkapat, button2]);
if (message.deferred == false){
await message.deferReply()
};
const curPage = await i.reply({
embeds: [embed.setDescription(`${ramalcim} üyesinin arkadaş listesi yükleniyor. Lütfen bekleyin...`)],
components: [row], fetchReply: true
}).catch(err => {});

await curPage.edit({embeds: [embed.setDescription(`Aşağıda ${ramalcim} isimli üyenin arkadaş listesi listelenmektedir.

${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x)} (${message.guild.members.cache.get(x).user.tag})`).join("\n")}`)]}).catch(err => {})

const filter = (i) => i.user.id == message.member.id

const collector = await curPage.createMessageComponentCollector({
filter,
time: 30000,
});

collector.on("collect", async (i) => {
switch (i.customId) {
case "ileri":
  if (currentPage == pages.length) break;
  currentPage++;
  break;
case "geri":
  if (currentPage == 1) break;
  currentPage--;
  break;
default:
  break;
case "kapat": 
  i.deferUpdate().catch(err => {});
  curPage.delete().catch(err => {})
  return message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined);
}
await i.deferUpdate();
await curPage.edit({
embeds: [embed.setDescription(`Aşağıda ${ramalcim} isimli üyenin arkadaş listesi listelenmektedir.

${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x)} (${message.guild.members.cache.get(x).user.tag})`).join("\n")}`)]
}).catch(err => {});
collector.resetTimer();
});
collector.on("end", () => {
if(curPage) curPage.edit({
embeds: [embed.setDescription(`${ramalcim} isimli üyesinin toplamda \`${res.Friends.length || 0}\` arkadaşı mevcut.`)],
components: [],
}).catch(err => {});
})
})

    }
    if(i.values[0] == "takipEdilenListesi") {
      const button1 = new MessageButton()
      .setCustomId('geri')
      .setLabel('◀ Geri')
      .setStyle('PRIMARY');
const buttonkapat = new MessageButton()
      .setCustomId('kapat')
      .setLabel('❌')
      .setStyle('SECONDARY');
const button2 = new MessageButton()
      .setCustomId('ileri')
      .setLabel('İleri ▶')
      .setStyle('PRIMARY');
Users.findOne({_id: ramalcim.id }, async (err, res) => {
if (!res) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin takip edilen bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
if(!res.FollowUp) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin takip edilen bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
let pages = res.FollowUp.filter(x => message.guild.members.cache.get(x)).chunk(10);
var currentPage = 1
if (!pages && !pages.length || !pages[currentPage - 1]) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin takip edilen bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
let embed = new cartelinEmbedi().setColor("RANDOM")
const row = new MessageActionRow().addComponents([button1, buttonkapat, button2]);
if (message.deferred == false){
await message.deferReply()
};
const curPage = await i.reply({
embeds: [embed.setDescription(`${ramalcim} üyesinin takip edilen bilgisi yükleniyor. Lütfen bekleyin...`)],
components: [row], fetchReply: true
}).catch(err => {});

await curPage.edit({embeds: [embed.setDescription(`Aşağıda ${ramalcim} isimli üyenin takip edilen listesi listelenmektedir.

${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x)} (${message.guild.members.cache.get(x).user.tag})`).join("\n")}`)]}).catch(err => {})

const filter = (i) => i.user.id == message.member.id

const collector = await curPage.createMessageComponentCollector({
filter,
time: 30000,
});

collector.on("collect", async (i) => {
switch (i.customId) {
case "ileri":
  if (currentPage == pages.length) break;
  currentPage++;
  break;
case "geri":
  if (currentPage == 1) break;
  currentPage--;
  break;
default:
  break;
case "kapat": 
  i.deferUpdate().catch(err => {});
  curPage.delete().catch(err => {})
  return message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined);
}
await i.deferUpdate();
await curPage.edit({
embeds: [embed.setDescription(`Aşağıda ${ramalcim} isimli üyenin takip edilen listesi listelenmektedir.

${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x)} (${message.guild.members.cache.get(x).user.tag})`).join("\n")}`)]
}).catch(err => {});
collector.resetTimer();
});
collector.on("end", () => {
if(curPage) curPage.edit({
embeds: [embed.setDescription(`${ramalcim} isimli üyesinin toplamda \`${res.FollowUp.length || 0}\` adet takip ettiği mevcut.`)],
components: [],
}).catch(err => {});
})
})

    }

    if(i.values[0] == "takipçiListesi") {
      const button1 = new MessageButton()
      .setCustomId('geri')
      .setLabel('◀ Geri')
      .setStyle('PRIMARY');
const buttonkapat = new MessageButton()
      .setCustomId('kapat')
      .setLabel('❌')
      .setStyle('SECONDARY');
const button2 = new MessageButton()
      .setCustomId('ileri')
      .setLabel('İleri ▶')
      .setStyle('PRIMARY');
Users.findOne({_id: ramalcim.id }, async (err, res) => {
if (!res) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin takipçi bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
if(!res.Follower) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin takipçi bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
let pages = res.Follower.filter(x => message.guild.members.cache.get(x)).chunk(10);
var currentPage = 1
if (!pages && !pages.length || !pages[currentPage - 1]) return i.reply({ephemeral: true, embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin takipçi bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
let embed = new cartelinEmbedi().setColor("RANDOM")
const row = new MessageActionRow().addComponents([button1, buttonkapat, button2]);
if (message.deferred == false){
await message.deferReply()
};
const curPage = await i.reply({
embeds: [embed.setDescription(`${ramalcim} üyesinin takipçi bilgisi yükleniyor. Lütfen bekleyin...`)],
components: [row], fetchReply: true
}).catch(err => {});

await curPage.edit({embeds: [embed.setDescription(`Aşağıda ${ramalcim} isimli üyenin takipçi listesi listelenmektedir.

${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x)} (${message.guild.members.cache.get(x).user.tag})`).join("\n")}`)]}).catch(err => {})

const filter = (i) => i.user.id == message.member.id

const collector = await curPage.createMessageComponentCollector({
filter,
time: 30000,
});

collector.on("collect", async (i) => {
switch (i.customId) {
case "ileri":
  if (currentPage == pages.length) break;
  currentPage++;
  break;
case "geri":
  if (currentPage == 1) break;
  currentPage--;
  break;
default:
  break;
case "kapat": 
  i.deferUpdate().catch(err => {});
  curPage.delete().catch(err => {})
  return message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined);
}
await i.deferUpdate();
await curPage.edit({
embeds: [embed.setDescription(`Aşağıda ${ramalcim} isimli üyenin takipçi listesi listelenmektedir.

${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x)} (${message.guild.members.cache.get(x).user.tag})`).join("\n")}`)]
}).catch(err => {});
collector.resetTimer();
});
collector.on("end", () => {
if(curPage) curPage.edit({
embeds: [embed.setDescription(`${ramalcim} isimli üyesinin toplamda \`${res.Follower.length || 0}\` adet takipçisi mevcut.`)],
components: [],
}).catch(err => {});
})
})

    }
    if(i.values[0] == "statcim") {
      let kom = client.commands.find(x => x.Isim == "stat")
      if(kom) kom.onRequest(client, message, args)
      x.delete().catch(err => {})
      i.deferUpdate().catch(err => {})
    }
    if(i.values[0] == "coincim") {
      let kom = client.commands.find(x => x.Isim == "coin")
      if(kom) kom.onRequest(client, message, args)
      x.delete().catch(err => {})
      i.deferUpdate().catch(err => {})
    }
    if(i.values[0] == "sesgecmisim") {
      let kom = client.commands.find(x => x.Isim == "seslog")
      if(kom) kom.onRequest(client, message, args)
      x.delete().catch(err => {})
      i.deferUpdate().catch(err => {})
    }
    if(i.values[0] == "pp") {
      let kom = client.commands.find(x => x.Isim == "avatar")
      if(kom) kom.onRequest(client, message, args)
      x.delete().catch(err => {})
      i.deferUpdate().catch(err => {})
    }
    if(i.values[0] == "banner") {
      let kom = client.commands.find(x => x.Isim == "banner")
      if(kom) kom.onRequest(client, message, args)
      x.delete().catch(err => {})
      i.deferUpdate().catch(err => {})
    }

    if(i.values[0] == "cezalarim") {
      let kom = client.commands.find(x => x.Isim == "cezalar")
      if(kom) kom.onRequest(client, message, args)
      x.delete().catch(err => {})
      i.deferUpdate().catch(err => {})
    }
  })
  collector.on('end', async (i) => x.delete().catch(err => {}), message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined).catch(err => {}))
});



    }
};