const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);

const command = 'chatgpt';

module.exports = {
	data: new SlashCommandBuilder()
		.setName(command)
		.setDescription('Ask ChatGPT a question!')
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription('The question for ChatGPT')
                .setRequired(true)
            ),
	async execute(interaction) {
        await interaction.deferReply();
        let payload = interaction.option.getString('question');
        openai.createCompletion({
            model: "text-davinci-003",
            prompt: payload,
            temperature: 0.7,
            max_tokens: 256,
        }).then(async response => {
            let answer = response.data.choices[0].text 
            console.log(answer);
            await interaction.editReply(answer);            
        }).catch(async error => {
            console.log(error)
            await interaction.editReply("something went wrong asking ChatGPT!")
        });		
	},
};
