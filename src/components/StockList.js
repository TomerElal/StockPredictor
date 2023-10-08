import React, {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from "react-native";
import StockContainer from "./StockContainer";
import convertDataToGraphData from "../utils/convertDataToGraphData";
import {CalculatePercentChange} from "../utils/CalculatePercentChange";

// List of stock tickers
const stocks = [
    'SPY', 'TSLA', 'AAPL', 'NVDA', 'MSFT', 'GOOG', 'AMZN', 'META', 'BABA',
    'NFLX', 'INTC', 'MARA', 'INTU', 'AMGN', 'QCOM', 'HON', 'AMAT', 'BKNG', 'SBUX', 'ISRG',
    'ADP', 'MDLZ', 'GILD', 'VRTX', 'REGN', 'ADI', 'QQQ', 'DIA', 'ONEQ', 'AVGO', 'COST', 'ADBE',
    'PEP', 'CSCO', 'AMD', 'TMUS', 'ATVI', 'PYPL', 'TTD', 'MTCH', 'ZG', 'YELP'
];

export default function StockList() {
    const [stocksData, setStocksData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Function to fetch stock data for a single ticker
        const fetchStockData = async (ticker, interval) => {
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
                    percentageChange: dailyChangeResponse !== null ?
                        CalculatePercentChange(dailyChangeResponse) : 'N/A',
                    graphData: convertDataToGraphData(dailyChangeResponse),
                };
            } catch (error) {
                console.error(`Error fetching data for ${ticker}:`, error);
                return null;
            }
        };

        // Function to fetch data for all stocks
        const fetchAllStockData = async () => {
            const stockPromises = stocks.map((ticker) => fetchStockData(ticker, '5m'));
            const stocksData = await Promise.all(stockPromises);
            const filteredStockData = stocksData.filter((data) => data !== null);
            setStocksData(filteredStockData);
            setLoading(false);
        };

        fetchAllStockData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white"/>
                <Text style={{color: 'white'}}>Loading Fonts and Data...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={stocksData}
            keyExtractor={(item) => item.ticker}
            renderItem={({item}) => <StockContainer stockData={item}/>}
        />
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
