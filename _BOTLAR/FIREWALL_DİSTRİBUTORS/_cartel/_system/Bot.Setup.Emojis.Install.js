const { Client, Message} = require("discord.js");

module.exports = {
    Isim: "emojikur",
    Komut: ["emkur"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
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
    const emojis = [

            // Penal & Require
        { name: "Onay", url: "https://cdn.discordapp.com/emojis/1075102681863028866.png" },
        { name: "Iptal", url: "https://cdn.discordapp.com/emojis/1075102617014902895.png" },
        { name: "serverTag", url: "https://cdn.discordapp.com/emojis/817508161895792670.gif" },
        { name: "Yasaklandi", url: "https://cdn.discordapp.com/emojis/817508162454159382.gif" },
		    { name: "chatMute", url: "https://cdn.discordapp.com/attachments/907041238639861763/907559377853104128/chatMute.png"},
		    { name: "unChatMute", url: "https://cdn.discordapp.com/attachments/907041238639861763/907559378792624158/unChatMute.png"},
        { name: "voiceMute", url: "https://cdn.discordapp.com/attachments/907041238639861763/907559381183365140/voiceMute.png" },
        { name: "Cezalandirildi", url: "https://cdn.discordapp.com/emojis/817508161447264267.png" },
        { name: "unVoiceMute", url: "https://cdn.discordapp.com/attachments/907041238639861763/907559382374551592/unVoiceMute.png" },
        { name: "erkek", url: "https://cdn.discordapp.com/emojis/842526029913260082.gif" },
        { name: "kadin", url: "https://cdn.discordapp.com/emojis/842526029184237568.gif" },
        { name: "cartelim", url: "https://cdn.discordapp.com/emojis/842526025216688158.png" },
        { name: "HosgeldinGif1", url: "https://cdn.discordapp.com/emojis/817338444635308042.gif" },
        { name: "HosgeldinGif2", url: "https://cdn.discordapp.com/emojis/817343543228104705.gif" },
        { name: "KonfetiGif", url: "https://cdn.discordapp.com/emojis/840597070812413962.gif"},
        { name: "Gold", url: "https://cdn.discordapp.com/emojis/838240527862333460.gif"},
        { name: "münür", url: "https://cdn.discordapp.com/emojis/841032678266241054.gif"},
        { name: "rubyBit", url: "https://cdn.discordapp.com/emojis/780808227192963094.gif"},
        { name: "emeraldBit", url: "https://cdn.discordapp.com/emojis/780808253017686037.gif"},
        { name: "voiceDeaf", url: "https://cdn.discordapp.com/emojis/911967815651700796.png?size=44"},
        { name: "boostluNitro", url: "https://cdn.discordapp.com/emojis/1053668151537176626.png"},
        { name: "klasikNitro", url: "https://cdn.discordapp.com/emojis/1056279152732409976.gif"},
        { name: "exxen", url: "https://cdn.discordapp.com/emojis/899301271985602600.png?size=44"},
        { name: "spotify", url: "https://cdn.discordapp.com/emojis/1053668141672173642.png"},
        { name: "netflix", url: "https://cdn.discordapp.com/emojis/1066419991924178984.png"},
        { name: "youtube", url: "https://cdn.discordapp.com/emojis/972311869840842792.png"},
        { name: "bluetv", url: "https://cdn.discordapp.com/emojis/907344822187229234.png?size=96"},
        

    ];

  
      emojis.forEach(async (x) => {
        if (message.guild.emojis.cache.find((e) => x.name === e.name)) return;
        const emoji = await message.guild.emojis.create(x.url, x.name);
        message.channel.send(`\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`);
      });

    }
};