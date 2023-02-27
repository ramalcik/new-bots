const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const Forcebans = require('../../../../_SYSTEM/Databases/Schemas/Punitives.Forcebans');
const { cartelinEmbedi } = require('../../../../_SYSTEM/Reference/Embed');
module.exports = {
    Isim: "kalkmazban",
    Komut: ["munurban", "uzaoç","forceban","xox","siktirgitamınoğlu"],
    Kullanim: "kalkmazban <@munur/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi sunucudan uzaklaştırır.",
    Kategori: "kurucu",
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
    if(!sistem._rooter.rooters.includes(message.member.id)) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    let sunucudabul = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(sunucudabul && sunucudabul.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(sunucudabul && message.member.roles.highest.position <= sunucudabul.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.reply(cevaplar.sebep);
    if(sunucudabul) {
        ramalcim.addPunitives(1, message.member, sebep, message)
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    } else {
        let cezano = await Punitives.countDocuments()
        cezano = cezano == 0 ? 1 : cezano + 1;
        let ceza = new Punitives({ 
            No: cezano,
            Member: ramalcim.id,
            Staff: message.member.id,
            Type: "Kalkmaz Yasaklama",
            Reason: sebep,
            Date: Date.now()
        })
        ceza.save().catch(err => {})  
        islem = new Forcebans({
            No: cezano,
            _id: ramalcim.id,
        })
        await islem.save();
        let findedChannel = message.guild.kanalBul("forceban-log")
        if(findedChannel) findedChannel.send({embeds: [new cartelinEmbedi().setFooter(`Ceza Numarası: #${cezano}`, ramalcim.avatarURL({dynamic: true})).setDescription(`${ramalcim.toString()} üyesine, <t:${String(Date.now()).slice(0, 10)}:R> \`${sebep}\` nedeniyle işlem uygulandı.`)]})
        await message.channel.send(`${message.guild.emojiGöster(emojiler.Yasaklandı)} ${ramalcim.toString()} isimli üyeye \`${sebep}\` sebebiyle "__Kalkmaz(**BOT**) Yasaklama__" türünde ceza-i işlem uygulandı. (\`Ceza Numarası: #${cezano}\`)`)
        await message.guild.members.ban(ramalcim.id, { reason: `#${ceza.No} (${ceza.Reason})` }).catch(err => {})
        await Users.updateOne({ _id: message.member.id } , { $inc: { "Uses.Forceban": 1 } }, {upsert: true})
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    }
    }
};

  