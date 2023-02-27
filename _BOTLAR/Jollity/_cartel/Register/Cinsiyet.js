const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const Punitives = require('../../../../_SYSTEM/Databases/Schemas/Global.Punitives');
const {cartelinEmbedi} = require('../../../../_SYSTEM/Reference/Embed');
module.exports = {
    Isim: "cinsiyet",
    Komut: ["cinsiyet","cindeğiş"],
    Kullanim: "cinsiyet @munur/ID",
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
    let regPanelEmbed = new cartelinEmbedi();
    let ramalcim = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.yetersiz).catch(err => {})
    if(!ramalcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === ramalcim.id) return message.reply(cevaplar.kendi).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(ramalcim.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ramalcim.manageable) return message.reply(cevaplar.dokunulmaz).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    if(message.member.roles.highest.position <= ramalcim.roles.highest.position) return message.reply(cevaplar.yetkiust).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    const genderSelect = new MessageActionRow().addComponents(
				new MessageButton()
	                .setCustomId('erkekyaxd')
	                .setLabel('Erkek')
	                .setStyle('SECONDARY')
                    .setEmoji(message.guild.emojiGöster(emojiler.erkekTepkiID)),
                new MessageButton()
	                .setCustomId('lesbienaq')
	                .setLabel('Kadın')
	                .setStyle('SECONDARY')
                    .setEmoji(message.guild.emojiGöster(emojiler.kadınTepkiID)),
                new MessageButton()
	                .setCustomId('iptal')
	                .setLabel('İptal')
	                .setStyle('DANGER')
                    .setEmoji(message.guild.emojiGöster(emojiler.no_munur))
			);
            const filter = i => i.user.id === message.member.id;
            let regPanel = await message.reply({embeds: [regPanelEmbed
            
                .setDescription(`Aşağıda ${ramalcim} isimli üyenin cinsiyetini değiştirmek için düğmeler verilmiştir.
Tekrardan ses teyiti alarak kontrol etmenizi öneririz. Çünkü ses teyiti alırken ses teyiti alınacak üyenin cinsiyeti değişecektir.`)
            ], components: [genderSelect], ephemeral: true} )
            const collector = regPanel.createMessageComponentCollector({ filter, time: 15000 });
            let isimveri = await Users.findById(ramalcim.id) || []
        let isimler = isimveri.Name || `${ramalcim.displayName ? ramalcim.displayName : ramalcim.user.username}`
collector.on('collect', async i => {
	if (i.customId === 'erkekyaxd') {
        await regPanel.edit({ embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim} isimli üye **Erkek** olarak cinsiyet değiştirildi.`)], components: [] }).then(x => {
            setTimeout(() => {
                x.delete()
            }, 10000);
        })
        await ramalcim.roles.remove(roller.kadınRolleri)
        await ramalcim.roles.add(roller.erkekRolleri)
        await Users.updateOne({_id: ramalcim.id}, { $push: { "Names": {Staff: message.member.id, Name: isimler, State: `Cinsiyet Değiştirme) (${roller.erkekRolleri.map(x => ramalcim.guild.roles.cache.get(x)).join(",")}`, Date: Date.now() }}}, {upsert: true})
		message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
	}
    if (i.customId === 'lesbienaq') {
        await regPanel.edit({ embeds: [new cartelinEmbedi().setDescription(`${message.guild.emojiGöster(emojiler.onay_munur)} Başarıyla ${ramalcim} isimli üye **Kadın** olarak cinsiyet değiştirildi.`)], components: [] }).then(x => {
            setTimeout(() => {
                x.delete()
            }, 10000);
        })
        await ramalcim.roles.add(roller.kadınRolleri)
        await ramalcim.roles.remove(roller.erkekRolleri)
        await Users.updateOne({_id: ramalcim.id}, { $push: { "Names": {Staff: message.member.id, Name: isimler, State: `Cinsiyet Değiştirme) (${roller.kadınRolleri.map(x => ramalcim.guild.roles.cache.get(x)).join(",")}`, Date: Date.now() }}}, {upsert: true})
        
		message.react(message.guild.emojiGöster(emojiler.onay_munur) ? message.guild.emojiGöster(emojiler.onay_munur).id : undefined)
	}
    if (i.customId === 'iptal') {
        await i.deferUpdate();
        regPanel.delete().catch(err => {})
		message.react(message.guild.emojiGöster(emojiler.no_munur) ? message.guild.emojiGöster(emojiler.no_munur).id : undefined).catch(err => {})
        
	}
});
collector.on('end', collected => {});
    }
};

