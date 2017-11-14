const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame(`moderating people who think they can get away with naughty things`);
});

let prefix = "?";

client.on('message', msg => {
	if (!msg.guild.channels.find("name", "mod-log")) return;
	if (msg.author.bot) return;
	
	if (msg.content.startsWith(prefix + 'ping')) {
		msg.channel.send("Pinging...").then(sent => {
			sent.edit(`Pong! - Time Taken: ${sent.createdTimestamp - msg.createdTimestamp}ms`)
		})
	}

	if (msg.content.startsWith(prefix + 'ban')) {
		let userToBan = msg.mentions.members.first()
		let logChannel = msg.guild.channels.find("name", "mod-log")
		let reason = msg.content.split(' ').slice(2).join(' ')

		if (!msg.member.roles.has("378780370532827136")) {
			return msg.reply(`I'm sorry, ${msg.author.username}, but you are unable to use this command.`);
		} else if (!msg.guild.me.hasPermission("BAN_MEMBERS")) {
			return msg.reply(`I cannot execute this command as I have insufficient permissions.`);
		}

		if (msg.mentions.users.size === 0) {
			return msg.reply(`Please provide at least **1** user for me to ban.`);
		}

		if (userToBan.id === msg.author.id) {
			return msg.reply(`You cannot ban yourself.`);
		}

		if (userToBan.id === client.user.id) {
			return msg.reply(`I cannot ban myself.`);
		}

		if (!userToBan.bannable) {
			return msg.reply(`This user cannot be banned.`);
		}

		userToBan.ban(reason)
		msg.channel.send(`${userToBan.user.tag} was successfully banned. :hammer:`)
		logChannel.send('', {
			embed: {
				color: 0x6d0000,
				author: {
					name: msg.author.tag, 
					icon_url: msg.author.avatarURL
				},
				url: '',
				description: `**Action:** Ban\n**User:** ${userToBan.user.tag} (${userToBan.id})\n**Reason:** ${reason}`,
				timestamp: new Date(),
			}
		})
	}
    
	if (msg.content.startsWith(prefix + 'kick')) {
		let userToKick = msg.mentions.members.first()
		let logChannel = msg.guild.channels.find("name", "mod-log")
		let reason = msg.content.split(' ').slice(2).join(' ')

		if (!msg.member.roles.has("378780370532827136")) {
			return msg.reply(`I'm sorry, ${msg.author.username}, but you are unable to use this command.`);
		} else if (!msg.guild.me.hasPermission("KICK_MEMBERS")) {
			return msg.reply(`I cannot execute this command as I have insufficient permissions.`);
		}

		if (msg.mentions.users.size === 0) {
			return msg.reply(`Please provide at least **1** user for me to kick.`);
		}

		if (userToKick.id === msg.author.id) {
			return msg.reply(`You cannot kick yourself.`);
		}

		if (userToKick.id === client.user.id) {
			return msg.reply(`I cannot kick myself.`);
		}

		if (!userToKick.kickable) {
			return msg.reply(`This user cannot be kicked.`);
		}

		userToKick.kick(reason)
		msg.channel.send(`${userToKick.user.tag} was successfully kicked. :hammer:`)
		logChannel.send('', {
			embed: {
				color: 0xffb600,
				author: {
					name: msg.author.tag, 
					icon_url: msg.author.avatarURL
				},
				url: '',
				description: `**Action:** Kick\n**User:** ${userToKick.user.tag} (${userToKick.id})\n**Reason:** ${reason}`,
				timestamp: new Date(),
			}
		})
	}
    
    if (msg.content.startsWith(prefix + 'help')) {
    	msg.channel.send(`Hello. I'm the main moderation bot for **Catbot's Guild**.`)
    	const embed = new Discord.RichEmbed()
    	.setTitle(`Commands`)
    	.addField(`General`, `\`?ping\``)
    	.addField(`Moderation`, `\`?ban [user] <reason>\`, \`?kick [user] <reason>\``)
    	.setFooter(`NOTE: square brackets ([]) mean necessary and angle brackets (<>) mean optional.`)

    	msg.channel.send({embed})
    }
});

client.login(process.env.BOT_TOKEN);
