const Upstaffs = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Staffs')

const moment = require('moment');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
require('moment-duration-format');
require('moment-timezone');

module.exports = {
    Isim: "ysenk",
    Komut: ["yetkisenkronize","y"],
    Kullanim: "y u <@munur/ID> <Yetki S.Kodu>",
    Aciklama: "Belirlenen üyeyi terfi sistemine senkronize eder.",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.sureCevir = (date) => { return moment.duration(date).format('H [saat,] m [dakika,] s [saniye]'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new cartelinEmbedi()
    if(!sistem._rooter.rooters.includes(message.member.id)) return;
    let işlem = args[0]
    if(işlem !== "u" && işlem !== "r") return;
    if(işlem === "u") {
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(1);
    let cartelim = message.mentions.members.first() || message.guild.members.cache.get(kullArgs[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[1])
    if(!cartelim) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
    if(!cartelim.user.username.includes(ayarlar.tag)) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
    if(message.author.id === cartelim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let yetkiKodu = parseInt(args[2]);
    if(isNaN(yetkiKodu)) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
    if(yetkiKodu > _statSystem.staffs.length) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
    await Upstaffs.updateOne({ _id: cartelim.id }, { $set: { "staffNo": yetkiKodu, "staffExNo": yetkiKodu - 1, "Points": 0, "ToplamPuan": 0, "Baslama": Date.now() } }, {upsert: true}); 
    let yeniYetki = _statSystem.staffs.filter(x => x.No == yetkiKodu - 1);
    if(yeniYetki) yeniYetki = yeniYetki[yeniYetki.length-1];
    if(yeniYetki) {
        if(!cartelim.roles.cache.has(yeniYetki.rol)) cartelim.roles.add(yeniYetki.rol)
        if(!cartelim.roles.cache.has(roller.altilkyetki)) await cartelim.roles.add(roller.altilkyetki);
    }
    message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
    message.guild.kanalBul("terfi-log").send({embeds: [embed.setDescription(`${message.member} isimli yetkili ${cartelim} isimli üyeyi <t:${String(Date.now()).slice(0, 10)}:R> ${yeniYetki.rol ? message.guild.roles.cache.get(yeniYetki.rol) : "Bulunamadı!"} role senkronize etti.`)]})
    } else if(işlem === "r") {
      const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if(!rol) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
      if(rol.members.size === 0) return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        rol.members.forEach(async cartelim => {
          if (cartelim.user.bot) return;
            if (_statSystem.staffs.some(x => cartelim.roles.cache.has(x.rol))) {
              let munur = _statSystem.staffs.find(x => cartelim.roles.cache.has(x.rol))
	      let No = Number(munur.No)
          if(!cartelim.roles.cache.has(roller.altilkyetki)) await cartelim.roles.add(roller.altilkyetki);
              await Upstaffs.updateOne({ _id: cartelim.id }, { $set: { "staffNo": No + Number(1), "staffExNo": No, "Points": 0, "ToplamPuan": 0, "Baslama": Date.now() } }, {upsert: true}); 
              //message.channel.send(`${message.guild.emojiGöster(emojiler.onay_munur)} ${cartelim} kişisi \`${rol.name}\` yetkisine senkronize edildi.`);
            } else return message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
        
        });
        message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
        //message.guild.kanalBul("senk-log").send(embed.setDescription(`${message.member} isimli yetkili ${rol} isimli roldeki üyeleri senkronize etti.`));
    }
  }
};


