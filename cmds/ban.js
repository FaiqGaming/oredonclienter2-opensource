const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../function.js");

module.exports = {
  name: "ban",
  aliases: ["banned", "hammer"],
  guildOnly: true,
  description: "Ban users from the server with a reason or non reason",
  usage: "o!ban [user] [reason]",
  async run(client, msg, args) {
    let channel = client.guild.get(`guild.${msg.guild.id}.logging.channelID`);
    let status = client.guild.get(`guild.${msg.guild.id}.logging.type`);
    if (!msg.member.hasPermission("BAN_MEMBERS"))
      return msg.channel.send(
        "You can't execute this command beacuse, insufficient permissions!"
      );
    if (!msg.guild.me.hasPermission("BAN_MEMBERS"))
      return msg.channel.send(
        "I don't have permission to ban a members, please contact your Staff members!"
      );
    let user =
      msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason, I guess";
    if (!status && status == false)
      return msg.channel.send(
        "Please turning on logging status, because logging status currently is off"
      );
    if (!channel)
      return msg.channel.send(
        "Please setup a logging channel, currently is not setup"
      );

    if (!user) {
      return msg.channel
        .send("Please specify users to ban!")
        .then(c => c.delete({ timeout: 5000 }));
    }
    
    if (msg.author.id === user.id)
      return msg.channel
        .send("You can't ban yourself! try again")
        .then(c => c.delete({ timeout: 5000 }));
    if (!user.bannable) {
      return msg.channel
        .send("I can't ban that user because of his higher role, I suppose")
        .then(c => c.delete({ timeout: 5000 }));
    }
    let channels = msg.guild.channels.cache.get(channel);
    let embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(msg.member.displayName, msg.member.user.displayAvatarURL())
      .setTimestamp()
      .setDescription(stripIndents`**> Banned members:** ${user} (${user.id})
    **> Banned by:** ${msg.author} (${msg.author.id})
    **> Reason:** ${reason}`);
    user.ban().catch(err => {
      if (err) return console.log(err);
      if (err) return msg.channel.send("Something went wrong?");
    });
    msg.channel.send(`Successfully ban ${user.user.tag}, check the moderation logs!`)
    channels.send(embed);
  }
};
