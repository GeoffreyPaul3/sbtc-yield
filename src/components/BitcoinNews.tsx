import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/card";
import { Newspaper } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

interface NewsArticle {
  title: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const API_KEY = "8089d346b2968a1b6a8c444e4aaa04f40f4348cf2c91f4648aa8ff2112fef176";

const fetchBitcoinNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=BTC&sortOrder=popular&api_key=${API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Apikey ${API_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.Data.slice(0, 5).map((article: any) => ({
      title: article.title,
      url: article.url,
      publishedAt: new Date(article.published_on * 1000).toISOString(),
      source: {
        name: article.source
      }
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const BitcoinNews = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["bitcoinNews"],
    queryFn: fetchBitcoinNews,
    refetchInterval: 300000,
    retry: 3,
    meta: {
      errorMessage: "Failed to load Bitcoin news. Please try again later."
    }
  });

  if (error) {
    toast.error("Failed to load Bitcoin news. Please try again later.");
  }

  return (
    <Card className="w-full p-4 sm:p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
        <h2 className="text-lg sm:text-xl font-bold text-white">Latest Bitcoin News</h2>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-400">Unable to load news at this time.</p>
          <p className="text-sm text-gray-500">Please try again later.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {news?.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 sm:p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors overflow-hidden"
            >
              <h3 className="text-sm sm:text-base text-gray-200 font-medium mb-2 line-clamp-2">{article.title}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-400 gap-1 sm:gap-2">
                <span className="truncate">{article.source.name}</span>
                <span className="whitespace-nowrap">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </Card>
  );
};