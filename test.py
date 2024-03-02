# test.py
import asyncio
import sys
from search_news import search_news
from summary_formatter import format_news_summary

async def main():
    topic = 'news' if len(sys.argv) <= 1 else sys.argv[1]
    max_results = 2 if len(sys.argv) <= 2 else int(sys.argv[2])

    news_articles = await search_news(topic, max_results)
    for title, article_text in news_articles:
        formatted_article = format_news_summary(article_text, title)  # Now passing both text and title
        print(formatted_article)

if __name__ == "__main__":
    asyncio.run(main())
