module.exports = {
  name: "language",
  aliases: ["lang"],
  guildOnly: true,
  description: 'Change a new language from english to another language',
  usage: 'o!language [lang name]',
  async run(client, msg, args) {
    if (msg.author.id !== "297130271864520705") return msg.channel.send('Sorry maintenance!')
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send("You can't execute this command beacuse, insufficient permissions!");
    let lang = args[0];
    if (!lang) return msg.reply(`${await client.translate('Usage: ', msg)}` + 'o!language [lang name]')
    await client.guild.set(`guild.${msg.guild.id}.language`, lang);
    msg.channel.send(await client.translate('Succesfully changed language to: ', msg) + lang)
  }
}