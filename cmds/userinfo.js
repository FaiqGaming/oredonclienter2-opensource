const Discord = require("discord.js");
const { format } = require('../function');

const statusAnimation = {
  online: `<a:AnimatedOnline:597740720060760064>`,
  idle: `<a:AnimatedIdle:597740720023011348>`,
  streaming: `<a:AnimatedStream:597740720073342991>`,
  dnd: `<a:AnimatedDND:597740719511437312>`,
  invisible: `<a:AnimatedOffline:597740719117041667>`,
  offline: `<a:AnimatedOffline:597740719117041667>`
};

const colorMap = {
  online: "#00FF00",
  idle: "#FF8000",
  streaming: "#A901DB",
  dnd: "#FF0000",
  invisible: "#848484",
  offline: "#848484"
};

const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};

const statusText = {
  online: "Online",
  idle: "Idle",
  streaming: "Streaming",
  dnd: "Do Not Disturb",
  invsible: "Invisible",
  offline: "Offline"
};

const isBot = {
  true: "Bot Users",
  false: "Human Users"
};

module.exports = {
  name: "userinfo",
  usage: "o!userinfo [user]",
  aliases: ["ui"],
  guildOnly: true,
  description: "Get your information or member's information",
  async run(client, message, args) {
    let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      user = message.author;
    }
    
    // Define the member of a guild.
    const member = message.guild.member(user);
    const userFlags = user.flags.toArray();
    let embed = new Discord.MessageEmbed()
      .setAuthor(`${user.tag}'s Information`, user.displayAvatarURL({ dynamic: true, format: "png" }))
      .setColor("RANDOM")
      .setThumbnail(user.displayAvatarURL({ dynamic: true, format: "png" }))
      .addField("ID", `${user.id}`, true)
      .addField("Username", `${user.username}`, true)
      .addField("Discriminator", `#${user.discriminator}`, true)
      .addField(
        "Nickname",
        `${member.nickname ? "" + member.nickname + "" : "None"}`,
        true
      )
      .addField(
        "Registered", format(user.createdAt).format('llll'), true)
      .addField(
        "Joined", format(member.joinedAt).format('llll'), true)
      .addField(
        "Status",
        statusAnimation[user.presence.status] +
          " " +
          statusText[user.presence.status],
        true
      )
      .addField("Member Type", isBot[user.bot], true)
      .addField("Flags", `${userFlags.length ? userFlags.map((flag) => flags[flag]).join(' ') : 'None'}`, true)
      .setColor(colorMap[user.presence.status])
      .setFooter(
        `Requested By: ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true, format: "png" })
      );
    message.channel.send(embed);
  }
};
