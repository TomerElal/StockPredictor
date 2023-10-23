import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import PointerAreaChart from "../utils/PointerAreaChart";
import ActivatePrediction from "../utils/ActivatePrediction";

const Predict = ({route, navigation}) => {
    const {ticker, companyName, percentageChange, graphData, currency, exchDisp} = route.params;
    const openPrice = graphData[0].y.toFixed(2);
    const closePrice = graphData[graphData.length - 1].y.toFixed(2);
    const yValues = graphData.map(item => item.y);
    const minVal = Math.min(...yValues);
    const maxVal = Math.max(...yValues);
    return (
        <SafeAreaView style={styles.container}>
            <View style={{paddingRight: 100 , paddingTop: 20, paddingBottom:5}}>
                <View style={styles.header}>
                    <Text style={styles.stockName}>{ticker}</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                </View>
                <View style={styles.mainPrices}>
                    <View style={styles.priceInfo}>
                        <Text style={styles.price}>{openPrice}</Text>
                        <Text style={styles.PriceText}>Open</Text>
                    </View>
                    <View style={styles.priceInfo}>
                        <Text style={styles.price}>{closePrice}</Text>
                        <Text style={styles.PriceText}>Close</Text>
                    </View>
                    <View style={styles.priceInfo}>
                        <Text style={styles.price}>{maxVal.toFixed(2)}</Text>
                        <Text style={styles.PriceText}>High</Text>
                    </View>
                    <View style={styles.priceInfo}>
                        <Text style={styles.price}>{minVal.toFixed(2)}</Text>
                        <Text style={styles.PriceText}>Low</Text>
                    </View>
                </View>
                <View style={{padding: 10, flexDirection: "row"}}>
                    <Text style={{fontSize: 14, color: 'gray'}}>{exchDisp} ◦ </Text>
                    <Text style={{fontSize: 14, color: 'gray'}}>{currency}</Text>
                </View>
            </View>
            <ActivatePrediction ticker={ticker}/>
            <PointerAreaChart props={{dailyData: graphData, changePercentage: percentageChange,
                                      maxVal: maxVal, minVal: minVal}}/>
            <Button title="Close" onPress={() => navigation.goBack()} color={'#f8adb3'}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#21262f',
    },
    header: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
    stockName: {
        color: 'white',
        fontSize: 28,
        paddingBottom: 5
    },
    companyName: {
        color: 'gray',
        fontSize: 16,
        padding: 8,
        marginTop: 4,
    },
    mainPrices: {
        paddingTop: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
        flexDirection: 'row',

    },
    priceInfo: {
        borderRightWidth: 0.5,
        borderRightColor: 'gray',
        padding: 10,
        borderBottomRightRadius: 20,
    },
    price: {
        color: 'white',
        fontSize: 20,

    },
    PriceText: {
        color: 'gray',
        fontSize: 14,
        padding: 6,
    }

});

export default Predict;
