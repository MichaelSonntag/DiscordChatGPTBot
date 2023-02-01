require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const net = require('net');

const server = net.createServer((socket) => {
  console.log('client connected');
  socket.on('data', (data) => {
    console.log(data.toString());
    socket.write('Pong');
  });

  socket.on('end', () => {
    console.log('client disconnected');
  });
});

server.listen(8080, () => {
  console.log('server listening on port 8080');
});

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const command = '!chatgpt';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    console.log(msg.content);
    if (msg.content.startsWith(command)) {
        let payload = msg.content.substring(command.length).trim();
        openai.createCompletion({
            model: "text-davinci-003",
            prompt: payload,
            temperature: 0.7,
            max_tokens: 256,
        }).then(response => {
            console.log(response.data.choices[0].text);
            msg.reply(response.data.choices[0].text)
        });
    }
});

client.login(process.env.DISCORD_TOKEN);
