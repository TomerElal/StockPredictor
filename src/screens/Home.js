import React, {useEffect, useRef, useState} from 'react';
import {
    LayoutAnimation, Modal,
    Platform, RefreshControl,
    SafeAreaView,
    StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback,
    UIManager, View
} from "react-native";
import FontLoader from "../utils/FontLoader";
import {FetchStockData} from "../utils/FetchStockData";
import Loading from "./Loading";
import SearchedStock from "./SearchedStock";
import NavigationBar from "../components/NavigationBar";
import StockContainer from "../components/StockContainer";
import stocks from "../utils/stocks.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import AddStocksModal from "../components/AddStocksModal";
import DraggableFlatList from 'react-native-draggable-flatlist';
import SearchStocks from "../utils/SearchStocks";
import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function LoadDefaultStocks(props) {
    return <View style={{flex: 1, justifyContent: 'center'}}>
        <TouchableOpacity onPress={props.onPress} style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            marginBottom: props.editMode ? 50 : 0,
        }}>
            <Text style={{
                color: "#f8adb3",
                fontSize: 22,
                fontFamily: "titleFont"
            }}>Load Default StockList</Text>
        </TouchableOpacity>
    </View>;
}

function Home() {
    const [userSearchedStock, setUserSearchedStock] = useState(false);
    const [searchedStockData, setSearchedStockData] = useState({})
    const [loading, setLoading] = useState(false);
    const [stocksData, setStocksData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);
    const NavigationBarRef = React.useRef();
    const [userStocks, setUserStocks] = useState([]);
    const [loadingCustomStocks, setLoadingCustomStocks] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [userAddingStocks, setUserAddingStocks] = useState(false);
    const [showLoadDefaultButton, setShowLoadDefaultButton] = useState(true);
    const [isPriceDisplay, setIsPriceDisplay] = useState(false);
    const [userClickedStock, setUserClickedStock] = useState(false);
    const [flag, setFlag] = useState(false);
    const [currentCurrency, setCurrentCurrency] = useState('USD');
    const [currentExchangeRate, setCurrentExchangeRate] = useState(1);

    const handleRefresh = async () => {
        setRefreshing(true);
        const stockPromises = userStocks.map((ticker) => FetchStockData(ticker, '5m'));
        const stocksData = await Promise.all(stockPromises);
        const filteredStockData = stocksData.filter((data) => data !== null);
        setStocksData(filteredStockData);
        setRefreshing(false);
    };

    useEffect(() => {
        const loadCustomStocksData = async () => {
            try {
                const customStocksJson = await AsyncStorage.getItem('stocks');
                const stockList = JSON.parse(customStocksJson);
                if (customStocksJson && stockList.length > 0) {
                    await setUserStocks(stockList);
                    setLoadingCustomStocks(false);
                } else {
                    // Save the default custom stocks in AsyncStorage
                    setUserStocks(stocks)
                    await AsyncStorage.setItem('stocks', JSON.stringify(stocks));
                    setLoadingCustomStocks(false);
                }
            } catch (error) {
                console.error('Error loading user Stocks:', error);
            }
        };

        loadCustomStocksData();

    }, []);

    useEffect(() => {
        if (loadingCustomStocks) {
            return;
        }
        const fetchDefaultStocksData = async () => {
            setLoading(true);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            const stockPromises = userStocks.map((ticker) => FetchStockData(ticker, '5m'));
            const stocksData = await Promise.all(stockPromises);
            const filteredStockData = stocksData.filter((data) => data !== null);
            setStocksData(filteredStockData);
            setLoading(false);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        };
        fetchDefaultStocksData();
    }, [loadingCustomStocks]);
    const handleSearchSubmit = async (searchedStock) => {
        if (searchedStock) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsEditMode(false);
            setUserSearchedStock(true);
            setLoading(true);
            const matchedStocksData = await SearchStocks(searchedStock);
            setLoading(false);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSearchedStockData(matchedStocksData)
        }
    };

    function handleHomeReturnPress() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        setUserSearchedStock(false);
    }


    const callNavigationBarChildFunction = (order) => {
        if (order === "closeMenu") {
            NavigationBarRef.current.closeMenu();
        } else if (order === "closeKeyboard") {
            NavigationBarRef.current.closeKeyboard();
        }
    };

    useEffect(() => {
        const handleAddToWatchlist = async (symbol) => {
            await handleStocksAdd(symbol);
        };

        const handleRemoveFromWatchlist = async (symbol) => {
            await handleStockDelete(symbol);
        };

        const handleHomeReturn = () => {
            setUserSearchedStock(false);
        };

        // Add event listeners
        EventEmitter.on('addToWatchlistEvent', handleAddToWatchlist);
        EventEmitter.on('removeFromWatchlistEvent', handleRemoveFromWatchlist);
        EventEmitter.on('homeReturnEvent', handleHomeReturn);

        // Return a cleanup function to remove event listeners when the component unmounts
        return () => {
            EventEmitter.off('addToWatchlistEvent', handleAddToWatchlist);
            EventEmitter.off('removeFromWatchlistEvent', handleRemoveFromWatchlist);
            EventEmitter.off('homeReturnEvent', handleHomeReturn);
        };
    }, [userClickedStock]);

    const handleStockDelete = async (symbol) => {
        const updatedCustomStocks = [];
        userStocks.forEach((stock) => {
            if (stock !== symbol) {
                updatedCustomStocks.push(stock);
            }
        })
        await setUserStocks(updatedCustomStocks);
        await setStocksData(stocksData.filter(item => item.ticker !== symbol));
        setShowLoadDefaultButton(true);
        await AsyncStorage.setItem('stocks', JSON.stringify(updatedCustomStocks));
    };
    const handleStocksAdd = async (symbolsToAdd) => {
        const updatedCustomStocks = [...userStocks];
        setUserAddingStocks(false);
        const customStocksJson = await AsyncStorage.getItem('stocks');
        const stockList = JSON.parse(customStocksJson);
        const stocksDataList = stocksData.filter(item => stockList.includes(item.ticker));
        for (const symbol of symbolsToAdd) {
            if (!updatedCustomStocks.includes(symbol)) {
                updatedCustomStocks.unshift(symbol); // Add the stock
            }
        }
        setUserStocks(updatedCustomStocks);
        const stockPromises = symbolsToAdd.map((symbol) => FetchStockData(symbol, '5m'));
        const newStockData = await Promise.all(stockPromises);
        await setStocksData([...newStockData, ...stocksDataList]);
        setShowLoadDefaultButton(true);
        // Save the updated custom stocks in AsyncStorage
        await AsyncStorage.setItem('stocks', JSON.stringify(updatedCustomStocks));
    };


    const handleEditWatchlist = () => {
        setIsEditMode(!isEditMode);
    }

    const toggleModal = () => {
        setUserAddingStocks(!userAddingStocks);
    };
    const handleStockOrderChange = async (data) => {
        // Update the order of stocks based on user's interaction
        setStocksData(data);
        const newOrder = data.map((item) => item.ticker)
        await setUserStocks(newOrder);
        setFlag(!flag);
    };
    useEffect(() => {
        const handleStockOrderSave = async () => {
            // Update the order of stocks based on user's interaction
            setStocksData(stocksData);
            await setUserStocks(userStocks);
            await AsyncStorage.setItem('stocks', JSON.stringify(userStocks));
        };
        handleStockOrderSave();
    }, [flag]);

    const loadDefaultStockList = async () => {
        setLoading(true);
        const defaultStockList = stocks;
        setUserStocks(defaultStockList);
        const stockPromises = defaultStockList.map((ticker) => FetchStockData(ticker, '5m'));
        const stocksData = await Promise.all(stockPromises);
        await AsyncStorage.setItem('stocks', JSON.stringify(defaultStockList));
        setStocksData(stocksData);
        setLoading(false);
        setShowLoadDefaultButton(false);
    };

    function handlePriceOrChangeDisplay() {
        setIsPriceDisplay(!isPriceDisplay)
    }

    async function handleChangeCurrency(currency) {
        const exchangeFromUSDtoCurrencyUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=${currency}&apikey=NEYJGBOIAFMI8XSV`;

        try {
            const [exchangeFromUSDtoCurrencyResponse] = await Promise.all([
                fetch(exchangeFromUSDtoCurrencyUrl).then((response) => response.json()),
            ]);
            const exchangeRate = exchangeFromUSDtoCurrencyResponse["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
            setCurrentCurrency(currency);
            setCurrentExchangeRate(exchangeRate)
        } catch (error) {
            return null;
        }
    }

    function handleUserClickedStock() {
        setUserClickedStock(!userClickedStock)
    }

    if (loading) {
        return (<Loading/>);
    }

    return (
        <FontLoader>
            <SafeAreaView style={styles.container}>
                <NavigationBar onSearchSubmit={handleSearchSubmit}
                               onHomeReturn={handleHomeReturnPress}
                               flatListRef={flatListRef}
                               boolIsHomeScreen={!userSearchedStock}
                               onEditWatchlist={handleEditWatchlist}
                               isEditMode={isEditMode}
                               onPriceOrChangeDisplay={handlePriceOrChangeDisplay}
                               onChangeCurrency={handleChangeCurrency}
                               isPriceDisplay={isPriceDisplay}
                               ref={NavigationBarRef}/>
                <View style={styles.container} onTouchStart={() => callNavigationBarChildFunction("closeMenu")}>
                    {(isEditMode) ?
                        (<>
                            <TouchableOpacity onPress={() => setUserAddingStocks(true)}
                                              style={{alignItems: 'center', padding: 20,}}>
                                <Text style={{fontFamily: "titleFont", color: '#eb5779', fontSize: 20}}>Add
                                    Stocks</Text>
                            </TouchableOpacity>
                            <Modal animationType="fade"
                                   transparent={true}
                                   visible={userAddingStocks}
                                   onRequestClose={toggleModal}>
                                <TouchableWithoutFeedback onPress={toggleModal}>
                                    <View style={styles.modalContainer}>
                                        <TouchableWithoutFeedback>
                                            <View style={styles.modalContent}>
                                                <AddStocksModal onAddStocks={handleStocksAdd} userStocks={userStocks}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                        </>) : (<></>)}

                    {userSearchedStock ?
                        (<SearchedStock searchedStockData={searchedStockData}
                                        handleHomeReturnPress={handleHomeReturnPress}
                                        userStocks={userStocks}
                                        isPriceDisplay={isPriceDisplay}
                                        currency={currentCurrency}
                                        onUserClickedStock={handleUserClickedStock}
                                        exchangeRate={currentExchangeRate}/>)
                        : <></>}
                    {stocksData.length > 0 && !userSearchedStock ?
                        <>
                            <DraggableFlatList
                                onScrollBeginDrag={() => callNavigationBarChildFunction("closeKeyboard")}
                                ref={flatListRef}
                                data={stocksData}
                                onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                keyExtractor={(item) => item.ticker}
                                renderItem={({item, getIndex, drag, isActive}) => {
                                    return (<><StockContainer
                                            stockData={item}
                                            isEditMode={isEditMode}
                                            onDeleteStock={handleStockDelete}
                                            index={getIndex}
                                            userStocks={userStocks}
                                            drag={drag}
                                            isActice={isActive}
                                            showLoadDefaultButton={showLoadDefaultButton}
                                            isPriceDisplay={isPriceDisplay}
                                            currency={currentCurrency}
                                            exchangeRate={currentExchangeRate}
                                            onUserClickedStock={handleUserClickedStock}
                                        />
                                            {getIndex() === userStocks.length - 1 && showLoadDefaultButton ?
                                                <LoadDefaultStocks onPress={loadDefaultStockList}
                                                                   editMode={isEditMode}/> : <></>}</>
                                    )
                                }}
                                onDragEnd={({data}) => handleStockOrderChange(data)}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={handleRefresh}
                                        tintColor="#f8adb3"
                                    />}
                            />
                            {userStocks.length === 0 ? <LoadDefaultStocks onPress={loadDefaultStockList}
                                                                          editMode={isEditMode}/> : <></>}
                        </>
                        : <></>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        width: 330, // Customize the width of the panel
        height: 180, // Customize the width of the panel
        backgroundColor: '#21262f', // Customize the background color
        borderRadius: 10, // Add rounded corners for decoration
        padding: 20,
        justifyContent: 'center',
        alignContent: 'center',
    },
    loadDefaultButton: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#eb5779',

    },
    loadDefaultButtonText: {
        fontFamily: 'titleFont',
        color: '#fff',
        fontSize: 20,
        alignContent: 'center',
        justifyContent: 'center',
    },
});
export default Home;