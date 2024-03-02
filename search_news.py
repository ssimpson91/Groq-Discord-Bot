import asyncio
from duckduckgo_search import DDGS
import httpx
from bs4 import BeautifulSoup

async def fetch_url_content(url):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, follow_redirects=True, timeout=10.0)
            response.raise_for_status()  # Raises an exception for 4XX/5XX responses
            return response.text
        except httpx.HTTPStatusError as e:
            print(f"HTTP error {e.response.status_code} while requesting {url}: {e}")
            return None
        except httpx.RequestError as e:
            print(f"Request to {url} failed: {e}")
            return None

# Adjust search_news to return a list of (title, article_text) tuples

async def search_news(topic, max_results=10):
    query = f"{topic} news"
    articles = []
    
    with DDGS() as ddgs:
        results = [r for r in ddgs.text(query, max_results=max_results)]
        
    for result in results:
        url = result['href']
        page_content = await fetch_url_content(url)
        if page_content:
            soup = BeautifulSoup(page_content, 'html.parser')
            title = soup.find('title').text if soup.find('title') else "No Title"
            text = soup.get_text()
            articles.append((title, text))
        else:
            print(f"Skipping article at {url} due to fetch error")
    return articles


# Example usage
# asyncio.run(search_news("example topic", 5))
