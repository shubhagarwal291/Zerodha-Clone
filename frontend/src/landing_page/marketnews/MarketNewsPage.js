import React, { useEffect, useState } from "react";
import axios from "axios";

function MarketNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "d8gsvqhr01qhjpmphsjgd8gsvqhr01qhjpmphsk0";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`
        );

        setNews(response.data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-5">Market News</h1>

      {loading ? (
        <h4>Loading latest market news...</h4>
      ) : (
        news.map((article, index) => (
          <div
            key={index}
            className="card bg-dark text-light mb-4 border-secondary"
          >
            <div className="card-body">
              <h4>{article.headline}</h4>

              <p className="text-muted">
                Source: {article.source}
              </p>

              <p>{article.summary}</p>

              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Read More
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MarketNewsPage;