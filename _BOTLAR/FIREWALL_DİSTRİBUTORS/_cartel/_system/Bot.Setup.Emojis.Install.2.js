const { Client, Message} = require("discord.js");

module.exports = {
    Isim: "emojikur2",
    Komut: ["emkur2"],
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

        { name: "maviDegnek", url: "https://cdn.discordapp.com/emojis/843809647675834398.gif"},
        { name: "sariYildiz", url: "https://cdn.discordapp.com/emojis/909164076570116167.gif?size=44"},

            // UpStaff
        { name: "baslangicBar", url: "https://cdn.discordapp.com/emojis/1056636223977959494.png" },
        { name: "baslamaBar", url: "https://cdn.discordapp.com/emojis/1056980594707402782.png" },
        { name: "doluBar", url: "https://cdn.discordapp.com/emojis/1056980428499722270.png" },
        { name: "doluBitisBar", url: "https://cdn.discordapp.com/emojis/1056980464788840628.png" },
        { name: "bosBar", url: "https://cdn.discordapp.com/emojis/1056279090904178738.png" },
        { name: "bosBitisBar", url: "https://cdn.discordapp.com/emojis/988437379121557514.png" },
        { name: "icon", url: "https://cdn.discordapp.com/emojis/1056279166590394408.png" },
        { name: "miniicon", url: "https://cdn.discordapp.com/emojis/1056279166590394408.png" },

            // Task
        { name: "tamamlandi", url: "https://cdn.discordapp.com/emojis/844119157720481814.png" },
        { name: "sandik", url: "https://cdn.discordapp.com/emojis/844119157720481813.png" },
        { name: "para", url: "https://cdn.discordapp.com/emojis/844119157880258590.gif" },
        { name: "xp", url: "https://cdn.discordapp.com/emojis/844119157943042059.gif" },
        { name: "chating", url: "https://cdn.discordapp.com/emojis/844119158069526548.gif" },
        { name: "talking", url: "https://cdn.discordapp.com/emojis/844119158223536138.gif" },
        { name: "777", url: "https://cdn.discordapp.com/emojis/844120308897677342.gif" },
        { name: "kekcookie", url: "https://cdn.discordapp.com/emojis/844121947515519016.gif" },    
        { name: "staff", url: "https://cdn.discordapp.com/emojis/848592182985752636.gif" },   
        { name: "gift", url: "https://cdn.discordapp.com/emojis/826564060807299082.gif" },
        { name: "tagged", url: "https://cdn.discordapp.com/emojis/842563648597131304.gif"},
        { name: "sandikodul", url: "https://cdn.discordapp.com/emojis/907344860485386290.gif?size=96"},
        { name: "munur_patlican", url: "https://static.wikia.nocookie.net/owobot/images/5/56/SlotsEggplant.png/revision/latest/scale-to-width-down/18?cb=20201231080844"},
        { name: "munur_heart", url: "https://static.wikia.nocookie.net/owobot/images/b/bb/SlotsHeart.png/revision/latest/scale-to-width-down/18?cb=20201231081114"},
        { name: "munur_visne", url: "https://static.wikia.nocookie.net/owobot/images/8/80/SlotsCherry.png/revision/latest/scale-to-width-down/20?cb=20201231081252"},
        { name: "munur_slot", url: "https://static.wikia.nocookie.net/owobot/images/f/f3/SlotsRolling.gif/revision/latest/scale-to-width-down/18?cb=20201231075644"},
        { name: "munur_cf", url: "https://cdn.discordapp.com/emojis/932325559051096084.gif?size=44&quality=lossless"},
        { name: "munur_cfwin", url: "https://cdn.discordapp.com/emojis/932326782223417455.png"},
        { name: "munur_cflose", url: "https://cdn.discordapp.com/emojis/932328417196671026.webp?size=44&quality=lossless"},
      ];
  
      const numEmojis = [
        { name: "sifir", url: "https://cdn.discordapp.com/emojis/804121295875866645.gif?size=96" },
        { name: "bir", url: "https://cdn.discordapp.com/emojis/804121340818096158.gif?size=96" },
        { name: "iki", url: "https://cdn.discordapp.com/emojis/804121379183656990.gif?size=96" },
        { name: "uc", url: "https://cdn.discordapp.com/emojis/804121470997495828.gif?size=96" },
        { name: "dort", url: "https://cdn.discordapp.com/emojis/804122294644506634.gif?size=96" },
        { name: "bes", url: "https://cdn.discordapp.com/emojis/804122311732625409.gif?size=96" },
        { name: "alti", url: "https://cdn.discordapp.com/emojis/804122334117101599.gif?size=96" },
        { name: "yedi", url: "https://cdn.discordapp.com/emojis/804122378929176586.gif?size=96" },
        { name: "sekiz", url: "https://cdn.discordapp.com/emojis/804122401956560906.gif?size=96" },
        { name: "dokuz", url: "https://cdn.discordapp.com/emojis/804122434068414474.gif?size=96" }
      ];
  
      emojis.forEach(async (x) => {
        if (message.guild.emojis.cache.find((e) => x.name === e.name)) return;
        const emoji = await message.guild.emojis.create(x.url, x.name);
        message.channel.send(`\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`);
      });

    }
};