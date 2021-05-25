module.exports = (client, fs) => {
  fs.readdirSync("./cmds/").forEach(dir => {
    const jsfile = fs.readdirSync("./cmds/").filter(f => f.endsWith(".js"));
    jsfile.forEach(function(file) {
      let pull = require(`../cmds/${file}`);

        client.commands.set(pull.name, pull);

      if (pull.aliases && Array.isArray(pull.aliases))
        pull.aliases.forEach(aliases => client.aliases.set(aliases, pull.name));
    })
  });
};
