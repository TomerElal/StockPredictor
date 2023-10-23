import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import NavigationBar from "../components/NavigationBar";
import StockList from "../components/StockList";
import FontLoader from "../utils/FontLoader";
import {FetchStockData} from "../utils/FetchStockData";
import Loading from "./Loading";
import StockContainer from "../components/StockContainer";
function Home() {
    const [userSearchedStock, setUserSearchedStock] = useState(false);
    const [searchedStockData, setSearchedStockData] = useState({})
    const [loading, setLoading] = useState(false);

    const handleSearchSubmit = async (searchedStock) => {
        if(searchedStock){
            setUserSearchedStock(true);
            setLoading(true);
            const stockPromises = FetchStockData(searchedStock.toUpperCase(), '5m')
            const stocksData = await stockPromises;
            setLoading(false);
            setSearchedStockData(stocksData)
        }
    };

    function handleHomeReturnPress(){
        setUserSearchedStock(false);
    }

    if (loading) {return (<Loading/>);}

    return (
        <FontLoader>
            <SafeAreaView style={styles.container}>
                <NavigationBar onSearchSubmit={handleSearchSubmit} onHomeReturn={handleHomeReturnPress}/>
                {userSearchedStock?
                    (<>
                        <StockContainer stockData={searchedStockData}/>
                        <TouchableOpacity onPress={handleHomeReturnPress} style={styles.HomeButton}>
                            <Text style={{color: "#f8adb3", fontSize:20}}>Home</Text>
                        </TouchableOpacity>
                    </>
                        )
                    :
                    (<View style={{flex: 1}}>
                        <StockList/>
                    </View>)
                }
            </SafeAreaView>
        </FontLoader>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Set the background color of the app
    },
    HomeButton:{
        marginTop: 50,
        alignItems: 'center',
    }
});
export default Home;