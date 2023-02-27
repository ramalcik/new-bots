const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const Jail = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Jails');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "unjail",
    Komut: ["cezalıçıkart", "cezalıçıkart"],
    Kullanim: "unjail <#No/@munur/ID>",
    Aciklama: "Belirlenen üyeyi cezalıdan çıkartır.",
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
    if(Number(args[0])) {
      let cezanobul = await Jail.findOne({No: args[0]});
      if(cezanobul) args[0] = cezanobul._id
    }
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let cezakontrol = await Jail.findById(ramalcim.id)
    if(!cezakontrol) {
        message.channel.send(cevaplar.cezayok);
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        return;
    };
    let cezabilgisi = await Punitives.findOne({ Member: ramalcim.id, Active: true, Type: "Cezalandırılma" })
    if(cezabilgisi && cezabilgisi.Staff !== message.author.id && message.guild.members.cache.get(cezabilgisi.Staff) && !message.member.permissions.has("ADMINISTRATOR") && (roller.sorunÇözmeciler && !roller.sorunÇözmeciler.some(x => message.member.roles.cache.has(x))) && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) 
    return message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Bu ceza ${cezabilgisi.Staff ? message.guild.members.cache.get(cezabilgisi.Staff) ? `${message.guild.members.cache.get(cezabilgisi.Staff)} (\`${cezabilgisi.Staff}\`)` : `${cezabilgisi.Staff}` :  `${cezabilgisi.Staff}`} Tarafından cezalandırılmış. **Bu Cezayı Açman Münkün Değil!**`).setFooter("yaptırım yapılan cezada yaptırımı yapan yetkili işlem uygulayabilir.")]}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    await Jail.deleteOne({ _id: ramalcim.id })
    await Punitives.updateOne({ No: cezakontrol.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true })
    let User = await Users.findOne({_id: ramalcim.id});
    if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
        if(ramalcim && ramalcim.manageable && ayarlar.type && ayarlar.isimyas) ramalcim.setNickname(`${ayarlar.type ? ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ""}${User.Name}`)
        if(User.Gender == "Erkek") ramalcim.setRoles(roller.erkekRolleri)
        if(User.Gender == "Kadın") ramalcim.setRoles(roller.kadınRolleri)
        if(User.Gender == "Kayıtsız") ramalcim.setRoles(roller.kayıtsızRolleri)
        if(ramalcim.user.username.includes(ayarlar.tag)) ramalcim.roles.add(roller.tagRolü)
    } else {
        if(ramalcim && ramalcim.manageable && ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
        if(ramalcim && ramalcim.manageable && !ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`İsim | Yaş`)
        if(ramalcim && ramalcim.manageable && !ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`Kayıtsız`)
        if(ramalcim && ramalcim.manageable && ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
        ramalcim.setRoles(roller.kayıtsızRolleri)
    }
    if(!User) {
        ramalcim.setRoles(roller.kayıtsızRolleri)
        if(ramalcim && ramalcim.manageable && ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
        if(ramalcim && ramalcim.manageable && !ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`İsim | Yaş`)
        if(ramalcim && ramalcim.manageable && !ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`Kayıtsız`)
        if(ramalcim && ramalcim.manageable && ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
    }
    await message.reply(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim} üyesinin (\`#${cezakontrol.No}\`) ceza numaralı cezalandırılması kaldırıldı!`).then(x => {setTimeout(() => {
        x.delete()
    }, 10750)});;;
    if(ramalcim) ramalcim.send({embeds: [new cartelinEmbedi().setDescription(`${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> \`#${cezakontrol.No}\` ceza numaralı cezalandırılması kaldırıldı!`)]}).catch(x => {
      
    });
    let findChannel = message.guild.kanalBul("jail-log")
    if(findChannel) findChannel.send({embeds: [new cartelinEmbedi().setDescription(`${ramalcim} kullanıcısının \`#${cezakontrol.No}\` numaralı cezalandırılması <t:${String(Date.now()).slice(0, 10)}:R> ${message.member} tarafından kaldırıldı.`)]})
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    message.member.Leaders("ceza", 5, {type: "CEZA", user: ramalcim.id})
    message.member.Leaders("sorun", 5, {type: "CEZA", user: ramalcim.id})
    message.member.Leaders("criminal", 5, {type: "CEZA", user: ramalcim.id})
    }
};