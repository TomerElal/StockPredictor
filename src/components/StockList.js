import React, {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from "react-native";
import StockContainer from "./StockContainer";
import {FetchStockData} from "../utils/FetchStockData";
import Loading from "../screens/Loading";

// List of stock tickers
const stocks = [
    'TSLA', 'AAPL', 'MSFT', 'NVDA', 'NFLX', 'GOOGL', 'META', 'PYPL', 'BABA', 'TSM',
    'AVGO', 'ORCL', 'ADBE', 'ASML', 'CSCO', 'NKE', 'CRM', 'ACN', 'AMD',
    // 'SAP', 'INTC', 'INTU', 'TXN', 'IBM', 'QCOM', 'NOW', 'AMAT', 'SONY',
    // 'MCD', 'ADI', 'LRCX', 'PANW', 'MU', 'SNPS', 'INFY', 'FI', 'CDNS', 'SHOP',
    // 'VMW', 'KLAC', 'ANET', 'WDAY', 'ROP', 'DELL', 'NXPI', 'APH', 'MSI',
    // 'FTNT', 'ADSK', 'MCHP', 'TEL', 'STM', 'CTSH',
    // 'FIS', 'IT', 'CDW', 'SQ', 'HPQ', 'FTV', 'SPLK', 'ANSS',
    // 'ZS', 'GLW', 'FICO', 'HUBS', 'KEYS', 'VRSN', 'HPE','MPWR', 'BR',
    // 'GRMN', 'UMC', 'TDY', 'FLT', 'JBL', 'PTC', 'ASX', 'AKAM', 'FSLR',
    // 'CHKP', 'TYL', 'NTAP', 'PAYC', 'SWKS', 'TER', 'SMCI', 'OKTA',
    // 'ENTG', 'WDC', 'STX',  'EPAM', 'LDOS', 'SSNC', 'TRMB',
    // 'MANH', 'GEN', 'CDAY', 'GDDY', 'LOGI', 'FLEX',  'PCTY', 'ZBRA', 'JKHY'
];

export default function StockList() {
    const [stocksData, setStocksData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to fetch data for all stocks
        const fetchAllStockData = async () => {
            const stockPromises = stocks.map((ticker) => FetchStockData(ticker, '5m'));
            const stocksData = await Promise.all(stockPromises);
            const filteredStockData = stocksData.filter((data) => data !== null);
            setStocksData(filteredStockData);
            setLoading(false);
        };

        fetchAllStockData();
    }, []);

    if (loading) {return (<Loading/>);}

    return (
        <FlatList
            data={stocksData}
            keyExtractor={(item) => item.ticker}
            renderItem={({item}) => <StockContainer stockData={item}/>}
        />
    );
}

