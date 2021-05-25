module.exports = {
  name: "afk",
  aliases: [],
  description: "Set your afk.",
  usage: "o!afk [Reason]",
  async run(client, msg, args) {
    let reason = args.join(" ") || 'No Reason.';

    client.afk.set(`guild.${msg.guild.id}.afk.${msg.author.id}`, [Date.now(), reason])
    msg.channel.send(`I set your afk with reason: \`${reason}\``);
  }
}