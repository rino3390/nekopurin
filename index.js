require('dotenv').config()
const Discord = require('discord.js');
const token = process.env["DCTOKEN"];
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
var express = require('express');
var app     = express();
const drinkOrgID = process.env["drinkOrgID"];

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
	var result = 'App is running'
	response.send(result);
}).listen(app.get('port'), function() {
	console.log('App is running, server is listening on port ', app.get('port'));
});

client.login(token);

// 連上線時的事件
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


// 當 Bot 接收到訊息時的事件
client.on('message', msg => {
	try {
		if (!msg.guild) return;             //只回應群組
		if (msg.member.user.bot) return;    //防止回應機器人
	} catch (error) {
		console.log("讀取訊息發送者錯誤。" + error);
		return;
	}

	//判斷訊息
	try {
		//前置條件
		const prefix = "喵喵!"
		if (msg.content.substring(0, prefix.length) === prefix) {
			//抓出指令 (切出子字串後先去掉前後空白)
			const cmd = msg.content.substring(prefix.length).trim().split(" ");

			//如果句子包含指令就算有指令 (必須在開頭
			function GetCMD(string) {
				return cmd[0].search(string) === 0;
			}

			if (GetCMD("嗨")) {
				const event = RemainString(cmd, 1)
				msg.reply("嗨 " + event + "喵喵喵~~")
			}
			else if (GetCMD("壞")) {
				if(msg.mentions.users.first() === undefined){
					msg.reply("誰壞壞你要講啊？")
				}
				else if (msg.mentions.users.first().id === msg.author.id) {
					msg.reply("你不可以說自己壞壞，懂嗎？")
				}
				else {
					const embed = new Index.MessageEmbed()
						.setColor('#ff7aad')
						.setTitle(`嘿！你！${msg.guild.member(msg.mentions.users.first()).displayName}！你壞透了！`)
						.setDescription(`<@${msg.mentions.users.first().id}> 貓貓不知道你做了甚麼，但你讓 <@${msg.author.id}> 很生氣，所以你很壞。`)
						.setThumbnail(msg.mentions.users.first().avatarURL())
						.setFooter(`貓貓希望你反省，別再這樣了`)
					if (cmd.length > 2) {
						if (cmd[2] !== `<@!${msg.mentions.users.first().id}>`) {
							const str = cmd[2]===''?cmd[3]:cmd[2]
							embed.setDescription(`<@${msg.mentions.users.first().id}> 因為你${str}，讓 <@${msg.author.id}> 很生氣，所以你很壞。`)
						}
						else {
							embed.setDescription(`<@${msg.mentions.users.first().id}> 因為你${cmd[1]}，讓 <@${msg.author.id}> 很生氣，所以你很壞。`)
						}
					}
					if (cmd[0] !== "壞") {
						const event = RemainString(cmd, 1)
						embed.setDescription(`<@${msg.mentions.users.first().id}> 因為你${event}，讓 <@${msg.author.id}> 很生氣，所以你很壞。`)
					}
					msg.channel.send(embed)
				}
			}
			else if(GetCMD("\\?")){
				if(msg.mentions.users.first() === undefined){
					msg.channel.send({files: ["https://i.imgur.com/cgZbwOI.jpg"]});
				}
				else {
					msg.channel.send(`<@${msg.mentions.users.first().id}>`, {files: ["https://i.imgur.com/cgZbwOI.jpg"]});
				}
			}
		}
	} catch (error) {
		console.log("讀取訊息錯誤。" + error)
	}
});


//新增反應
client.on('messageReactionAdd', (reaction, user) => {
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id === '917177254025523212') {
		switch (reaction.emoji.name) {
			case '☑️':
				member.roles.add('916747674198343741')
				break;
		}
	}
});

//移除反應
client.on('messageReactionRemove', (reaction, user) => {
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id === '917177254025523212') {
		switch (reaction.emoji.name) {
			case '☑️':
				member.roles.remove('916747674198343741')
				break;
		}
	}
});

//讀取指令要執行的動作
function RemainString(cmd, index) {
	//如果切出來的字串長度不等於指令 == 指令和行為沒用空格隔開
	if (cmd[0].length !== index) {
		return cmd[0].substring(index)
	} else {
		return cmd[1]
	}
}