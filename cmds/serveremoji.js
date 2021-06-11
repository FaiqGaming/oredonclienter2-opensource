module.exports = {
  name: "serveremoji",
  aliases: ["srji", "sremo"],
  description: "Getting information of your all server emoji!",
  usage: "o!serveremoji (will be checked by system)",
  guildOnly: true,
  async run(client, message, args) {
    const emoji = require('discord.js').MessageEmbed;

	let number = message.guild.emojis.cache.array().map((x,i)=> `${i+1} - ${x} \\${x.toString()} (${x.name})`)
	number = chunk(number, 10);
  
  if (!number) return message.channel.send("Sorry, this server not have emoji")

	let index = 0;
  
  try {
  const ge = new emoji()
  .setColor("RANDOM")
  .setAuthor(`| Server Emote List`, message.guild.iconURL())
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
  catch(e){
    return message.channel.send(`Oh, an error ocurred :( \`${e.message}\` try again later`)
  }
  }
}
function chunk(array, chunkSize) {
    const temp = [];
    for(let i = 0; i < array.length; i+= chunkSize){
      temp.push(array.slice(i, i+chunkSize));
    }
    return temp;
  }