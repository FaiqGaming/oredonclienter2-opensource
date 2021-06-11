const { prefix } = require("../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  aliases: ["commands", "h"],
  usage: "[command name]",
  cooldown: 5,
  guildOnly: true,
  run(client, msg, args) {
    //const client = msg.client;
    const data = [];
    const { commands } = client;

    if (!args.length) {
      let helpembed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("**Oredon Clienter's list command**")
        .setAuthor(`My prefix is ${prefix}`, client.user.displayAvatarURL())
        .addField("⚒ Utility", "**Afk, Stats, Serverinfo, Serverroles, Serveremoji, Userinfo, Docs, Ping, Avatar**")
        .addField(
          "<a:musicnote2:772331380226261033> Music",
          "**Play, Queue, Stop, Skip, Np, Filters, Loop, Volume, Lyrics, Pause, Resume**"
        )
        .addField("🔒 Moderation", "**Modlog, Ban, Kick, Purge, Badword, Welcome, Goodbye, Autoroles**")
        .setImage("https://media.discordapp.net/attachments/846491056111747092/847582616878055424/standard_2.gif")
        //       .addField("💸 Economy", '**Bank, Daily, Fish, Inventory, Level, Market, Mine Pay, Pickaxe, Profile, Rep, Repair, Sell, Work**')
        //       .addField("🏁 Fun", '**Cat, Dog, Achievement, Slots, 8Ball**')
        //       .addField("🔞 NSFW", '**Hentai, NewdNeko**')
        .setFooter(
          `You can send \`${prefix}help [command name]\` to get info on a specific command!`
        );
      data.push(helpembed);

      return msg.channel.send(data, { split: true }) /*author
        .send(data, { split: true })
        .then(() => {
          if (msg.channel.type === "dm") return;
          msg.reply("I've sent you a DM with all my commands!");
        })
        .catch(error => {
          console.error(
            `Could not send help DM to ${msg.author.tag}.\n`,
            error
          );
          msg.reply("it seems like I can't DM you! Do you have DMs disabled?");
        });*/
    }
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return msg.reply(`Command not found!, do ${prefix}help for get an list commands.`);
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    if (command.description)
      data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Usage:** ${command.usage}`);
    if (command.cooldown == 0) command.cooldown = "No cooldown";
    else command.cooldown = `${command.cooldown || 5} second(s)`;
    data.push(`**Cooldown:** ${command.cooldown}`);

    msg.channel.send(data, { split: true });
  }
};
