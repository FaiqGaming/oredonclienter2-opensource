module.exports = {
  name: "docs",
  aliases: [],
  description: "Display discord.js's documentation",
  guildOnly: true,
  usage: "o!docs [search query]",
  async run(client, msg, args) {
    const data = args[0];
  if (!data)
    return msg.channel
      .send("No search query specified.")
      .then(msg => msg.delete({ timeout: 3000}));
    
  client.snek
    .get("https://djsdocs.sorta.moe/v1/main/master/embed")
    .query({ q: data })
    .then(a => {
      msg.channel.send({ embed: a.body });
  })
  }
}