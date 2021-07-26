require('dotenv').config()
const Index = require('discord.js');
const token = process.env["DEVTOKEN"];
const client = new Index.Client();

client.login(token);

// 連上線時的事件
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// 當 Bot 接收到訊息時的事件
client.on('message', msg => {
	//前置檢查 (避免回應的訊息
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
				if(msg.mentions.users.first().id === msg.author.id){
					msg.reply("你不可以說自己壞壞，懂嗎？")
				}
				else {
					const embed = new Index.MessageEmbed()
						.setColor('#ff7aad')
						.setTitle(`嘿！你！${msg.guild.member(msg.mentions.users.first()).displayName}！你壞透了！`)
						.setDescription(`<@${msg.mentions.users.first().id}>貓貓不知道你做了甚麼，但你讓<@${msg.author.id}>很生氣，所以你很壞。`)
						.setThumbnail(msg.mentions.users.first().avatarURL())
						.setFooter(`貓貓希望你反省，別再這樣了`)
					msg.channel.send(embed)
				}
			}
			else if (GetCMD("MyAvatar")) {
				const avatar = GetMyAvatar(msg)
				if (avatar.files) msg.channel.send(`${msg.author}`, avatar);
			}
			else if (GetCMD("測試")) {
				msg.channel.send(helpEmbed);
			}
		}
	} catch (error) {
		console.log("讀取訊息錯誤。" + error)
	}
});

//獲取頭像
function GetMyAvatar(msg) {
	try {
		return {
			files: [{
				attachment: msg.author.displayAvatarURL(),
				name: 'avatar.jpg'
			}]
		}
	} catch (error) {
		console.log("獲取頭項出現錯誤。")
	}
}

//讀取指令要執行的動作
function RemainString(cmd, index) {
	//如果切出來的字串長度不等於指令 == 指令和行為沒用空格隔開
	if (cmd[0].length !== index) {
		return cmd[0].substring(index)
	}
	else {
		return cmd[1]
	}
}

//嵌入訊息
const helpEmbed = new Index.MessageEmbed()
	.setColor('#ff7aad')
	.addField('貓貓布丁使用手冊', '開頭打上"喵喵!"以使用指令。')
	.addField('嗨+XXX', '貓貓布丁會跟XXX打招呼。', true)
	.setTimestamp()
	.setFooter('最後更新時間');