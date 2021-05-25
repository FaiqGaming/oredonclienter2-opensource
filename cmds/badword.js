const { Discord, MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { prefix } = require("../config.json");

module.exports = {
  name: "badword",
  description: "For add an blacklist word to this server",
  guildOnly: true,
  usage: "o!badword",
  async run(client, msg, args) {
    if (
        !msg.member.hasPermission("MANAGE_MESSAGES") &&
        msg.author.id !== "297130271864520705"
    ) return msg.channel.send("You don't have permission!");
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(
          "Anti badword's help arguments",
          client.user.displayAvatarURL()
        )
        .setDescription(
          stripIndents`**${prefix}badword status** [will be auto turned to on/off]
      **${prefix}badword add/remove [args]** [blacklist or unblacklist an blacklisting word]
      **${prefix}badword list** [showing the current blacklist word]

      **Example for use:**
      **${prefix}badword status [will be turned to on/off]**
      **${prefix}badword add/remove [args]**
      **${prefix}badword list [for get all of the current blacklist word]**
      `
        )
        .setFooter("NOTE: Sorry for my rip english");
      return msg.channel.send(embed);
    } else if (args[0] == "list") {
      let wording = client.guild.get(`guild.${msg.guild.id}.badword.word`);
      let embeds = new MessageEmbed().setColor("RANDOM");
      //let wording = [];
      if (!wording || wording == [] || wording.length < 1) {
        return msg.channel.send({
          embed: {
            description: "**No any blacklist word, from this server!**"
          }
        });
      }
      if (wording.length > 5) {
        let index = 0;
        wording = wording.map(
          (x, i) => `${i + 1}. \`${x}\` **A blacklist word**`
        );
        wording = chunk(wording, 5);
        embeds.setAuthor(
          "Anti Badword's list blacklist word",
          msg.author.displayAvatarURL()
        );
        console.log(wording)
        embeds.setDescription(wording[index].join("\n"));
        embeds.setFooter(
          `Blacklist Word | Page ${index + 1} of ${wording.length}`, msg.guild.iconURL()
        );
        const queuesMess = await msg.channel.send({ embed: embeds });
        await queuesMess.react("⬅");
        await queuesMess.react("🔴");
        await queuesMess.react("➡");
        awaitReactions();
        function awaitReactions() {
          const filter = (rect, usr) =>
            ["⬅", "➡"].includes(rect.emoji.name) && usr.id === msg.author.id;
          queuesMess
            .createReactionCollector(filter, { time: 30000, max: 1 })
            .on("collect", col => {
              if (col.emoji.name === "🔴") return queuesMess.delete();
              if (col.emoji.name === "⬅") index--;
              if (col.emoji.name === "➡") index++;
              index =
                ((index % wording.length) + wording.length) % wording.length;
              embeds.setAuthor("Anti Badword's list blacklist word", msg.author.displayAvatarURL());
              embeds.setDescription(wording[index].join("\n"));
              embeds.setFooter(
                `Blacklist Word | Page ${index + 1} of ${wording.length}`, msg.guild.iconURL()
              );
              queuesMess.edit({ embed: embeds });
              return awaitReactions();
            });
        }
      } else {
        console.log(wording)
        embeds.setAuthor("Anti Badword's list blacklist word", msg.author.displayAvatarURL());
        embeds.setDescription(
          wording.map((x, i) => `${i + 1}. \`${x}\` **A blacklist word**`).join("\n")
        );
        embeds.setFooter(`Blacklist Word`, msg.guild.iconURL());
        return msg.channel.send({ embed: embeds });
      }
    } else if (args[0] == "add") {
      let word = client.guild.get(`guild.${msg.guild.id}.badword.word`);
      if (!args[1])
        return msg.channel.send("Please specify a word you want to blacklist!");
      if (word == args[1])
        return msg.channel.send("The words are already in the blacklist!");
      msg.channel.send(
        `Has successfully added the word \`${args[1]}\` to the blacklist`
      );
      client.guild.push(`guild.${msg.guild.id}.badword.word`, args[1]);
    } else if (args[0] == "remove") {
      let word2 = client.guild.get(`guild.${msg.guild.id}.badword.word`);
      if (!word2.includes(args[1]))
        return msg.channel.send(
          `The word \`${args[1]}\` is not found from the blacklist`
        );
      let newWord = word2.filter(x => x !== args[1]);
      msg.channel.send(
        `Has successfully removed the word \`${args[1]}\` from the blacklist`
      );
      client.guild.set(`guild.${msg.guild.id}.badword.word`, newWord);
    } else if (args[0] == "status") {
      // Mengambil data status dari database
      let status = client.guild.get(`guild.${msg.guild.id}.badword.type`);
      // Jika status dari database tersebut tidak ada atau tidak aktif
      if (!status && status == false) {
        // Maka akan menyetel status tersebut diaktifkan dan akan dikirimkan message seperti ini
        msg.channel.send(
          "<:toggleon:534669824811466762> Successfully turned on anti badword status!"
        );
        client.guild.set(`guild.${msg.guild.id}.badword.type`, true);
        // Dan jika status dari database tersebut on / aktif
      } else {
        // Maka akan menyetel status tersebut dimatikan dan akan dikirimkan message seperti ini
        msg.channel.send(
          "<:toggleoff:534669799695843337> Successfully turned off anti badword status!"
        );
        client.guild.set(`guild.${msg.guild.id}.badword.type`, false);
      }
    }
  }
};
function chunk(array, chunkSize) {
  const temp = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    temp.push(array.slice(i, i + chunkSize));
  }
  return temp;
}
