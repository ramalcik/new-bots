const { Client, Message, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
module.exports = {
    Isim: "banner",
    Komut: ["arkaplan", "arkap" ],
    Kullanim: "banner <@munur/ID>",
    Aciklama: "Belirtilen üyenin arka plan resmini büyültür.",
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
    let embed = new cartelinEmbedi()
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.api.users[args[0]].get()
    if(victim.user) {
      victim = {
        id: victim.id,
        username: victim.user.username,
        discriminator: victim.user.discriminator,
        avatar: victim.avatar
      }
    }
    const bannerHash = (await client.api.users[victim.id].get()).banner;
    if(!bannerHash) return message.channel.send(`${cevaplar.prefix} Belirtilen Üyenin Arkaplanı Bulunmadı!`)
    const banner = !bannerHash ? `https://images-ext-2.discordapp.net/external/-OXbEcwb-h30h0TQmUM7xCOemMmn4lZeJtZMpSgWMtg/%3Fsize%3D4096/https/cdn.discordapp.com/banners/852681367853465610/a_364822477a2e994552905134288a64b2.gif` : `https://cdn.discordapp.com/banners/${
      victim.id
    }/${bannerHash}${bannerHash.startsWith("a_") ? ".gif" : ".png"}?size=4096`; 
    let avatar;
    if(victim.user ) {
      avatar = victim.user.avatarURL({dynamic: true})
    } else {
      avatar = `https://cdn.discordapp.com/avatars/${args[0]}/${victim.avatar}.png?size=2048`
    }
    embed
        .setAuthor(`${victim.username}#${victim.discriminator}`, avatar)
        .setImage(banner)
      let urlButton = new MessageButton()
    .setURL(`${banner}`)
    .setLabel(`Resim Adresi`)
    .setStyle('LINK')    
    let urlOptions = new MessageActionRow().addComponents(
        urlButton
    );
    let ramalcim = message.guild.members.cache.get(victim.id)
    if(ramalcim) ramalcim._views()
    message.reply({embeds: [embed], components: [urlOptions]});
    }
};