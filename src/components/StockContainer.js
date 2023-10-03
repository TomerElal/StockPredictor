import React from 'react';
import {View, Text, Image, StyleSheet, Button} from 'react-native';
import CurvedLineChart from "../utils/CurvedLineChart";

const StockContainer = ({ stockData }) => {
    // Extract stock data from props
    const { logo, ticker, companyName, percentageChange, graphData } = stockData;

    return (
        <View style={styles.container}>
            {/* Left side */}
            <View style={styles.leftContainer}>
                <Image source={{ uri: logo }} style={[styles.logo, { resizeMode: 'contain' }]} />
                <View style={styles.details}>
                    <Text style={styles.stockName}>{ticker}</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                    <Text style={styles.percentageChange}>{percentageChange}</Text>
                </View>
            </View>

             {/*Middle (Graph)*/}
            <View style={styles.middleContainer}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <CurvedLineChart data ={graphData}/>
                </View>
            </View>

            {/* Right side (for future content) */}
            <View style={styles.rightContainer}>
                {/* Future content goes here */}
                <Button title="Predict" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginTop: 10,
        backgroundColor:'#262d3b',
        marginLeft: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    leftContainer: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',

    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    details: {
        flex: 1,
    },
    stockName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    companyName: {
        fontSize: 14,
        color: '#555',
    },
    percentageChange: {
        fontSize: 14,
        color: 'green', // You can adjust the color based on positive/negative percentage change
    },
    middleContainer: {
        flex: 1, // Adjust the width as needed
        alignItems: 'center',

        // Add styles for your graph component here
    },
    rightContainer: {
        // Add styles for the right side (future content) here
    },
});

export default StockContainer;
