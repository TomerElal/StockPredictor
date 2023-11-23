import {CalculatePercentChange} from "./CalculatePercentChange";
import convertDataToGraphData from "../utils/ConvertDataToLineChartData";

export async function FetchStockData(ticker, interval) {
    const companyNameUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}&quotesCount=1&newsCount=0`;
    const dailyChangeUrl = `https://query1.finance.yahoo.com/v7/finance/chart/${ticker}?interval=${interval}`;
    const companyLogoUrl = `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${ticker}.png`;
    const companyDescription = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=NEYJGBOIAFMI8XSV`
    try {
        const [companyNameResponse, dailyChangeResponse, companyDescriptionResponse] = await Promise.all([
            fetch(companyNameUrl).then((response) => response.json()),
            fetch(dailyChangeUrl).then((response) => response.json()),
            fetch(companyDescription).then((response) => response.json()),
        ]);

        const logoResponse = await fetch(companyLogoUrl);
        const closePrices = dailyChangeResponse["chart"]["result"][0]["indicators"]["quote"][0]["close"];
        const lastPrice = closePrices[closePrices.length - 1].toFixed(2);
        if (CalculatePercentChange(dailyChangeResponse) !== null) {
            return {
                logo: logoResponse._bodyBlob._data.size > 1 && logoResponse.status === 200 ?
                    companyLogoUrl : "https://www.mah-taab.com/wp-content/uploads/2018/06/No-Logo-Available.png",
                ticker: ticker,
                companyName: companyNameResponse && companyNameResponse["quotes"][0]["shortname"],
                percentageChange: CalculatePercentChange(dailyChangeResponse),
                graphData: convertDataToGraphData(dailyChangeResponse),
                exchDisp: companyNameResponse["quotes"][0]["exchDisp"],
                companyDescription: Object.keys(companyDescriptionResponse).length > 0 ?
                    companyDescriptionResponse["Description"] :
                    "Description for this company is unavailable right now.",
                lastPrice: lastPrice,
            };
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
