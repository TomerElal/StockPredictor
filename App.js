import {ActivityIndicator, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import NavigationBar from "./src/components/NavigationBar";
import {useFonts} from '@use-expo/font';
import StockContainer from "./src/components/StockContainer";
import React, {useEffect, useState} from "react";
import convertDataToGraphData from "./src/utils/convertDataToGraphData";
import CurvedLineChart from "./src/utils/CurvedLineChart";

export default function App() {

    const apiKey_alphaVantage = '8GRQZELNQAHFQL8A';
    const apiKey_cloud_iex = 'sk_e34f62fa40bc4d0e8cfb83b8d1542f80';
    const ticker = 'AAPL';
    const [stockChangePercent, setStockChangePercent] = useState({});
    const [stockDailyPrices, setStockDailyPrices] = useState({});
    const [companyName, setCompanyName] = useState({});
    const [companyLogo, setCompanyLogo] = useState({});
    const percentageChangeUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey_alphaVantage}`;
    const companyNameUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey_alphaVantage}`;
    const dailyChangeUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${apiKey_alphaVantage}`;
    const companyLogoUrl = `https://cloud.iexapis.com/stable/stock/${ticker}/logo?token=${apiKey_cloud_iex}`;


// Make an API request to get stock daily prices (5 min)
    useEffect(() => {
        fetch(dailyChangeUrl)
            .then(response => response.json())
            .then(data => {
                console.log("this is the daily prices:", data)
                setStockDailyPrices(data) })
            .catch(error => {
                console.error('Error fetching real-time stock data:', error);
            });
    }, []);


// Make an API request to get stock change percentage from the last day
    useEffect(() => {
        fetch(percentageChangeUrl)
            .then(response => response.json())
            .then(data => {
                console.log("this is the ChangePercent:", data)

                setStockChangePercent(data['Global Quote']) })
            .catch(error => {
                console.error('Error fetching real-time stock data:', error);
            });
    }, []);

// Make an API request to get stock name
    useEffect(() => {
        fetch(companyNameUrl)
            .then(response => response.json())
            .then(data => {
                console.log("this is the CompanyName:", data)

                setCompanyName(data);
            })
            .catch(error => {
                console.error('Error fetching real-time stock data:', error);
            });
    }, []);

// Make an API request to get stock logo
    useEffect(() => {
        fetch(companyLogoUrl)
            .then(response => response.json())
            .then(data => {
                setCompanyLogo(data);
            })
            .catch(error => {
                console.error('Error fetching real-time stock data:', error);
            });
    }, []);

    const [fontLoaded] = useFonts({
        'titleFont': require('./assets/fonts/JosefinSans-SemiBold.ttf'),
    });

    if (!fontLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="black"/>
                <Text style={{color: 'white'}}>Loading Fonts...</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <NavigationBar/>
                <View style={{flex: 1}}>
                    <StockContainer stockData={{
                        // logo: companyLogo.url,
                        // ticker: stockChangePercent["01. symbol"],
                        // companyName: companyName["Name"],
                        // percentageChange: stockChangePercent["10. change percent"],
                        // graphData: convertDataToGraphData(dailyChangeUrl),
                        logo: companyLogo.url,
                        ticker: ticker,
                        companyName: "Apple Inc.",
                        percentageChange: "0.3093 %",
                        graphData: convertDataToGraphData(require("./demo.json")),

                    }}/>
                </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingContainer: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
