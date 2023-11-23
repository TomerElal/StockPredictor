import {FetchStockData} from "./FetchStockData";

async function SearchStocks(symbol) {
    const matchStocksUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}`;
    try {
        const [matchStocksResponse] = await Promise.all([
            fetch(matchStocksUrl).then((response) => response.json()),
        ]);
        const matchStocksList = matchStocksResponse["quotes"];
        const matchStocks = matchStocksList.map((stock) => stock.symbol);
        const matchStocksPromises = matchStocks.map((ticker) => FetchStockData(ticker, '5m'));
        const matchStocksData = await Promise.all(matchStocksPromises);
        return matchStocksData.filter((data) => data !== null);
    } catch (error) {
        console.error(`Error fetching match stocks for ${symbol}:`, error);
        return null;
    }

}

export default SearchStocks;