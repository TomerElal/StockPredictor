import React, {useEffect, useRef, useState} from 'react';
import {
    FlatList,
    LayoutAnimation,
    Platform, RefreshControl,
    SafeAreaView,
    StyleSheet,
    UIManager, View
} from "react-native";
import FontLoader from "../utils/FontLoader";
import {FetchStockData} from "../utils/FetchStockData";
import Loading from "./Loading";
import SearchedStock from "../components/SearchedStock";
import NavigationBar from "../components/NavigationBar";
import StockContainer from "../components/StockContainer";
import stocks from "../utils/stocks.json";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
function Home() {
    const [userSearchedStock, setUserSearchedStock] = useState(false);
    const [searchedStockData, setSearchedStockData] = useState({})
    const [loading, setLoading] = useState(false);
    const [stocksData, setStocksData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);
    const childRef = React.useRef();

    const handleRefresh = async () => {
        setRefreshing(true);
        const stockPromises = stocks.map((ticker) => FetchStockData(ticker, '5m'));
        const stocksData = await Promise.all(stockPromises);
        const filteredStockData = stocksData.filter((data) => data !== null);
        setStocksData(filteredStockData);
        setRefreshing(false);
    };

    useEffect(() => {
        const fetchAllStockData = async () => {
            setLoading(true);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            const stockPromises = stocks.map((ticker) => FetchStockData(ticker, '5m'));
            const stocksData = await Promise.all(stockPromises);
            const filteredStockData = stocksData.filter((data) => data !== null);
            setStocksData(filteredStockData);
            setLoading(false);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        };
        fetchAllStockData();
    }, []);
    const handleSearchSubmit = async (searchedStock) => {
        if(searchedStock){
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setUserSearchedStock(true);
            setLoading(true);
            const stockPromises = FetchStockData(searchedStock.toUpperCase(), '5m')
            const stocksData = await stockPromises;
            setLoading(false);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSearchedStockData(stocksData)
        }
    };

    function handleHomeReturnPress(){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        setUserSearchedStock(false);
    }


    const callChildFunction = () => {
        childRef.current.closeMenu();
    };

    if (loading) {return (<Loading/>);}

    return (
        <FontLoader>
            <SafeAreaView style={styles.container}>
                <NavigationBar onSearchSubmit={handleSearchSubmit}
                               onHomeReturn={handleHomeReturnPress}
                               flatListRef={flatListRef}
                               boolIsHomeScreen={!userSearchedStock}
                               ref={childRef}/>
                <View style={styles.container} onTouchStart={callChildFunction}>
                    {userSearchedStock?
                        (<SearchedStock searchedStockData={searchedStockData}
                                        handleHomeReturnPress={handleHomeReturnPress}/>)
                        :
                        (<FlatList
                            ref={flatListRef}
                            data={stocksData}
                            keyExtractor={(item) => item.ticker}
                            renderItem={({item}) => <StockContainer stockData={item}/>}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    tintColor="#f8adb3"
                                />}
                        />)
                    }
                </View>
            </SafeAreaView>
        </FontLoader>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Set the background color of the app
    },
});
export default Home;