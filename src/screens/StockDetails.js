import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PointerAreaChart from "../components/PointerAreaChart";
import EventEmitter from 'react-native-eventemitter';
import Icon from "react-native-vector-icons/FontAwesome5";
import {CalculatePercentChange} from "../utils/CalculatePercentChange";
import convertDataToGraphData from "../utils/ConvertDataToLineChartData";
import convertDataToLineChartData from "../utils/ConvertDataToLineChartData";

const StockDetails = ({route, navigation}) => {
    const {
        ticker,
        companyName,
        percentageChange,
        graphData,
        currency,
        exchDisp,
        companyDescription,
        userStocks,
        exchangeRate
    } = route.params;
    const [isTickerInWatchlist, setIsTickerInWatchlist] = useState(userStocks.includes(ticker));
    const [isTickerRemovedOrAdded, setIsTickerRemovedOrAdded] = useState(false);
    const yValues = graphData.map(item => item.y * exchangeRate);
    const modifiedData = graphData.map(item => ({
        ...item,
        y: item.y * exchangeRate
    }));
    const [currGraphData, setCurrGraphData] = useState(modifiedData);
    const [currMinVal, setCurrMinVal] = useState(Math.min(...yValues));
    const [currMaxVal, setCurrMaxVal] = useState(Math.max(...yValues));
    const [currOpenPrice, setCurrOpenPrice] = useState((graphData[0].y * exchangeRate).toFixed(2));
    const [currClosePrice, setCurrClosePrice] = useState((graphData[graphData.length - 1].y * exchangeRate).toFixed(2));
    const [currRange, setCurrRange] = useState('1d');
    const [currPercentageChange, setCurrPercentageChange] = useState(percentageChange);
    const [loading, setLoading] = useState(false);

    const handleAddToWatchlist = () => {
        EventEmitter.emit('addToWatchlistEvent', [ticker]);
        setIsTickerRemovedOrAdded(true);
        setIsTickerInWatchlist(!isTickerInWatchlist);
    };
    const handleRemoveFromWatchlist = () => {
        EventEmitter.emit('removeFromWatchlistEvent', ticker);
        setIsTickerRemovedOrAdded(true);
        setIsTickerInWatchlist(!isTickerInWatchlist);
    };
    const handleHomeReturn = () => {
        EventEmitter.emit('homeReturnEvent');
        navigation.goBack();
    };

    async function changeGraphRange(range, interval) {
        setLoading(true);
        const graphDataUrl = `https://query1.finance.yahoo.com/v7/finance/chart/${ticker}?interval=${interval}&range=${range}`;
        try {
            const [graphDataResponse,] = await Promise.all([
                fetch(graphDataUrl).then((response) => response.json()),
            ]);
            const currGraphData = convertDataToGraphData(graphDataResponse);
            const yValues = currGraphData.map(item => item.y * exchangeRate);
            setCurrRange(range);
            setCurrGraphData(currGraphData);
            setCurrMinVal(Math.min(...yValues));
            setCurrMaxVal(Math.max(...yValues));
            const closePrices = graphDataResponse["chart"]["result"][0]["indicators"]["quote"][0]["close"];
            const newPercentageChange = (closePrices[closePrices.length - 1] - closePrices[0]) / closePrices[0] * 100;
            setCurrPercentageChange(newPercentageChange);
            setCurrOpenPrice(closePrices[0].toFixed(2));
            setCurrClosePrice(closePrices[closePrices.length - 1].toFixed(2));
        } catch (error) {
            return null;
        }
        setLoading(false);
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                isTickerInWatchlist ? (
                    <TouchableOpacity onPress={handleRemoveFromWatchlist} style={{flexDirection:'row', marginRight:10,}}>
                        <Text style={styles.headerButtons}>Remove </Text>
                        <Text style={styles.headerButtons}>from Watchlist</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleAddToWatchlist}>
                        <Text style={styles.headerButtons}>Add to Watchlist</Text>
                    </TouchableOpacity>
                )
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={handleHomeReturn} style={{flexDirection:'row'}}>
                    <Icon name={'chevron-left'} color={'#f8adb3'} size={20} style={{padding:3, paddingRight:5}} allowFontScaling={true}/>
                    <Text style={styles.headerButtons}>Home</Text>
                </TouchableOpacity>
            ),
        });
    }, [isTickerInWatchlist, navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{paddingRight: 100, paddingTop: 10, paddingBottom: 5}}>
                <View style={styles.header}>
                    <Text style={styles.stockName}>{ticker}</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                </View>
                <View style={styles.mainPrices}>
                    <View style={styles.priceInfo}>
                        <Text style={styles.price}>{currOpenPrice}</Text>
                        <Text style={styles.PriceText}>Open</Text>
                    </View>
                    <View style={styles.priceInfo}>
                        <Text style={styles.price}>{currClosePrice}</Text>
                        <Text style={styles.PriceText}>Close</Text>
                    </View>
                    <View style={styles.priceInfo}>
                        <Text style={styles.price}>{(currMaxVal * exchangeRate).toFixed(2)}</Text>
                        <Text style={styles.PriceText}>High</Text>
                    </View>
                    <View style={styles.priceInfo}>
                        <Text style={styles.price}>{(currMinVal * exchangeRate).toFixed(2)}</Text>
                        <Text style={styles.PriceText}>Low</Text>
                    </View>
                </View>
                <View style={{padding: 10, flexDirection: "row"}}>
                    <Text style={{fontSize: 14, color: 'gray'}}>{exchDisp} ◦ </Text>
                    <Text style={{fontSize: 14, color: 'gray'}}>{currency}</Text>
                </View>
            </View>
            <Text style={{color: 'white', padding: 10}}>
                {companyDescription}
            </Text>
            <View style={{
                height: 40,
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
                maxWidth: 300,
                alignSelf: 'center'
            }}>
                <FlatList
                    data={[{range: '1d', interval: '5m'}, {range: '5d', interval: '30m'}, {
                        range: '1mo',
                        interval: '90m'
                    }, {range: '6mo', interval: '1d'}, {range: 'ytd', interval: '1d'}, {
                        range: '1y',
                        interval: '1wk'
                    }, {range: '2y', interval: '1wk'}, {range: '5y', interval: '1mo'}, {range: 'max', interval: '3mo'}]}
                    horizontal={true}
                    style={{width: 385, alignSelf: 'center', alignContent: 'center'}}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity onPress={() => changeGraphRange(item.range, item.interval)} style={{
                                borderRightWidth: 1,
                                borderTopRightRadius: 10,
                                borderRightColor: 'white',
                                alignContent: 'center',
                                marginRight: 10,
                            }}>
                                <Text style={{
                                    color: '#f8adb3',
                                    fontFamily: 'titleFont',
                                    fontSize: 22,
                                    padding: 10,
                                    alignContent: 'center'
                                }}>{item.range}</Text>
                            </TouchableOpacity>
                        )
                    }
                    }
                />
            </View>
            {loading ?
                <View style={{padding: 70, alignItems: 'center', justifyContent: 'center',}}>
                    <ActivityIndicator size="large" color="#f8adb3"/>
                    <Text style={{color: 'white', fontFamily: 'titleFont', fontSize: 24, padding: 30}}>Loading...</Text>
                </View>
                : <PointerAreaChart props={{
                    dailyData: currGraphData, changePercentage: currPercentageChange,
                    maxVal: currMaxVal, minVal: currMinVal, range: currRange
                }}/>}

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
    },
    headerButtons: {
        color: '#f8adb3',
        fontSize: 20,
        fontFamily: 'titleFont',
        marginTop: 5,
    },
});

export default StockDetails;
