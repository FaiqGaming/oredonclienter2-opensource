module.exports = {
  name: "purge",
  usage: "o!purge [1 - 500]",
  aliases: ["clear"],
  guildOnly: true,
  description: "Clearing your channels's message",
  async run(client, msg, args) {
    if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("You can't execute this command beacuse, insufficient permissions!")
    if (!args[0]) return msg.channel.send('Please specify a number in [0 - 500] to clear the message!')
    if (args[0] > 501) return msg.channel.send('Only maxs clear mesage is 500 messages, try again!')
    await msg.channel.bulkDelete(args[0], true).then(() => {
      msg.channel.send(":pencil2: Clearing " + args[0] + " messages!").then(x => x.delete({ timeout: 5000 }))
    })
  }
}