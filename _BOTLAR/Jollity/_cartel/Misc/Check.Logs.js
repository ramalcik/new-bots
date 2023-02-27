const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

const Users = require('../../../../_SYSTEM/Databases/Schemas/Users.Components');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "checklog",
    Komut: ["tıklamalog","tıklamalog","tiklamalog","ilgilenme","ilgilenmeler"],
    Kullanim: "ilgilenme @munur/ID",
    Aciklama: "Bir üyenin rol geçmişini görüntüler.",
    Kategori: "yönetim",
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
    if(!roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ramalcim = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    if(!ramalcim) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    ramalcim = message.guild.members.cache.get(ramalcim.id)
    const button1 = new MessageButton()
                .setCustomId('geri')
                .setLabel('◀ Geri')
                .setStyle('PRIMARY');
    const buttonkapat = new MessageButton()
                .setCustomId('kapat')
 .setEmoji("929001437466357800")               
 .setStyle('DANGER');
                
    const button2 = new MessageButton()
                .setCustomId('ileri')
                .setLabel('İleri ▶')
                .setStyle('PRIMARY');
    Users.findOne({_id: ramalcim.id }, async (err, res) => {
      if (!res) return message.reply({embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin ilgilenme bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      if(!res.Checks) return message.reply({embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin ilgilenme bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let pages = res.Checks.sort((a, b) => b.date - a.date).chunk(15);
      var currentPage = 1
      let geçerliolanlar = res.Checks.filter(x => {
        let ramalcim = message.guild.members.cache.get(x.target)
        return ramalcim && (ramalcim.user.username.includes(ayarlar.tag) || roller.Yetkiler.some(x => ramalcim.roles.cache.has(x)))
}).length
      if (!pages && !pages.length || !pages[currentPage - 1]) return message.reply({embeds: [new cartelinEmbedi().setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setDescription(`${ramalcim} isimli üyenin ilgilenme bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let embed = new cartelinEmbedi().setColor("RANDOM").setAuthor(ramalcim.user.tag, ramalcim.user.avatarURL({dynamic: true})).setFooter(`${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length}`, message.guild.iconURL({dynamic: true}))
      const row = new MessageActionRow().addComponents([button1, buttonkapat, button2]);
      if (message.deferred == false){
        await message.deferReply()
      };
      const curPage = await message.reply({
        embeds: [embed.setDescription(`${ramalcim}, üyesinin ilgilenme bilgisi yükleniyor... Lütfen bekleyin...`)],
        components: [row], fetchReply: true,
      }).catch(err => {});
    
      await curPage.edit({embeds: [embed.setDescription(`Geçerli olan ilgilenmeler "${message.guild.emojiGöster(emojiler.onay_munur)}" olarak görülür, geçersiz olanlar ise "${message.guild.emojiGöster(emojiler.no_munur)}" olarak görültülenir.
    
Geçerli olan: ${geçerliolanlar}
Geçersiz olan: ${res.Checks.length - geçerliolanlar}

${pages[currentPage - 1].map((x, index) => {
        let okey = false
        let ramalcim = message.guild.members.cache.get(x.target)
        if(ramalcim && (ramalcim.user.username.includes(ayarlar.tag) || roller.Yetkiler.some(x => ramalcim.roles.cache.has(x)))) okey = true
        return `\` ${index+1} \` <@!${ramalcim ? ramalcim.id : x.target}> <t:${String(x.date).slice(0, 10)}:R> [**${x.type}** | ${okey ? message.guild.emojiGöster(emojiler.onay_munur) : message.guild.emojiGöster(emojiler.no_munur)}] `
      }).join("\n")}`)]}).catch(err => {})

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
          embeds: [embed.setFooter(`${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length} `, message.guild.iconURL({dynamic: true})).setDescription(`Geçerli olan ilgilenmeler ${message.guild.emojiGöster(emojiler.onay_munur)} olarak görülür, geçersiz olanlar ise ${message.guild.emojiGöster(emojiler.no_munur)} olarak görültülenir.
    
Geçerli olan: ${geçerliolanlar}
Geçersiz olan: ${res.Checks.length - geçerliolanlar}
          
    ${pages[currentPage - 1].map((x, index) => {
            let okey = false
            let ramalcim = message.guild.members.cache.get(x.target)
            if(ramalcim && (ramalcim.user.username.includes(ayarlar.tag) || roller.Yetkiler.some(x => ramalcim.roles.cache.has(x)))) okey = true
            return `\` ${index+1} \` <@!${ramalcim ? ramalcim.id : x.target}> <t:${String(x.date).slice(0, 10)}:R> [**${x.type}** | ${okey ? message.guild.emojiGöster(emojiler.onay_munur) : message.guild.emojiGöster(emojiler.no_munur)}] `
          }).join("\n")}`)]
        }).catch(err => {});
        collector.resetTimer();
      });
      collector.on("end", () => {
        if(curPage) curPage.edit({
          embeds: [embed.setFooter(`${ayarlar.serverName ? ayarlar.serverName : message.guild.name}`, message.guild.iconURL({dynamic: true})).setDescription(`${ramalcim} isimli üyesinin toplamda \`${res.Checks.length || 0}\` adet tıklama bilgisi mevcut.`)],
          components: [],
        }).catch(err => {});
      })
    })
 }
};