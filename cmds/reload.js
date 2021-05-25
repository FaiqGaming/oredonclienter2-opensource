module.exports = {
  name: "reload",
  description: "Reloads a command",
  usage: "o!reload <command name> or <alias command name>",
  guildOnly: true,
  run(client, msg, args) {
    if (msg.author.id !== "297130271864520705")
      return msg.channel.send("Only owners can run this command!");
    if (!args.length)
      return msg.channel.send(
        `Specify a command you want to reload, ${msg.author}!`
      );
    const commandName = args[0].toLowerCase();
    const command =
      msg.client.commands.get(commandName) ||
      msg.client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
      );
    delete require.cache[require.resolve(`./${command.name}.js`)];
    msg.channel.send(`Command \`${command.name}\` was reloaded!`);
    if (!command)
      return msg.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${msg.author}!`
      );
    try {
      const newCommand = require(`./${command.name}.js`);
      msg.client.commands.set(newCommand.name, newCommand);
    } catch (error) {
      console.error(error);
      msg.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
      );
    }
  }
};
