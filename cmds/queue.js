module.exports = {
  name: "queue",
  usage: "o!queue",
  aliases: ["q"],
  guildOnly: true,
  description: "Get all the song name which are in queue",
  async run(client, msg, args) {
    const { MessageEmbed } = require("discord.js");
    const { queue } = require("../server.js");

    const { COLOR } = require("../config.json");
    try {
    const serverQueue = client.queue.get(msg.guild.id);
    if (!serverQueue)
      return msg.channel.send('⚠️ There is nothing playing.');
    let queues = [];
    serverQueue.songs.forEach((x, i) => {
      if (i !== 0) {
        queues.push(x);
      }
    });
    const embed = new MessageEmbed().setColor("RANDOM");
    if (!queues || queues.length < 1)
      return msg.channel.send({ embed: {
        color: 'RANDOM',
        description: "**No tracks, on the queue**",
        footer: {
          text: `🎶 Now Playing: ${serverQueue.songs[0].title}`
        }
} }
      ); 
    if (queues.length > 5) {
      let index = 0;
      queues = queues.map(
        (x, i) =>
          `\`${i + 1}\`. __**[${x.title}](${
            x.url
          })**__ **by** ${x.authors.toString()}`
      );
      queues = chunk(queues, 5);
      embed.setAuthor("Song queue", msg.author.displayAvatarURL())
      embed.setDescription(queues[index].join("\n"));
      embed.setFooter(`🎶 Now Playing: ${serverQueue.songs[0].title} | Page ${index + 1} of ${queues.length}`);
      const queuesMess = await msg.channel.send({ embed: embed }
      );
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
            index = ((index % queues.length) + queues.length) % queues.length;
            embed.setAuthor("Song queue", msg.author.displayAvatarURL())
            embed.setDescription(queues[index].join("\n"));
            embed.setFooter(`🎶 Now Playing: ${serverQueue.songs[0].title} | Page ${index + 1} of ${queues.length}`);
            queuesMess.edit({ embed: embed }
            );
            return awaitReactions();
          });
      }
    } else {
      embed.setAuthor("Song queue", msg.author.displayAvatarURL())
      embed.setDescription(
        queues
          .map(
            (x, i) =>
              `\`${i + 1}\`. __**[${x.title}](${
                x.url
              })**__ **by** ${x.authors.toString()}`
          )
          .join("\n")
      );
      embed.setFooter(`🎶 Now Playing: ${serverQueue.songs[0].title}`);
      return msg.channel.send({ embed: embed }
      );
    }
  } catch (e) {
    return msg.channel.send(
      `Oh no an error occured :( \`\`\`${e.stack}\`\`\`try again later`
    );
  }
    /*   const { MessageEmbed } = require("discord.js");
    const { queue } = require("../server.js");

    const { COLOR } = require("../config.json");
      try {
    const serverQueue = client.queue.get(msg.guild.id);
    if (!serverQueue)
      return msg.channel.send('⚠️ There is nothing playing.');
    let queues = [];
    serverQueue.songs.forEach((x, i) => {
      if (i !== 0) {
        queues.push(x);
      }
    });
        console.log(client.queue.get(msg.guild.id).songs)
    const embed = new MessageEmbed().setColor("RANDOM");
    if (!queues || queues.length < 1)
      embed.setDescription("**No tracks, on the queue**")
      embed.setFooter(`🎶 Now Playing: ${serverQueue.songs[0].title}`);
      return msg.channel.send(embed)
    if (queues.length > 10) {
      let index = 0;
      queues = queues.map(
        (x, i) =>
          `\`${i + 1}\`. __**[${x.title}](${
            x.url
          })**__ **by** ${x.authors.toString()}`
      );
      queues = chunk(queues, 10);
      embed.setAuthor("Song queue", msg.author.displayAvatarURL())
      embed.setDescription(queues[index].join("\n"))
      embed.setFooter(`🎶 Now Playing: ${serverQueue.songs[0].title} | Page ${index + 1} of ${queues.length}`);
      const queuesMess = await msg.channel.send(embed
      );
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
            index = ((index % queues.length) + queues.length) % queues.length;
            embed.setDescription(queues[index].join("\n"))
            embed.setFooter(`🎶 Now Playing: ${serverQueue.songs[0].title} | Page ${index + 1} of ${queues.length}`);
            queuesMess.edit(embed
            );
            return awaitReactions();
          });
      }
    } else {
        embed.setAuthor("Song queue", msg.author.displayAvatarURL())
        embed.setDescription(
        queues
          .map(
            (x, i) =>
              `\`${i + 1}\`. __**[${x.title}](${
                x.url
              })**__ **by** ${x.authors.toString()}`
          )
          .join("\n")
      )
      //embed.setFooter(`🎶 Now Playing: ${serverQueue.songs[0].title}`);
      return msg.channel.send(embed
      );
    }
  } catch (e) {
    return msg.channel.send(
      `Oh no an error occured :( \`\`\`${e.stack}\`\`\`try again later`
    );
  }*/
/*    let serverQueue = queue.get(msg.guild.id);
    if (!serverQueue)
      return msg.channel.send({
        embed: {
          color: "RED",
          description: "No tracks on the queue."
        }
      });
    let songsss = serverQueue.songs.slice(1);

    let number = songsss.map((x, i) => `${i + 1} - ${x.title}`);
    number = chunk(number, 5);

    let index = 0;
    let embedQueue = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor("Song queue", msg.author.displayAvatarURL())
      .setDescription(number[index].join("\n"))
      .setFooter(
        `• Now Playing: ${serverQueue.songs[0].title} | Page ${index + 1} of ${
          number.length
        }`
      );
    const m = await msg.channel.send(embedQueue);

    if (number.length !== 1) {
      await m.react("⬅");
      await m.react("🛑");
      await m.react("➡");
      async function awaitReaction() {
        const filter = (rect, usr) =>
          ["⬅", "🛑", "➡"].includes(rect.emoji.name) &&
          usr.id === msg.author.id;
        const response = await m.awaitReactions(filter, {
          max: 1,
          time: 30000
        });
        if (!response.size) {
          return undefined;
        }
        const emoji = response.first().emoji.name;
        if (emoji === "⬅") index--;
        if (emoji === "🛑") m.delete();
        if (emoji === "➡") index++;

        if (emoji !== "🛑") {
          index = ((index % number.length) + number.length) % number.length;
          embedQueue.setDescription(number[index].join("\n"));
          embedQueue.setFooter(`Page ${index + 1} of ${number.length}`);
          await m.edit(embedQueue);
          return awaitReaction();
        }
      }
      return awaitReaction();
    }*/
  }
};
function chunk(array, chunkSize) {
  const temp = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    temp.push(array.slice(i, i + chunkSize));
  }
  return temp;
}
