import React from 'react';
import {SafeAreaView, Text, View, StyleSheet, ScrollView} from "react-native";

function StockPredictionDescription({route, navigation}) {
    const stockFundamentalData = route.params.stockFundamentalData;
    const companyName = route.params.companyName;
    return (
        <SafeAreaView style={{justifyContent: 'center', flex: 1, backgroundColor: '#21262f',}}>
            <Text style={{color: '#B9BBB6', fontSize: 18, padding: 7, paddingTop: 20, alignSelf:'center', fontFamily:'descriptionFont'}}>
                The stock prediction is carried out using machine learning with an algorithm known as Random Forest.
                The machine learning model was trained using fundamental information from thousands of stocks over
                the years. The main features on which the fundamental analysis is based are the company's growth
                features from the last calendar year compared to the current time period, among the features you can
                find: growth in profits, growth in revenues, growth in the company's free cash, growth in reducing
                the amount of the company's shares, the company's liabilities against assets and
                a profit multiplier P/E.{'\n'}</Text>
            <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center'}}>
                <Text style={{textAlign: 'center', padding:10, paddingTop:0,
                    fontSize: 26, color: 'white', paddingBottom: 20,}}>{companyName} -
                    Fundamental Data :</Text>
                <View style={styles.TextContainer}>
                    <Text style={styles.Text}>Revenue Growth: </Text>
                    <Text style={[styles.Text, {color: '#eb5779'}]}>{stockFundamentalData[0]}%</Text>
                </View>
                <View style={styles.TextContainer}>
                    <Text style={styles.Text}>Net Income Growth: </Text>
                    <Text style={[styles.Text, {color: '#eb5779'}]}>{stockFundamentalData[1]}%</Text>
                </View>
                <View style={styles.TextContainer}>
                    <Text style={styles.Text}>Profit Margin Growth: </Text>
                    <Text style={[styles.Text, {color: '#eb5779'}]}>{stockFundamentalData[2]}%</Text>
                </View>
                <View style={styles.TextContainer}>
                    <Text style={styles.Text}>Free Cash Flow Growth: </Text>
                    <Text style={[styles.Text, {color: '#eb5779'}]}>{stockFundamentalData[3]}%</Text>
                </View>
                <Text style={[styles.Text, {paddingLeft: 10, paddingTop: 10,}]}>Common Stock Shares Outstanding </Text>
                <View style={[styles.TextContainer, {padding: 0, paddingLeft: 10, paddingBottom: 10,}]}>
                    <Text style={styles.Text}>Growth: </Text>
                    <Text style={[styles.Text, {color: '#eb5779'}]}>{stockFundamentalData[4]}%</Text>
                </View>
                <View style={styles.TextContainer}>
                    <Text style={styles.Text}>Assets vs Liabilities Growth: </Text>
                    <Text style={[styles.Text, {color: '#eb5779'}]}>{stockFundamentalData[5]}%</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    Text: {
        color: '#f8adb3',
        fontSize: 20,
        fontFamily: 'titleFont',
    },
    TextContainer: {
        flexDirection: 'row',
        padding: 7,

    }
})
export default StockPredictionDescription;