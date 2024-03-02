### Documentation for Discord Bot Scripts

#### Overview
This project consists of a Discord bot designed to fetch news articles based on user commands, summarize the content, and present it in a newsletter format within a Discord channel. The bot utilizes a series of Python and JavaScript scripts to achieve this functionality, integrating external APIs and natural language processing techniques.

#### Scripts and Their Functions

1. **index.js**
   - **Purpose**: Serves as the main entry point for the Discord bot. It handles Discord events, including message creation, and triggers the news fetching and summarization process based on user commands.
   - **Key Functions**:
     - Connection to Discord using the Discord.js library.
     - Handling of `!news <topic>` commands to fetch and summarize news articles.
     - Integration with Groq SDK for summarizing news content into a newsletter format.
     - Error handling and logging.

2. **discord_bot.log**
   - **Purpose**: Logs the activities of the Discord bot, including errors, command inputs, and system messages, for debugging and monitoring purposes.

3. **newsletter.txt**
   - **Purpose**: Temporarily stores the newsletter-formatted news summary before sending it to the Discord channel if the content exceeds Discord's message length limit.

4. **test.py**
   - **Purpose**: Acts as a utility script to fetch and format news articles based on a given topic.
   - **Key Functions**:
     - Fetches news articles using the `search_news` function.
     - Formats fetched news articles into a readable format using `summary_formatter`.

5. **search_news.py**
   - **Purpose**: Fetches news articles related to a specified topic using web scraping techniques.
   - **Key Functions**:
     - Utilizes the `DDGS` (DuckDuckGo Search) library to search for news articles.
     - Extracts content from the fetched URLs using BeautifulSoup.

6. **summary_formatter.py**
   - **Purpose**: Formats the fetched news content into a newsletter format.
   - **Key Functions**:
     - Uses spaCy for natural language processing to segment and format the text.
     - Formats text to fit within Discord's message constraints and improve readability.

#### Setup and Usage

1. **Installation**
   - Install Node.js and npm.
   - Install Python and required packages (`httpx`, `beautifulsoup4`, `spacy`).
   - Set up a Discord bot and obtain a token.

2. **Configuration**
   - Place your Discord bot token in a `.env` file or directly in `index.js`.
   - Install required Node.js packages: `npm install discord.js groq-sdk winston fs`.
   - Install required Python packages: `pip install httpx beautifulsoup4 spacy`.

3. **Running the Bot**
   - Start the bot using `node index.js`.
   - In Discord, use the `!news <topic>` command to fetch and summarize news on the specified topic.

4. **Customization**
   - Modify `test.py`, `search_news.py`, and `summary_formatter.py` as needed to change news sources, formatting styles, and summarization techniques.

#### Contributing
Contributions to the project are welcome. Please follow the standard Git workflow for contributions:
- Fork the repository.
- Create a feature branch.
- Commit your changes.
- Push to the branch.
- Submit a pull request.

#### License
Specify the license under which your project is released, ensuring it's clear for contributors and users.

---

This documentation provides a clear overview of the project's structure and usage, ready for inclusion in your Git repository. Ensure to add any additional details specific to your project's setup or requirements.
