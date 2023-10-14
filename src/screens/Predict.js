import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import PointerAreaChart from "../utils/PointerAreaChart";

const Predict = ({route, navigation}) => {
    const {ticker, companyName, percentageChange, graphData} = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <PointerAreaChart props={{dailyData: graphData, changePercentage: percentageChange}}/>
            <Button title="Close" onPress={() => navigation.goBack()} color={'#f8adb3'}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#21262f',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        color: 'white',
    },
});

export default Predict;
