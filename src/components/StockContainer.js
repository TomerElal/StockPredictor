import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// Import a custom component
import CurvedLineChart from "../utils/CurvedLineChart";
/**
 * A component representing a stock container.
 *
 * @param {Object} stockData - Data for the stock.
 * @param {string} stockData.logo - URL of the stock's logo.
 * @param {string} stockData.ticker - Stock ticker symbol.
 * @param {string} stockData.companyName - Company name.
 * @param {number} stockData.percentageChange - Percentage change in stock value.
 * @param {Array} stockData.graphData - Data for the stock's price graph.
 * @returns {JSX.Element} - Rendered component.
 */
const StockContainer = ({stockData}) => {
    const {logo, ticker, companyName, percentageChange, graphData} = stockData;
    const navigation = useNavigation();

    // Navigate to the Predict screen and pass data as route params
    const handlePredict = () => {
        navigation.navigate('PredictScreen', {
            ticker: ticker,
            companyName: companyName,
            percentageChange: percentageChange,
            graphData: graphData,
        });
    };

    return (
        <View style={styles.StockContainer}>
            {/* Left Container */}
            <View style={styles.leftContainer}>
                <Image source={{uri: logo}} style={styles.logo}/>
                <View style={styles.details}>
                    <Text style={styles.stockName}>{ticker}</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                    <Text style={{fontSize: 14, color: percentageChange >= 0 ? 'green' : 'red'}}>
                        {percentageChange + '%'}
                    </Text>
                </View>
            </View>

            {/* Middle Container */}
            <View style={styles.middleContainer}>
                {/* Render the curved line chart */}
                <CurvedLineChart data={graphData}/>
            </View>

            {/* Right Container */}
            <View style={styles.rightContainer}>
                <Button onPress={handlePredict} color={'#f8adb3'} title={"Predict"}/>
            </View>

        </View>
    );
};

// Styles for the StockContainer component
const styles = StyleSheet.create({
    StockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderColor: '#ccc',
        marginTop: 15,
        backgroundColor: '#21262f',
        marginLeft: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    leftContainer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
        resizeMode: 'contain',
    },
    details: {
        flex: 1,
    },
    stockName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    companyName: {
        fontSize: 14,
        color: '#8a8c90',
    },
    middleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightContainer: {
        flex: 1,
    },
});

export default  StockContainer;
