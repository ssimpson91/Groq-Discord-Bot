const Groq = require('groq-sdk');
const { Client, GatewayIntentBits } = require('discord.js');
const winston = require('winston');
const fs = require('fs');
const { token } = require('./config.json');
const { exec } = require('child_process');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'discord_bot.log' }) // Log to a file named discord_bot.log
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  logger.info(`Logged in as ${client.user.tag}!`);
});

const PREFIX = '!chat ';

client.on('messageCreate', async message => {
    // Log the received message object for debugging
    console.log('Received message:', message);
    logger.info('Received message:', message.content);
  
    // Ignore messages from bots to avoid potential loops
    if (message.author.bot) return;
  
    // Check if the message starts with the command prefix (e.g., '!chat ')
    if (message.content.startsWith(PREFIX)) {
      // Extract the user's message (excluding the command prefix)
      const userPrompt = message.content.slice(PREFIX.length).trim();
  
      try {
        // Create a Groq client instance
        const groq = new Groq();
  
        // Define the prompt and model
        const prompt = {
          "messages": [
            {
              "role": "system",
              "content": "You are a helpful Discord Chat Bot named newsChan for a community Discord server."
            },
            {
              "role": "user",
              "content": userPrompt
            }
          ],
          "model": "mixtral-8x7b-32768"
        };
  
        // Set the optional parameters
        const options = {
          temperature: 0.5,
          max_tokens: 8192,
          top_p: 1,
          stop: null,
          stream: false
        };
  
        // Call the Groq chat completion API
        const response = await groq.chat.completions.create(prompt, options);

        // Log response to the console
        console.log(response);

        // Extract the message from the first choice
        const answer = response.choices[0].message.content;

        // Check if the response is too long for a single Discord message
        if (answer.length > 2000) {
        // Save the response to a text file
        fs.writeFileSync('response.txt', answer);

        // Send the text file to the Discord channel
        message.channel.send({
            files: [{
            attachment: 'response.txt',
            name: 'response.txt'
            }]
        });
        } else {
        // Send the response as a regular message
        message.channel.send(answer);
        }
      } catch (error) {
        console.error(`Error sending user prompt to LocalGPT API: ${error}`);
      }
    }
  });

  function callSearchNews(topic, maxResults) {
    return new Promise((resolve, reject) => {
        // Ensure maxResults is an integer; provide a default if not
        const maxResultsInt = Number.isInteger(maxResults) ? maxResults : 5;
        const command = `python test.py "${topic}" ${maxResultsInt}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(stderr);
                return;
            }
            resolve(stdout);
        });
    });
}

client.on('messageCreate', async message => {
  if (message.content.startsWith('!news ')) {
      const args = message.content.slice(6).split(' ');
      const topic = args[0];
      const maxResults = args.length > 1 ? parseInt(args[1], 10) : 2;

      try {
          const newsContent = await callSearchNews(topic, maxResults);
          // Assuming newsContent is a string containing the fetched news articles
          const chatPrompt = `Summarize this news into a format for a community Discord server:\n\n${newsContent}`;
          
          // Now send this prompt to Groq via the !chat command logic
          const groq = new Groq();
          const prompt = {
              "messages": [
                  {
                      "role": "system",
                      "content": "You are a newsletter assistant Discord bot for a community server, summarize the provided News content organized and accurately."
                  },
                  {
                      "role": "user",
                      "content": chatPrompt
                  }
              ],
              "model": "llama2-70b-4096"
          };

          const options = {
              temperature: 0.5,
              max_tokens: 4096,
              top_p: 1,
              stop: null,
              stream: false
          };

          const response = await groq.chat.completions.create(prompt, options);
          const summary = response.choices[0].message.content;

          // Ensure the summarized newsletter does not exceed Discord's message length limit
          if (summary.length > 2000) {
              fs.writeFileSync('newsletter.txt', summary);
              message.channel.send({
                  files: [{
                      attachment: 'newsletter.txt',
                      name: 'newsletter.txt'
                  }]
              });
          } else {
              message.channel.send(summary);
          }
      } catch (error) {
          console.error(`Failed to process news: ${error}`);
          message.channel.send('An error occurred while processing the news.');
      }
  }
});



client.login(token);
