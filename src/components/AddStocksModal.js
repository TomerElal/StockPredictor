import React, {useState} from 'react';
import {
    Button,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    LayoutAnimation,
    Platform, UIManager, ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function AddStocksModal({onAddStocks, userStocks}) {
    const [searchText, setSearchText] = useState('');
    const [stocksToAdd, setStocksToAdd] = useState([]);
    const [stocksToAddSize, setStocksToAddSize] = useState(0);
    const [loading, setLoading] = useState(false);
    const [displayInvalidInput, setDisplayInvalidInput] = useState('');

    async function checkStockInput(stock) {


        if (stock === '') {
            return {result: 'Empty input', isValid: false};
        }
        const matchStocksUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${stock}`;
        const [matchStocksResponse] = await Promise.all([
            fetch(matchStocksUrl).then((response) => response.json()),
        ]);
        let stockName = '';
        let stockCompany = '';
        if (matchStocksResponse["quotes"].length > 0) {
            stockName = matchStocksResponse["quotes"][0]["symbol"];
            if(matchStocksResponse["quotes"][0]["shortname"]){
                stockCompany = matchStocksResponse["quotes"][0]["shortname"].split(/[ ,]+/)[0].toUpperCase();
            }
        }
        if (stockName !== stock && stockCompany !== stock) {
            return {result: 'Stock does not exist', isValid: false};
        }
        if (stocksToAdd.includes(stockName)) {
            return {result: 'Stock already Added', isValid: false};
        }
        if (userStocks.includes(stockName)) {
            return {result: 'Stock already listed', isValid: false};
        }
        return {result: stockName, isValid: true};
    }

    async function handleSearchSubmit() {
        setDisplayInvalidInput('');
        setLoading(true);
        const inputResult = await checkStockInput(searchText);
        if (inputResult.isValid === true) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            const tmp = [...stocksToAdd];
            tmp.unshift(inputResult.result);
            setStocksToAdd(tmp);
            setStocksToAddSize(stocksToAddSize + 1);
        } else {
            setDisplayInvalidInput(inputResult.result);
        }
        setLoading(false);
        setSearchText('');
    }

    function deleteSymbol(symbol) {
        const updatedStocks = stocksToAdd.filter((stock) => stock !== symbol);
        setStocksToAdd(updatedStocks);
        setStocksToAddSize(stocksToAddSize - 1);
    }

    return (
        <View style={{alignItems: 'center', justifyContent: 'center', }}>
            <View
                style={{flexDirection: 'row', alignItems: 'center', alignContent:'center',justifyContent: 'space-between', marginBottom: 15}}>
                <TextInput
                    style={styles.searchBar}
                    placeholder={"Insert stock symbol/company"}
                    placeholderTextColor={'lightgray'}
                    value={searchText}
                    onChangeText={(text) => {
                        text = text.toUpperCase();
                        setDisplayInvalidInput('');
                        setSearchText(text)
                    }}
                    onSubmitEditing={handleSearchSubmit}
                    blurOnSubmit={false}
                    autoFocus={true}
                    keyboardAppearance="dark"
                    autoCapitalize="none"
                    returnKeyType="join"
                />
                {loading ?
                    <View>
                        <ActivityIndicator size="small" color="#f8adb3"/>
                    </View>
                    :
                    <TouchableOpacity onPress={handleSearchSubmit}>
                        <Text style={{color: 'white', fontSize: 16}}>Search</Text>
                    </TouchableOpacity>
                }

            </View>

            <FlatList
                data={stocksToAdd}
                horizontal={true}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item}
                renderItem={({item}) => (
                    <View style={{height: 50, padding:5}}>
                        <View style={{
                            backgroundColor: 'rgba(250, 250, 250, 0.3)',
                            borderRadius: 5,
                            paddingLeft: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <View>
                                <Text style={{color: '#f8adb3', fontSize: 14}}>{item}</Text>
                            </View>
                            <TouchableOpacity style={{marginBottom: 7, padding: 5}} onPress={() => deleteSymbol(item)}>
                                <Icon name={'close-circle-outline'} color={'white'} size={13}/>
                            </TouchableOpacity>

                        </View>
                    </View>
                )}
            />
            {displayInvalidInput ?
                    <Text style={{color:'#eb5779', padding:10, paddingBottom:15,}}>{displayInvalidInput}</Text> : <></>
            }
            {stocksToAddSize > 0 ?
                <TouchableOpacity onPress={() => {onAddStocks(stocksToAdd);}}>
                    <Text style={{color:'#f8adb3', fontFamily:'titleFont', fontSize:22,}}>Add</Text>
                </TouchableOpacity> : <></>
            }
        </View>

    );
}

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: 35,
        paddingHorizontal: 10,
        marginRight: 15,
        flex: 2,
    },
})
export default AddStocksModal;