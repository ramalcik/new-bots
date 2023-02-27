const { Client, Message, MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const Canvas = require('canvas')
Canvas.registerFont(`../../_BASE/fonts/theboldfont.ttf`, { family: "Bold" });
Canvas.registerFont(`../../_BASE/fonts/SketchMatch.ttf`, { family: "SketchMatch" });
Canvas.registerFont(`../../_BASE/fonts/LuckiestGuy-Regular.ttf`, { family: "luckiest guy" });
Canvas.registerFont(`../../_BASE/fonts/KeepCalm-Medium.ttf`, { family: "KeepCalm" });
const Users = require('../../../../_SYSTEM/Databases/Schemas/Client.Users');
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
let cooldown = new Map()
module.exports = {
    Isim: "ship",
    Komut: ["shippe","love","sanal8"],
    Kullanim: "ship @munur/ID",
    Aciklama: "Bir üyenin coin bilgisini görüntüler.",
    Kategori: "eco",
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
      
    }
};

