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
    const NavigationBarRef = React.useRef();
    const StockContainerRef = React.useRef();
    const [userStocks, setUserStocks] = useState([]);
    const [loadingCustomStocks, setLoadingCustomStocks] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [userAddingStocks, setUserAddingStocks] = useState(false);
    const [showLoadDefaultButton, setShowLoadDefaultButton] = useState(true);

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
                const customStocksJson = await AsyncStorage.getItem('userStocks');
                if (customStocksJson) {
                    await setUserStocks(JSON.parse(customStocksJson));
                    setLoadingCustomStocks(false);

                } else {
                    // Save the default custom stocks in AsyncStorage
                    setUserStocks(stocks)
                    await AsyncStorage.setItem('userStocks', JSON.stringify(stocks));
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
        const handleAddToWatchlist = (symbol) => {
            handleStocksAdd(symbol);
        };

        const handleRemoveFromWatchlist = (symbol) => {
            handleStockDelete(symbol);
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
    }, [userStocks, userSearchedStock]);

    const handleStockDelete = async (symbol) => {
        const updatedCustomStocks = [...userStocks];
        const index = updatedCustomStocks.indexOf(symbol);
        if (index !== -1) {
            updatedCustomStocks.splice(index, 1); // Remove the stock
        }
        setUserStocks(updatedCustomStocks);
        console.log(symbol, 'removed')
        setStocksData(stocksData.filter(item => item.ticker !== symbol));
        setShowLoadDefaultButton(true);
        // Save the updated custom stocks in AsyncStorage
        await AsyncStorage.setItem('userStocks', JSON.stringify(updatedCustomStocks));
    };
    const handleStocksAdd = async (symbolsToAdd) => {
        const updatedCustomStocks = [...userStocks];
        setUserAddingStocks(false);
        for (const symbol of symbolsToAdd) {
            if (!updatedCustomStocks.includes(symbol)) {
                updatedCustomStocks.unshift(symbol); // Add the stock
            }
        }

        await setUserStocks(updatedCustomStocks);

        const stockPromises = symbolsToAdd.map((symbol) => FetchStockData(symbol, '5m'));
        const newStockData = await Promise.all(stockPromises);

        console.log('Added stocks:', symbolsToAdd);

        setStocksData([...newStockData, ...stocksData]); // Add the new data to the existing data
        setShowLoadDefaultButton(true);
        // Save the updated custom stocks in AsyncStorage
        await AsyncStorage.setItem('userStocks', JSON.stringify(updatedCustomStocks));

    };


    const handleEditWatchlist = () => {
        setIsEditMode(!isEditMode);
    }

    const toggleModal = () => {
        setUserAddingStocks(!userAddingStocks);
    };
    const handleStockOrderChange = (data) => {
        // Update the order of stocks based on user's interaction
        setUserStocks(data.map((item) => item.ticker));
    };

    const handleStockOrderSave = async () => {
        // Save the updated order of stocks to AsyncStorage
        await AsyncStorage.setItem('userStocks', JSON.stringify(userStocks));
    };

    // Return a cleanup function to save the stock order when the component unmounts
    useEffect(() => {
        return () => {
            handleStockOrderSave();
        };
    }, [userStocks]);

    const loadDefaultStockList = async () => {
        setLoading(true);
        const defaultStockList = stocks;
        setUserStocks(defaultStockList);
        const stockPromises = defaultStockList.map((ticker) => FetchStockData(ticker, '5m'));
        const stocksData = await Promise.all(stockPromises);
        await AsyncStorage.setItem('userStocks', JSON.stringify(defaultStockList));
        setStocksData(stocksData);
        setLoading(false);
        setShowLoadDefaultButton(false);
    };

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
                                                <AddStocksModal onAddStocks={handleStocksAdd}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                        </>) : (<></>)}

                    {userSearchedStock ?
                        (<SearchedStock searchedStockData={searchedStockData}
                                        handleHomeReturnPress={handleHomeReturnPress}
                                        userStocks={userStocks}/>)
                        :
                        (
                            <DraggableFlatList
                                onScrollBeginDrag={() => callNavigationBarChildFunction("closeKeyboard")}
                                ref={flatListRef}
                                data={stocksData}
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
                                            ref={StockContainerRef}/>
                                            {getIndex() === userStocks.length - 1 && showLoadDefaultButton ? <View>
                                                <TouchableOpacity onPress={loadDefaultStockList} style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 10,
                                                    marginBottom: isEditMode ? 50 : 0,
                                                }}>
                                                    <Text style={{
                                                        color: '#f8adb3',
                                                        fontSize: 22,
                                                        fontFamily: 'titleFont'
                                                    }}>Load Default StockList</Text>
                                                </TouchableOpacity>
                                            </View> : <></>}</>
                                    )
                                }}
                                onDragEnd={({data}) => setStocksData(data)}
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        width: 300, // Customize the width of the panel
        height: 150, // Customize the width of the panel
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