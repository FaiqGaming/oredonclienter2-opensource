const Discord = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Get user's image or bot's image",
  guildOnly: true,
  usage: "o!avatar [Name player]",
  async run(client, message, args) {
    let msg = await message.channel
      .send(`${await client.translate('Generating an avatar please wait...', message)}`)
      .then(async (m) => {

    let mentionedUser = message.mentions.users.first() || message.author;
    let embed = new Discord.MessageEmbed()
    if (!args[0]) {
      embed.setImage(mentionedUser.displayAvatarURL())
      embed.setColor("00ff00")
      embed.setTitle(`${await client.translate('Your Avatar', message)}`)
      embed.setFooter(`${await client.translate('Command was executed by:', message)} ${message.author.tag}`)
      embed.setDescription(`${await client.translate("[Avatar URL Link]", message)}` + "(" + message.author.displayAvatarURL() + ")");
    } else {
      embed.setImage(mentionedUser.displayAvatarURL())
      embed.setColor("00ff00")
      embed.setTitle(`${mentionedUser.tag} ${await client.translate(`'s avatar`, message)}`)
      embed.setFooter(`${await client.translate('Command was executed by:', message)} ${message.author.tag}`)
      embed.setDescription(`${await client.translate("[Avatar URL Link]", message)}` + "(" + mentionedUser.displayAvatarURL() + ")");
    }
    m.edit(embed);
    });
  }
};
