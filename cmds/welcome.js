const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { prefix } = require('../config.json');

module.exports = {
  name: "welcome",
  aliases: ["welc"],
  description: "Setup an welcome if an member join he will send a message to a channel",
  usage: "o!welcome [status/setchannel/setmessage]",
  guildOnly: true,
  run(client, msg, args) {
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("You can't execute this command beacuse, insufficient permissions!")
    if (!args[0]) {
      let embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor("Welcome's help arguments", client.user.displayAvatarURL())
      .setDescription(stripIndents`**${prefix}welcome status** [will be auto turned to on/off]
      **${prefix}welcome setchannel [mention channel]** [setup a channel for welcome send an embed]
      **${prefix}welcome setmessage [args message]** [setup a message for send an welcome message to an configure channel]
      **${prefix}welcome reset** [reset the current welcome settings]
      
      **Example for use:**
      **${prefix}welcome status [will be turned to on/off]**
      **${prefix}welcome setmessage Welcome to my server {user} i hope you enjoy in this server**
      **${prefix}welcome setchannel #welcomer-channel**
      
      **Variable:**
      **{user}** Mention a user
      **{server}** Tag a server name
      **{membercount}** Tag a server's member count
      **{usertag}** Get a user's name with tag
      **{username}** Get a user's username
      `)
      .setFooter('NOTE: Sorry for my rip english');
      return msg.channel.send(embed);
    } else if (args[0] == "status") {
      // Mengambil data status dari database
      let status = client.guild.get(`guild.${msg.guild.id}.welcome.type`);
      // Jika status dari database tersebut tidak ada atau tidak aktif
      if (!status && status == false) {
        // Maka akan menyetel status tersebut diaktifkan dan akan dikirimkan message seperti ini
        msg.channel.send(
          "<:toggleon:534669824811466762> Successfully turned on welcome status!"
        );
        client.guild.set(`guild.${msg.guild.id}.welcome.type`, true);
        // Dan jika status dari database tersebut on / aktif
      } else {
        // Maka akan menyetel status tersebut dimatikan dan akan dikirimkan message seperti ini
        msg.channel.send(
          "<:toggleoff:534669799695843337> Successfully turned off welcome status!"
        );
        client.guild.set(`guild.${msg.guild.id}.welcome.type`, false);
      }
    } else if (args[0] == "setchannel" || args[0] == "setch") {
      // Mengambil data status dari database
      let channels = client.guild.get(
        `guild.${msg.guild.id}.welcome.channelID`
      );
      // Membentuk variable channel dengan nilai ID
      let channel = msg.mentions.channels.first();
      // Jika player tersebut melupakan args channel maka akan dikirimkan message seperti ini
      if (!channel)
        return msg.channel.send("Please specify a channel to setup/switch!");
      // Jika player tersebut mengganti channel dengan channel yang sudah ada didalam database maka akan dikirim message seperti in
      if (channel.id == channels)
        return msg.channel.send("I can't switch to the same channel, Reason: you already switch a welcome channel to this channel!");
      // Jika telah berhasil menyetel channel tersebut ke dalam database maka akan dikirimkan message seperti ini
      msg.channel.send(`Successfully setup / switch channel to ${channel}`);
      client.guild.set(`guild.${msg.guild.id}.welcome.channelID`, channel.id);
    } else if(args[0] == "setmessage") {
      // Mengambil data message dari database
      let welcomeMessage = client.guild.get(`guild.${msg.guild.id}.welcome.welcomeMessage`)
      // Mengambil data args yang telah di berikan user
      let someone = `${args.slice(1).join(' ')}`
      // Jika user belum memberikan args maka akan dikirim kan message seperti ini
      if (!someone) return msg.channel.send('Please specify a message.')
      // Jika user memberikan args yang sama yg sudah ada didalam database maka akan dikirim kan message seperti in
      if (someone == welcomeMessage) return msg.channel.send(`I can't set welcome message, Reason: you can't change welcome message with same argument`)
      // Jika user telah memberikan args maka akan dikirim kan message seperti ini
      msg.channel.send(`**Succesfully set welcome message to:** \n${someone}`)
      client.guild.set(`guild.${msg.guild.id}.welcome.welcomeMessage`, someone)
    } else if (args[0] == "reset") {
      // Mengambil data welcome untuk direset
      let data = client.guild.get(`guild.${msg.guild.id}.welcome.channelID`);
      // Jika data welcome tersebut belum direset alias sudah terkonfigurasi
      if (data) {
        // Maka akan direset dan dikirimkan message seperti ini
        return msg.channel.send("Successfully reset welcome database!");
        client.guild.set(`guild.${msg.guild.id}.welcome`, {
          type: false,
          channelID: null,
          welcomeMessage: null
        });
        // Jika data welcome tersebut sudah direset dan kembali kesemula
      } else {
        // Maka akan dikirimkan message seperti ini
        return msg.channel.send(
          "I think, you already reset database or I think, your config is not currently setup"
        );
      }
    }
  }
}