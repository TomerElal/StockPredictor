import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PointerAreaChart from '../components/PointerAreaChart';
import EventEmitter from 'react-native-eventemitter';
import Icon from 'react-native-vector-icons/FontAwesome5';
import convertDataToGraphData from '../utils/ConvertDataToLineChartData';

const dimensions = Dimensions.get('window');

/**
 * StockDetails component displays detailed information about a stock.
 *
 * @component
 * @param {object} route - The route parameters passed to the component.
 * @param {object} navigation - The navigation object.
 * @returns {JSX.Element} - Rendered component.
 */
const StockDetails = ({ route, navigation }) => {
    const {
        ticker,
        companyName,
        percentageChange,
        graphData,
        currency,
        currencySymbol,
        exchDisp,
        companyDescription,
        userStocks,
        exchangeRate
    } = route.params;
    const [isTickerInWatchlist, setIsTickerInWatchlist] = useState(userStocks.includes(ticker));
    const yValues = graphData.map(item => item.y * exchangeRate);
    const modifiedData = graphData.map(item => ({
        ...item,
        y: item.y * exchangeRate
    }));
    const [currGraphData, setCurrGraphData] = useState(modifiedData);
    const [currMinVal, setCurrMinVal] = useState(Math.min(...yValues));
    const [currMaxVal, setCurrMaxVal] = useState(Math.max(...yValues));
    const [currOpenPrice, setCurrOpenPrice] = useState((modifiedData[0].y).toFixed(2));
    const [currClosePrice, setCurrClosePrice] = useState((modifiedData[modifiedData.length - 1].y).toFixed(2));
    const [currRange, setCurrRange] = useState('1d');
    const [currPercentageChange, setCurrPercentageChange] = useState(percentageChange);
    const [loading, setLoading] = useState(false);
    const [descriptionLayoutSize, setDescriptionLayoutSize] = useState(0);
    const [scrollLayoutSize, setScrollLayoutSize] = useState(0);
    const [isScrollable, setIsScrollable] = useState(true);

    useEffect(() => {
        setIsScrollable(descriptionLayoutSize > scrollLayoutSize);
    }, [descriptionLayoutSize, scrollLayoutSize]);

    const handleAddToWatchlist = () => {
        EventEmitter.emit('addToWatchlistEvent', [ticker]);
        setIsTickerInWatchlist(!isTickerInWatchlist);
    };

    const handleRemoveFromWatchlist = () => {
        EventEmitter.emit('removeFromWatchlistEvent', ticker);
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
            const modifiedData = currGraphData.map(item => ({
                ...item,
                y: item.y * exchangeRate
            }));
            setCurrRange(range);
            setCurrGraphData(modifiedData);
            setCurrMinVal(Math.min(...yValues));
            setCurrMaxVal(Math.max(...yValues));
            const closePrices = graphDataResponse["chart"]["result"][0]["indicators"]["quote"][0]["close"];
            const newPercentageChange = (closePrices[closePrices.length - 1] - closePrices[0]) / closePrices[0] * 100;
            setCurrPercentageChange(newPercentageChange);
            setCurrOpenPrice((closePrices[0] * exchangeRate).toFixed(2));
            setCurrClosePrice((closePrices[closePrices.length - 1] * exchangeRate).toFixed(2));
        } catch (error) {
            return null;
        }
        setLoading(false);
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                isTickerInWatchlist ? (
                    <TouchableOpacity onPress={handleRemoveFromWatchlist} style={{ flexDirection: 'row', marginRight: 10, }}>
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
                <TouchableOpacity onPress={handleHomeReturn} style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                    <Icon name={'chevron-left'} color={'#f8adb3'} size={(dimensions.width + dimensions.height) > 1200 ? 24 : 22} style={{ paddingLeft: 10, paddingRight: 7, paddingBottom: Platform.OS === 'ios' ? 5 : 0, }} allowFontScaling={true} />
                    <Text style={styles.headerButtons}>Home</Text>
                </TouchableOpacity>
            ),
        });
    }, [isTickerInWatchlist, navigation]);

    const data = [
        { key: 'open', price: currOpenPrice, label: 'Open' },
        { key: 'close', price: currClosePrice, label: 'Close' },
        { key: 'high', price: (currMaxVal).toFixed(2), label: 'High' },
        { key: 'low', price: (currMinVal).toFixed(2), label: 'Low' },
        { key: 'change', price: Number(currPercentageChange).toFixed(2) + ' %', label: currRange + ' Change' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingRight: 15, paddingBottom: 5 }}>
                <View style={styles.header}>
                    <Text style={styles.stockName}>{ticker}</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                </View>
                <View style={styles.mainPrices}>
                    <FlatList
                        data={data}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <View style={styles.priceInfo}>
                                <Text style={styles.price}>{item.price}</Text>
                                <Text style={styles.PriceText}>{item.label}</Text>
                            </View>}
                        keyExtractor={(item) => item.key}
                    />
                </View>
                <View style={{ padding: 10, paddingBottom: 0, flexDirection: "row" }}>
                    <Text style={styles.currencyAndExchangeDisp}>{exchDisp} ◦ </Text>
                    <Text style={styles.currencyAndExchangeDisp}>{currency}</Text>
                </View>
            </View>
            <ScrollView scrollEnabled={isScrollable} onLayout={(event) => setScrollLayoutSize(event.nativeEvent.layout.height)} contentContainerStyle={{ flexGrow: 1, alignContent: 'center', justifyContent: 'center', }}>
                <View onLayout={(event) => setDescriptionLayoutSize(event.nativeEvent.layout.height)}>
                    <Text style={{ color: 'white', paddingLeft: 10, }}>
                        {companyDescription}
                    </Text>
                </View>
            </ScrollView>
            <View style={{
                height: 40,
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
                alignSelf: 'center'
            }}>
                <FlatList
                    data={[
                        { range: '1d', interval: '5m' },
                        { range: '5d', interval: '30m' },
                        { range: '1mo', interval: '90m' },
                        { range: '6mo', interval: '1d' },
                        { range: 'ytd', interval: '1d' },
                        { range: '1y', interval: '1wk' },
                        { range: '2y', interval: '1wk' },
                        { range: '5y', interval: '1mo' },
                        { range: 'max', interval: '3mo' }
                    ]}
                    horizontal={true}
                    style={{ width: dimensions.width, }}
                    keyExtractor={(item) => item.range}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => changeGraphRange(item.range, item.interval)} style={{
                                borderRightWidth: 1,
                                borderTopRightRadius: 10,
                                borderRightColor: 'white',
                                justifyContent: 'center',
                                paddingTop: dimensions.height > 800 ? 5 : 0,
                            }}>
                                <Text style={{
                                    color: currRange === item.range ? '#eb5779' : '#f8adb3',
                                    shadowRadius: 5,
                                    shadowOpacity: currRange === item.range ? 0.8 : 0,
                                    shadowColor: "#eb5779",
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    elevation: currRange === item.range ? 5 : 0,
                                    fontFamily: 'titleFont',
                                    fontSize: (dimensions.width + dimensions.height) > 1200 ? 22 : 20,
                                    paddingRight: 10,
                                    paddingLeft: 10,
                                }}>{item.range}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
            {loading ?
                <View style={{ paddingTop: 50, paddingBottom: 80, alignItems: 'center', justifyContent: 'center', }}>
                    <ActivityIndicator size="large" color="#f8adb3" />
                    <Text style={{ color: 'white', fontFamily: 'titleFont', fontSize: 24, padding: 30 }}>Loading...</Text>
                </View>
                : <PointerAreaChart props={{
                    dailyData: currGraphData, changePercentage: currPercentageChange,
                    maxVal: currMaxVal, minVal: currMinVal, range: currRange, currencySymbol: currencySymbol
                }} />}
            <Button title="Close" onPress={() => navigation.goBack()} color={'#f8adb3'} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#21262f',
        justifyContent: 'center',
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
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 28 : 26,
        paddingBottom: 5
    },
    companyName: {
        color: 'gray',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 16 : 14,
        padding: 8,
        marginTop: 4,
    },
    mainPrices: {
        paddingTop: dimensions.height > 800 ? 12 : 8,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
        flexDirection: 'row',
    },
    priceInfo: {
        borderRightWidth: 0.5,
        borderRightColor: 'gray',
        padding: 10,
        borderBottomRightRadius: 20,
        alignItems: 'center'
    },
    price: {
        color: 'white',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 18 : 16,
    },
    PriceText: {
        color: 'gray',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 14 : 12,
        padding: 6,
    },
    headerButtons: {
        color: '#f8adb3',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 20 : 18,
        fontFamily: 'titleFont',
    },
    currencyAndExchangeDisp: {
        color: 'gray',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 14 : 12,
    },
});

export default StockDetails;
