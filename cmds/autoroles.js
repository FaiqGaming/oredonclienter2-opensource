const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { prefix } = require("../config.json");

module.exports = {
  name: "autoroles",
  aliases: [],
  description: "Giving [name] roles if someone joined your own server!",
  guildOnly: true,
  usage: "o!autorolessssssssssssssssssssssssssssssssssssssssssssssx [status/set] [args]",
  async run(client, msg, args) {
    if (!msg.member.hasPermission("MANAGE_GUILD") && msg.author.id !== "297130271864520705") return msg.channel.send("You don't have permissions to executed this command!")
    if (!args[0]) {
      let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Autoroles's help argument", client.user.displayAvatarURL())
        .setDescription(stripIndents`**${prefix}autoroles status** [will be auto turned to on/off]
        **${prefix}autoroles set [mention roles]** [setup a roles for giving an member roles when he joined]
        **${prefix}autoroles reset** [reset the current autoroles settings]

        **Example for use:**
        **${prefix}autoroles status [will be turned to on/off]**
        **${prefix}autoroles set @User**
        `)
      .setFooter('NOTE: Sorry for my rip english');
      return msg.channel.send(embed);
    } else if (args[0] == "status") {
      let status = client.guild.get(`guild.${msg.guild.id}.autoroles.type`);
      if (!status && status == false) {
        msg.channel.send(
          "<:toggleon:534669824811466762> Successfully turned on autoroles status!"
        );
        client.guild.set(`guild.${msg.guild.id}.autoroles.type`, true);
      } else {
        msg.channel.send(
          "<:toggleoff:534669799695843337> Successfully turned off autoroles status!"
        );
        client.guild.set(`guild.${msg.guild.id}.autoroles.type`, false);
      }
    } else if (args[0] == "set") {
      let role = client.guild.get(`guild.${msg.guild.id}.autoroles.roleID`);

      let roles = msg.mentions.roles.first();

      if (!roles)
        return msg.channel.send("Please specify a roles to setup/switch!");

      if (roles.id == role)
        return msg.channel.send(
          "I can't switch to this Role, Reason: You can't switch to the same role!"
        );

      msg.channel.send(`Successfully setup / switch roles to ${roles}`);
      client.guild.set(`guild.${msg.guild.id}.autoroles.roleID`, roles.id);
    } else if (args[0] == "reset") {
      let data = client.guild.get(`guild.${msg.guild.id}.autoroles`)

      if (data.type === true && data.roleID) {
        msg.channel.send("Successfully reset autoroles database!")
        client.guild.set(`guild.${msg.guild.id}.autoroles`, {
          type: false,
          roleID: null
        });
      } else {
        msg.channel.send(
          "I think, you already reset database or I think, your config is not currently setup"
        )
      }
    }
  }
};
