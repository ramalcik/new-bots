const { MessageEmbed } = require("discord.js");
const Stats = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../_SYSTEM/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../_SYSTEM/Databases/Schemas/Plugins/Client.Users.Staffs');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "voicedenetim",
    Komut: ["sesdenetim","rolstatdenetim"],
    Kullanim: "sesdenetim <@rol/ID>",
    Aciklama: "Belirlenen role sahip üyelerin public, register ve genel ses denetimini sağlar.",
    Kategori: "stat",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!rol) return message.reply({content: `${cevaplar.prefix} Denetleyebilmem için lütfen bir rol belirtiniz.`, ephemeral: true })
    if (rol.members.size === 0) return message.reply({content: `${cevaplar.prefix} Belirtilen rolde üye bulunamadığından işlem iptal edildi.`, ephemeral: true }),message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined)
    let Sesdenetim =  await Stats.find({guildID: message.guild.id});
    Sesdenetim = Sesdenetim.filter(s => message.guild.members.cache.has(s.userID) && message.guild.members.cache.get(s.userID).roles.cache.has(rol.id));
    let PublicListele = Sesdenetim.sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam = 0;
        ramalcim2.voiceStats.forEach((x, key) => {
            if(key == kanallar.publicKategorisi) ramalcim2Toplam += x
        });
        let ramalcim1Toplam = 0;
        ramalcim1.voiceStats.forEach((x, key) => {
            if(key == kanallar.publicKategorisi) ramalcim1Toplam += x
        });
        return ramalcim2Toplam-ramalcim1Toplam;
    }).slice(0, 15).map((m, index) => {
        let ramalcimToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.publicKategorisi) ramalcimToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(ramalcimToplam)}\``;
    }).join('\n');
    
    let StreamerListele = Sesdenetim.sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam = 0;
        ramalcim2.voiceStats.forEach((x, key) => {
            if(key == kanallar.streamerKategorisi) ramalcim2Toplam += x
        });
        let ramalcim1Toplam = 0;
        ramalcim1.voiceStats.forEach((x, key) => {
            if(key == kanallar.streamerKategorisi) ramalcim1Toplam += x
        });
        return ramalcim2Toplam-ramalcim1Toplam;
    }).slice(0, 15).map((m, index) => {
        let ramalcimToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.streamerKategorisi) ramalcimToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(ramalcimToplam)}\``;
    }).join('\n');

    let RegisterListele = Sesdenetim.sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam = 0;
        ramalcim2.voiceStats.forEach((x, key) => {
            if(key == kanallar.registerKategorisi) ramalcim2Toplam += x
        });
        let ramalcim1Toplam = 0;
        ramalcim1.voiceStats.forEach((x, key) => {
            if(key == kanallar.registerKategorisi) ramalcim1Toplam += x
        });
        return ramalcim2Toplam-ramalcim1Toplam;
    }).slice(0, 15).map((m, index) => {
        let ramalcimToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.registerKategorisi) ramalcimToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(ramalcimToplam)}\``;
    }).join('\n');

    let SesListele = Sesdenetim.sort((ramalcim1, ramalcim2) => {
        let ramalcim2Toplam = 0;
        ramalcim2.voiceStats.forEach(x => ramalcim2Toplam += x);
        let ramalcim1Toplam = 0;
        ramalcim1.voiceStats.forEach(x => ramalcim1Toplam += x);
        return ramalcim2Toplam-ramalcim1Toplam;
    }).slice(0, 15).map((m, index) => {
        let ramalcimToplam = 0;
        m.voiceStats.forEach(x => ramalcimToplam += x);
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(ramalcimToplam)}\``;
    }).join('\n');


    await message.channel.send({embeds: [embed.setDescription(`${rol} (\`${rol.id}\`) rolüne sahip ilk 15 üyenin ses bilgileri aşağıda listelenmekte.`)
    .addFields(
        {name: "Toplam Sıralama", value: SesListele ? SesListele : "Veri Bulunamadı.", inline: true},
        {name: "Public Sıralaması", value: PublicListele ? PublicListele : "Veri Bulunamadı.", inline: true},
        {name: "Register Sıralaması", value: RegisterListele ? RegisterListele : "Veri Bulunamadı.", inline: true},
        {name: "Streamer Sıralaması", value: StreamerListele ? StreamerListele : "Veri Bulunamadı.", inline: false}
    )]})
  }
};