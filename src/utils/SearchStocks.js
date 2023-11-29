import { FetchStockData } from "./FetchStockData";

/**
 * SearchStocks function fetches stock data for matching symbols.
 *
 * @async
 * @function
 * @param {string} symbol - The symbol to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of stock data for matching symbols.
 */
async function SearchStocks(symbol) {
    // URL to fetch matching stocks
    const matchStocksUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}`;

    try {
        // Fetch matching stocks response
        const [matchStocksResponse] = await Promise.all([
            fetch(matchStocksUrl).then((response) => response.json()),
        ]);

        // Extract symbols from the response
        const matchStocksList = matchStocksResponse["quotes"];
        const matchStocks = matchStocksList.map((stock) => stock.symbol);

        // Fetch stock data for each matching stock
        const matchStocksPromises = matchStocks.map((ticker) => FetchStockData(ticker, '5m'));
        const matchStocksData = await Promise.all(matchStocksPromises);

        // Filter out null values from the fetched data
        return matchStocksData.filter((data) => data !== null);
    } catch (error) {
        console.error(`Error fetching match stocks for ${symbol}:`, error);
        return null;
    }
}

export default SearchStocks;
