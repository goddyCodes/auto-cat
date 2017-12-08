const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame(`moderating people who think they can get away with naughty things`);
});

let prefix = "?";

let adLinks = ["discord.gg/", "discord.li/", "discord.io/", "discord.me/", "disco.gg/"]

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

		userToBan.ban(`[Mod]: ${msg.author.tag} [Reason]: ` + reason)
		msg.channel.send(`${userToBan.user.tag} was successfully banned. :hammer:`)
		logChannel.send('', {
			embed: {
				color: 0x6d0000,
				author: {
					name: msg.author.tag, 
					icon_url: msg.author.avatarURL
				},
				url: '',
				description: `**Action:** Ban\n**User:** ${userToBan.user.tag} (${userToBan.id})\n**Reason:** ${reason || "No reason specified"}`,
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

		userToKick.kick(`[Mod]: ${msg.author.tag} [Reason]: ` + reason)
		msg.channel.send(`${userToKick.user.tag} was successfully kicked. :hammer:`)
		logChannel.send('', {
			embed: {
				color: 0xffb600,
				author: {
					name: msg.author.tag, 
					icon_url: msg.author.avatarURL
				},
				url: '',
				description: `**Action:** Kick\n**User:** ${userToKick.user.tag} (${userToKick.id})\n**Reason:** ${reason || "No reason specified"}`,
				timestamp: new Date(),
			}
		})
	}
    
    if (msg.content.startsWith(prefix + 'help')) {
    	msg.channel.send(`Hello. I'm the main moderation bot for **Catbot's Guild**.`)
    	const embed = new Discord.RichEmbed()
    	.addField(`General`, `\`${prefix}ping\``)
    	.addField(`Moderation`, `\`${prefix}ban [user] <reason>\`\n\`${prefix}kick [user] <reason>\`\n\`${prefix}mute [user] <reason>\`\n\`${prefix}unmute [user] <reason>\`\n\`${prefix}warn [user] <reason>\``)
    	.setFooter(`NOTE: square brackets ([]) mean necessary and angle brackets (<>) mean optional.`)

    	msg.channel.send({embed})
    }

    if (msg.content.startsWith(prefix + 'mute')) {
    	let userToMute = msg.mentions.members.first()
    	let logChannel = msg.guild.channels.find("name", "mod-log")
		let reason = msg.content.split(' ').slice(2).join(' ')
		let mutedRole = msg.guild.roles.find("name", "Muted")

        if (!msg.member.roles.has("378780370532827136")) {
			return msg.reply(`I'm sorry, ${msg.author.username}, but you are unable to use this command.`);
		} else if (!msg.guild.me.hasPermission("MANAGE_ROLES")) {
			return msg.reply(`I cannot execute this command as I have insufficient permissions.`);
		}

        if (msg.mentions.users.size === 0) {
			return msg.reply(`Please provide at least **1** user for me to mute.`);
		}

		if (userToMute.id === msg.author.id) {
			return msg.reply(`You cannot mute yourself.`);
		}

		if (userToMute.id === client.user.id) {
			return msg.reply(`I cannot mute myself.`);
		}
	    
	       if (userToMute.roles.has("378780091016151041")) {
			return msg.reply(`You cannot mute those with the Developer role.`);
	       }
	    
		if (!userToMute.kickable) {
			return msg.reply(`This user cannot be muted.`);
		}

		userToMute.addRole(mutedRole, `[Mod]: ${msg.author.tag} [Reason]: ` + reason)
		msg.channel.send(`${userToMute.user.tag} was successfully muted. :hammer:`)
		logChannel.send('', {
			embed: {
				color: 0xd3d3d3,
				author: {
					name: msg.author.tag, 
					icon_url: msg.author.avatarURL
				},
				url: '',
				description: `**Action:** Mute\n**User:** ${userToMute.user.tag} (${userToMute.id})\n**Reason:** ${reason || "No reason specified"}`,
				timestamp: new Date(),
			}
		})
    }

    if (msg.content.startsWith(prefix + 'unmute')) {
    	let userToUnmute = msg.mentions.members.first()
    	let logChannel = msg.guild.channels.find("name", "mod-log")
		let reason = msg.content.split(' ').slice(2).join(' ')
		let mutedRole = msg.guild.roles.find("name", "Muted")

        if (!msg.member.roles.has("378780370532827136")) {
			return msg.reply(`I'm sorry, ${msg.author.username}, but you are unable to use this command.`);
		} else if (!msg.guild.me.hasPermission("MANAGE_ROLES")) {
			return msg.reply(`I cannot execute this command as I have insufficient permissions.`);
		}

        if (msg.mentions.users.size === 0) {
			return msg.reply(`Please provide at least **1** user for me to unmute.`);
		}

		if (userToUnmute.id === msg.author.id) {
			return msg.reply(`You cannot unmute yourself. Because the mute command doesn't allow you to mute yourself.`);
		}

		if (userToUnmute.id === client.user.id) {
			return msg.reply(`I cannot be muted, therefore, I cannot be unmuted.`);
		}

		userToUnmute.removeRole(mutedRole, `[Mod]: ${msg.author.tag} [Reason]: ` + reason)
		msg.channel.send(`${userToUnmute.user.tag} was successfully unmuted. :hammer:`)
		logChannel.send('', {
			embed: {
				color: 0xd3d3d3,
				author: {
					name: msg.author.tag, 
					icon_url: msg.author.avatarURL
				},
				url: '',
				description: `**Action:** Unmute\n**User:** ${userToUnmute.user.tag} (${userToUnmute.id})\n**Reason:** ${reason || "No reason specified"}`,
				timestamp: new Date(),
			}
		})
    }
	
    	if (msg.content.startsWith(prefix + 'warn')) {
		let userToWarn = msg.mentions.members.first()
		let logChannel = msg.guild.channels.find("name", "mod-log")
		let reason = msg.content.split(' ').slice(2).join(' ')

		if (!msg.member.roles.has("378780370532827136")) {
			return msg.reply(`I'm sorry, ${msg.author.username}, but you are unable to use this command.`);
		} else if (!msg.guild.me.hasPermission("KICK_MEMBERS")) {
			return msg.reply(`I cannot execute this command as I have insufficient permissions.`);
		}

		if (msg.mentions.users.size === 0) {
			return msg.reply(`Please provide at least **1** user for me to warn.`);
		}

		if (userToWarn.id === msg.author.id) {
			return msg.reply(`You cannot warn yourself.`);
		}

		if (userToWarn.id === client.user.id) {
			return msg.reply(`I cannot warn myself.`);
		}
		
		if (!userToWarn.kickable) {
			return msg.reply(`I cannot warn this user.`);
		}
		
		msg.channel.send(`${userToWarn.user.tag} was successfully warned. 🔨`);
		logChannel.send('', {
			embed: {
				color: 0xdbd39d,
				author: {
					name: msg.author.tag, 
					icon_url: msg.author.avatarURL
				},
				url: '',
				description: `**Action:** Warn\n**User:** ${userToWarn.user.tag} (${userToWarn.id})\n**Reason:** ${reason || "No reason specified"}`,
				timestamp: new Date(),
			}
		})
	}
	
    // if you'd like to use anti-ads, please uncomment the code below.
    /* if (adLinks.some(word => msg.content.includes(word) && !msg.member.roles.some(r => ["Boats", "(other) Bots"].includes(r.name)))) {
    	let logChannel = msg.guild.channels.find("name", "mod-log")
    	msg.delete()
    	msg.reply(`Please do not advertise on this server.`)
        logChannel.send('', {
			embed: {
				color: 0xffff00,
				url: '',
				description: `**Advertisement Detected!**\n\n**Action:** Automod\n**User:** ${msg.author.tag} (${msg.author.id})\n**Message Content:** ${msg.content}`,
				timestamp: new Date(),
			}
		})
    } */
});

client.login(process.env.BOT_TOKEN);
