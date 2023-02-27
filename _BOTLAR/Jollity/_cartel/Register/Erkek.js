const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const {cartelinEmbedi} = require('../../../../_SYSTEM/Reference/Embed');
module.exports = {
    Isim: "erkek",
    Komut: ["e","er"],
    Kullanim: "erkek @munur/ID <isim/nick>",
    Aciklama: "Belirtilen üye sunucuda kayıtsız bir üye ise kayıt etmek için kullanılır.",
    Kategori: "teyit",
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
    if(ayarlar.dugmeliKayit) return;
    let regPanelEmbed = new cartelinEmbedi();
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uyarısıVar = await Punitives.findOne({Member: ramalcim.id, Type: "Uyarılma"})
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim.manageable) return message.reply(cevaplar.dokunulmaz).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    if(roller.erkekRolleri.some(x => ramalcim.roles.cache.has(x))) return message.reply(cevaplar.kayıtlı).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kadınRolleri.some(x => ramalcim.roles.cache.has(x))) return message.reply(cevaplar.kayıtlı).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    if(ayarlar.taglıalım && ayarlar.taglıalım != false && !ramalcim.user.username.includes(ayarlar.tag) && !ramalcim.roles.cache.has(roller.boosterRolü) && !ramalcim.roles.cache.has(roller.vipRolü) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.taglıalım).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    if(ayarlar.teyitZorunlu && !ramalcim.voice.channel  && !ramalcim.roles.cache.has(roller.boosterRolü) && !ramalcim.roles.cache.has(roller.vipRolü) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply({embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.no_munur)} **${ayarlar.serverName}** sunucusunda **Ses Teyit** zorunluluğu bulunduğundan dolayı ${ramalcim} isimli üyenin kayıt işlemi \`${tarihsel(Date.now())}\` tarihinde iptal edildi.`).setFooter(`Belirtilen üyenin seste bulunmasıyla, tekrardan teyit alınabilir.`)]}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined).catch(err => {})
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 15000);
    })
    if(Date.now()-ramalcim.user.createdTimestamp < 1000*60*60*24*7 && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yenihesap).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(ramalcim.roles.cache.has(roller.şüpheliRolü) && ramalcim.roles.cache.has(roller.jailRolü) && ramalcim.roles.cache.has(roller.underworldRolü) &&  ramalcim.roles.cache.has(roller.yasaklıTagRolü) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.cezaliüye).then(x => x.delete({timeout: 5000}))   
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    if(!isim) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(ayarlar.isimyas && !yaş) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if (ayarlar.isimyas && yaş < ayarlar.minYaş) return message.reply(cevaplar.yetersizyaş).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(ayarlar.isimyas) {
            setName = `${isim} | ${yaş}`;
    } else {
            setName = `${isim}`;
    }
    let cezaPuanı = await ramalcim.cezaPuan()
    if(cezaPuanı >= 100 && !message.member.permissions.has('ADMINISTRATOR') && (roller.sorunÇözmeciler && !roller.sorunÇözmeciler.some(x => message.member.roles.cache.has(x))) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply({
        embeds: [new cartelinEmbedi().setDescription(`Belirlenen ${ramalcim} isimli üyenin ceza puanı 100'ün üzerinde olduğu için kayıt işlemi alınamıyor. 
Bir itirazınız var ise ${roller.sorunÇözmeciler ? roller.sorunÇözmeciler.filter(x => message.guild.roles.cache.has(x)).map(x => message.guild.roles.cache.get(x)).join(", ") : roller.altYönetimRolleri.filter(x => message.guild.roles.cache.has(x)).map(x => message.guild.roles.cache.get(x)).join(", ")} rolü ve üstündeki rollerden herhangi bir yetkiliye ulaşınız ve durumu onlara da anlatınız.`)]
    }).then(x => { 
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined).catch(err => {})
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 15000)
    })
    await message.reply({ embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim} isimli üye **Erkek** olarak kayıt edildi.`)], components: [] }).then(x => {
        setTimeout(() => {
            x.delete()
        }, 10000);
    })
    ramalcim.setNickname(`${ayarlar.type ? ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ``}${setName}`).catch(err => message.reply(cevaplar.isimapi));
    ramalcim.Register(`${setName}`, "Erkek", message.member);
    client.Upstaffs.addPoint(message.member.id,_statSystem.points.record, "Kayıt")
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
};

