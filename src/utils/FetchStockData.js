import { CalculatePercentChange } from "../utils/CalculatePercentChange";
import convertDataToGraphData from "../utils/ConvertDataToLineChartData";

export async function FetchStockData(ticker, interval) {
    const companyNameUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}&quotesCount=1&newsCount=0`;
    const dailyChangeUrl = `https://query1.finance.yahoo.com/v7/finance/chart/${ticker}?interval=${interval}`;
    const companyLogoUrl = `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${ticker}.png`;

    try {
        const [companyNameResponse, dailyChangeResponse] = await Promise.all([
            fetch(companyNameUrl).then((response) => response.json()),
            fetch(dailyChangeUrl).then((response) => response.json()),
        ]);
        return {
            logo: companyLogoUrl,
            ticker: ticker,
            companyName: companyNameResponse && companyNameResponse["quotes"][0]["shortname"],
            percentageChange: dailyChangeResponse !== null
                ? CalculatePercentChange(dailyChangeResponse)
                : 'N/A',
            graphData: convertDataToGraphData(dailyChangeResponse),
            currency: dailyChangeResponse["chart"]["result"][0]["meta"]["currency"],
            exchDisp: companyNameResponse["quotes"][0]["exchDisp"],
        };
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        return null;
    }
}
