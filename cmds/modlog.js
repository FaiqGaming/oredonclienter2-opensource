const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { prefix } = require('../config.json');
module.exports = {
  name: "modlog",
  aliases: ["logging"],
  guildOnly: true,
  description: "Setup logging channel for ban and kick and more.",
  usage: "o!modlog [status/setchannel]",
  async run(client, msg, args) {
    if (!msg.member.hasPermission("MANAGE_GUILD") && msg.author.id !== "297130271864520705") return msg.channel.send("You don't have permissions to executed this command!")
    if (!args[0]) {
      /* __\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\___ */
      let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Logging's help argument", client.user.displayAvatarURL())
        .setDescription(stripIndents`**${prefix}modlog status** [will be auto turned to on/off]
      **${prefix}modlog setchannel [mention channel]** [setup a channel for moderation send an embed]
      **${prefix}modlog reset** [reset the current modlog settings]
      
      **Example for use:**
      **${prefix}modlog status [will be turned to on/off]**
      **${prefix}modlog setchannel #mod-log**
      `)
      .setFooter('NOTE: Sorry for my rip english');
      return msg.channel.send(embed);
    } else if (args[0] == "status") {
      // Mengambil data status dari database
      let status = client.guild.get(`guild.${msg.guild.id}.logging.type`);
      // Jika status dari database tersebut tidak ada atau tidak aktif
      if (!status && status == false) {
        // Maka akan menyetel status tersebut diaktifkan dan akan dikirimkan message seperti ini
        msg.channel.send(
          "<:toggleon:534669824811466762> Successfully turned on logging status!"
        );
        client.guild.set(`guild.${msg.guild.id}.logging.type`, true);
        // Dan jika status dari database tersebut on / aktif
      } else {
        // Maka akan menyetel status tersebut dimatikan dan akan dikirimkan message seperti ini
        msg.channel.send(
          "<:toggleoff:534669799695843337> Successfully turned off logging status!"
        );
        client.guild.set(`guild.${msg.guild.id}.logging.type`, false);
      }
    } else if (args[0] == "setchannel" || args[0] == "setch") {
      // Mengambil data status dari database
      let channels = client.guild.get(
        `guild.${msg.guild.id}.logging.channelID`
      );
      // Membentuk variable channel dengan nilai ID
      let channel = msg.mentions.channels.first();
      // Jika player tersebut melupakan args channel maka akan dikirimkan message seperti ini
      if (!channel)
        return msg.channel.send("Please specify a channel to setup/switch!");
      // Jika player tersebut mengganti channel dengan channel yang sudah ada didalam database maka akan dikirim message seperti in
      if (channel.id == channels)
        return msg.channel.send("I can't switch to the same channel, Reason: you already switch a logging channel to this channel!");
      // Jika telah berhasil menyetel channel tersebut ke dalam database maka akan dikirimkan message seperti ini
      msg.channel.send(`Successfully setup / switch channel to ${channel}`);
      client.guild.set(`guild.${msg.guild.id}.logging.channelID`, channel.id);
    } else if (args[0] == "reset") {
      // Mengambil data logging untuk direset
      let data = client.guild.get(`guild.${msg.guild.id}.logging.channelID`);
      // Jika data logging tersebut belum direset alias sudah terkonfigurasi
      if (data) {
        // Maka akan direset dan dikirimkan message seperti ini
        return msg.channel.send("Successfully reset logging database!");
        client.guild.set(`guild.${msg.guild.id}.logging`, {
          type: false,
          channelID: null
        });
        // Jika data logging tersebut sudah direset dan kembali kesemula
      } else {
        // Maka akan dikirimkan message seperti ini
        return msg.channel.send(
          "I think, you already reset database or I think, your config is not currently setup"
        );
      }
    }
  }
};
