import express from 'express';
import fetch from 'node-fetch';
import Sentiment from 'sentiment';

const app = express();
app.use(express.static('.')); // Serve static files

const sentiment = new Sentiment();
const NEWS_API_KEY = 'c00d32d98c6340ef8f0d8cb642d49bcf'; // Replace with your NewsAPI key

app.get('/fetch-wikipedia', async (req, res) => {
    const query = req.query.query;
    const content = await fetchWikipediaContent(query);
    res.json({ content });
});

app.get('/fetch-news', async (req, res) => {
    const query = req.query.query;
    const news = await fetchNews(query);
    res.json({ news });
});

app.get('/analyze-sentiment', (req, res) => {
    const text = req.query.text;
    const result = sentiment.analyze(text);
    res.json({ sentiment: result });
});

async function fetchWikipediaContent(query) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.query.search.length > 0) {
        const pageId = data.query.search[0].pageid;
        const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json`;
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();
        return contentData.query.pages[pageId].extract;
    }
    return 'No content found';
}

async function fetchNews(query) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.articles.map(article => ({
        title: article.title,
        url: article.url
    }));
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
