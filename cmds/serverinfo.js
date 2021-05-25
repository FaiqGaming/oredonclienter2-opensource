const Discord = require("discord.js");
const ColorMap = {
  online: "#00FF00",
  idle: "#FF8000",
  streaming: "#A901DB",
  dnd: "#FF0000",
  offline: "#848484"
};
const ngebot = {
  true: "Bot User",
  false: "Regular User"
};
const statusAnimation = {
  online: `<a:AnimatedOnline:597740720060760064>`,
  idle: `<a:AnimatedIdle:597740720023011348>`,
  streaming: `<a:AnimatedStream:597740720073342991>`,
  dnd: `<a:AnimatedDND:597740719511437312>`,
  invisible: `<a:AnimatedOffline:597740719117041667>`
};

const StatusText = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
  streaming: "Streaming"
};
const verlev = {
  "NONE": "None",
  "LOW": "Low",
  "MEDIUM": "Medium",
  "HIGH": "High",
  "VERY_HIGH": "Very High"
};

const servico = {
  singapore: ":flag_sg: Singapore",
  brazil: ":flag_br: Brazil",
  "eu-central": ":flag_eu: Central Europe",
  hongkong: ":flag_hk: Hong Kong",
  japan: ":flag_jp: Japan",
  russia: ":flag_ru: Russia",
  southafrica: ":flag_za: South Africa",
  sydney: ":flag_au: Sydney, Australia",
  "us-central": ":flag_us: US Central",
  "us-east": ":flag_us: US East",
  "us-south": ":flag_us: US South",
  "us-west": ":flag_us: US West",
  "eu-west": ":flag_eu: Western Europe"
};

module.exports = {
  name: "serverinfo",
  aliases: ["guildinfo", "gi", "si"],
  description: "Getting information of your server",
  usage: "o!serverinfo (will be checked by system)",
  guildOnly: true,
  run(client, message, args) {
    let embed = new Discord.MessageEmbed()
      .setAuthor(
        `${message.guild.name}`,
        `${message.guild.iconURL() ? message.guild.iconURL() : ""}`
      )
      .setDescription("Here is the server information: ")
      .setThumbnail(`${message.guild.iconURL() ? message.guild.iconURL() : ""}`)
      .addField("Server Name: ", message.guild.name, true)
      .addField("Server ID: ", message.guild.id, true)
      .addField(
        "Server Owner: ",
        `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`,
        true
      )
      .addField("Server Region: ", servico[`${message.guild.region}`], true)
      .addField(
        "Members: ",
        `**${message.guild.memberCount}** Users \n**${message.guild
          .memberCount -
          message.guild.members.cache.filter(mb => mb.user.bot).size}** Humans \n**${
          message.guild.members.cache.filter(mb => mb.user.bot === true).size
        }** Bots \n**${
          message.guild.members.cache.filter(
            members => members.presence.status == "online"
          ).size
        }** ${statusAnimation.online} Online \n**${
          message.guild.members.cache.filter(
            members => members.presence.status == "idle"
          ).size
        }** ${statusAnimation.idle} Idle \n**${
          message.guild.members.cache.filter(
            members => members.presence.status == "dnd"
          ).size
        }** ${
          statusAnimation.dnd
        } Do Not Disturb \n**${message.guild.members.cache.filter(
          members => members.presence.status == "offline"
        ).size ||
          message.guild.members.cache.filter(
            members => members.presence.status == "invisible"
          ).size}** ${statusAnimation.invisible} Offline`,
        true
      )
      .addField(
        "Channels: ",
        `**${
          message.guild.channels.cache.filter(x => x.type == "text").size
        }** Text \n**${
          message.guild.channels.cache.filter(x => x.type == "voice").size
        }** Voice \n**${
          message.guild.channels.cache.filter(x => x.type == "category").size
        }** Category`,
        true
      )
      .addField("Server Roles: ", `${message.guild.roles.cache.size} (see more information) type o!serverroles`, true)
      .addField("Server Emojis: ", `${message.guild.emojis.cache.size} (see more information) type o!serveremoji`, true)
      .addField(
        "Verification Level: ",
        verlev[`${message.guild.verificationLevel}`],
        true
      )
      .addField(
        "Server Created: ",
        new Date(message.guild.createdAt)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        true
      )
      .setColor("#FFD800");
    message.channel.send(embed);
  }
};