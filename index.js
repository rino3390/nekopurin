require('dotenv').config()
const Index = require('discord.js');
const token = process.env["DCTOKEN"];
const client = new Index.Client();
var express = require('express');
var app     = express();

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
		}
	} catch (error) {
		console.log("讀取訊息錯誤。" + error)
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