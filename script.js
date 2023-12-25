function handleKeyPress(event) {
    if (event.key === 'Enter') {
        fetchInfo();
    }
}

async function fetchInfo() {
    const input = document.getElementById('userInput').value;
    await analyzeSentiment(input);
    await fetchWikipediaContent(input);
    await fetchLatestNews(input);
}

async function analyzeSentiment(text) {
    const response = await fetch(`/analyze-sentiment?text=${encodeURIComponent(text)}`);
    const data = await response.json();
    displaySentimentResult(data.sentiment);
}

function displaySentimentResult(sentimentData) {
    const resultDiv = document.getElementById('sentimentResult');
    const detailsDiv = document.getElementById('sentimentDetails');
    let sentimentType = 'Neutral';
    if (sentimentData.score > 0) {
        sentimentType = 'Positive';
    } else if (sentimentData.score < 0) {
        sentimentType = 'Negative';
    }

    resultDiv.innerHTML = `
        <h2>Sentiment Analysis</h2>
        <p>Sentiment Type: <strong>${sentimentType}</strong></p>
        <p>Sentiment Score: ${sentimentData.score}</p>
    `;

    detailsDiv.innerHTML = `
        <h2>Detailed Breakdown</h2>
        <p>Comparative Score: ${sentimentData.comparative.toFixed(2)}</p>
        <p>Word Count: ${sentimentData.words.length}</p>
        <p>Positive Words: ${sentimentData.positive.join(', ')}</p>
        <p>Negative Words: ${sentimentData.negative.join(', ')}</p>
    `;
}


async function fetchWikipediaContent(query) {
    const response = await fetch(`/fetch-wikipedia?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    const limitedContent = limitWords(data.content, 300);
    document.getElementById('wikipediaContent').innerHTML = `<h2>Wikipedia Content</h2><p>${limitedContent}</p>`;
}

async function fetchLatestNews(query) {
    const response = await fetch(`/fetch-news?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    displayNews(data.news.slice(0, 20)); // Limit to 20 news articles
}

function displayNews(newsArticles) {
    const newsContainer = document.getElementById('newsContent');
    newsContainer.innerHTML = '<h2>Latest News</h2>';
    newsArticles.forEach(article => {
        const articleElement = document.createElement('p');
        articleElement.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
        newsContainer.appendChild(articleElement);
    });
}

function limitWords(text, maxWords) {
    const words = text.split(/\s+/);
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
}
