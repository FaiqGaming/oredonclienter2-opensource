module.exports = {
  name: "serverroles",
  aliases: ["srl"],
  description: "Getting information of your all server roles!",
  usage: "o!serverroles (will be checked by system)",
  guildOnly: true,
  async run(client, message, args) {
    const WxArtzEmbedBiarSyantik = require('discord.js').MessageEmbed;

	let number = message.guild.roles.cache.array().sort().map((x,i) => `\`${i+1}\` - ${x}`)
	number = chunk(number, 10);

	let index = 0;
  const ge = new WxArtzEmbedBiarSyantik()
  .setColor("RANDOM")
  .setAuthor(`| Server Roles List [${message.guild.roles.cache.size}]`, message.guild.iconURL())
  .addField(`${message.guild.owner.user.tag}`, `(${message.guild.ownerID})`)
  .setDescription(number[index].join('\n'))
  .setFooter(`Page ${index+1} of ${number.length}`)
	const m = await message.channel.send(ge);
	await m.react('⬅');
  await m.react('🔴');
	await m.react('➡');
	async function awaitReaction(){
    const filter =(rect, usr) => ['⬅', '🔴','➡' ].includes(rect.emoji.name) && usr.id === message.author.id
		const response = await m.awaitReactions(filter, {
			max: 1,
			time: 30000
		});
		if(!response.size){
			return undefined;
		}
		const emoji = response.first().emoji.name;
		if(emoji === '⬅') index--;
    if(emoji === '🔴')  m.delete();
		if(emoji === '➡') index++;
    
		index = ((index % number.length) + number.length) % number.length;
		ge.setDescription(number[index].join('\n'))
    ge.setFooter(`Page ${index+1} of ${number.length}`)
		await m.edit(ge);
		return awaitReaction();
	}
	return awaitReaction();
  }
}
function chunk(array, chunkSize) {
    const temp = [];
    for(let i = 0; i < array.length; i+= chunkSize){
      temp.push(array.slice(i, i+chunkSize));
    }
    return temp;
  }