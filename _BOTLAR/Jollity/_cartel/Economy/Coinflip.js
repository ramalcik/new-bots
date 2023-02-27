const { Client, Message, MessageEmbed, MessageAttachment} = require("discord.js");
const moment = require("moment");
const { cartelinEmbedi } = require("../../../../_SYSTEM/Reference/Embed");
require("moment-duration-format");
require("moment-timezone");
// ../../_BASE/
module.exports = {
    Isim: "coinflip",
    Komut: ["cf", "bahis"],
    Kullanim: "coinflip <100-500000-all>",
    Aciklama: "",
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
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    
    }
};

