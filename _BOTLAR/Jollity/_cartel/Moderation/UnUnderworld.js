const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "unban",
    Komut: ["yasaklama-kaldır","bankaldır","yasaklamakaldır"],
    Kullanim: "unban <#No/@munur/ID>",
    Aciklama: "Belirlenen üyenin yasaklamasını kaldırır.",
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
    if(!roller.banHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(Number(args[0])) {
        let cezanobul = await Punitives.findOne({Type: "Underworld", No: args[0], Active: true})
        if(cezanobul) args[0] = cezanobul.Member
    }
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])    
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    await Punitives.findOne({Member: ramalcim.id, Type: "Underworld", Active: true}).exec(async (err, res) => {
        if(!res) return message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Belirtilen ${ramalcim} isimli üyenin **Underworld** cezası bulunamadı.`)]}).then(x => {
                message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
                setTimeout(() => {
                    x.delete()
                }, 7500);
            });
        
            if(res) {
                if(res.Staff !== message.author.id && message.guild.members.cache.get(res.Staff) && !sistem._rooter.rooters.includes(message.member.id) && (roller.sorunÇözmeciler && !roller.sorunÇözmeciler.some(x => message.member.roles.cache.has(x))) && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) return message.channel.send({embeds: [new cartelinEmbedi().setDescription(`${cevaplar.prefix} Bu ceza ${res.Staff ? message.guild.members.cache.get(res.Staff) ? `${message.guild.members.cache.get(res.Staff)} (\`${res.Staff}\`)` : `${res.Staff}` :  `${res.Staff}`} Tarafından cezalandırılmış. **Bu Cezayı Açman Münkün Değil!**`).setFooter("yaptırım yapılan cezada yaptırımı yapan yetkili işlem uygulayabilir.")]}).then(x => {
                    message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                });
            }
            if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true })
            let bul = message.guild.members.cache.get(ramalcim.id) 
            if(bul) {
                let User = await Users.findOne({_id: ramalcim.id});
                if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
                    if(ramalcim && ramalcim.manageable) ramalcim.setNickname(`${ayarlar.type ? ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag + " ": (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")): ""}${User.Name}`)
                    if(User.Gender == "Erkek") ramalcim.setRoles(roller.erkekRolleri)
                    if(User.Gender == "Kadın") ramalcim.setRoles(roller.kadınRolleri)
                    if(User.Gender == "Kayıtsız") ramalcim.setRoles(roller.kayıtsızRolleri)
                    if(ramalcim.user.username.includes(ayarlar.tag)) ramalcim.roles.add(roller.tagRolü)
                } else {
                    ramalcim.setRoles(roller.kayıtsızRolleri)
                    if(ramalcim && ramalcim.manageable && ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
                    if(ramalcim && ramalcim.manageable && !ayarlar.type && ayarlar.isimyas) await ramalcim.setNickname(`İsim | Yaş`)
                    if(ramalcim && ramalcim.manageable && !ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`Kayıtsız`)
                    if(ramalcim && ramalcim.manageable && ayarlar.type && !ayarlar.isimyas) await ramalcim.setNickname(`${ramalcim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
                }
            }
            let findChannel = message.guild.kanalBul("underworld-log");
            if(findChannel) await findChannel.send({embeds: [new cartelinEmbedi().setDescription(`${ramalcim} kullanıcısının sunucudaki ${res ? `\`#${res.No}\` ceza numaralı Underworld'ü` : `Underworld'ü`}, <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından kaldırıldı.`)]})
            await message.reply(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim} üyesinin ${res ? `(\`#${res.No}\`) ceza numaralı` : "sunucudaki"} Underworld'ü kaldırıldı!`);
            message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
            message.member.Leaders("ceza", 5, {type: "CEZA", user: ramalcim.id})
            message.member.Leaders("sorun", 5, {type: "CEZA", user: ramalcim.id})
            message.member.Leaders("criminal", 5, {type: "CEZA", user: ramalcim.id})
        })
   
    }
};