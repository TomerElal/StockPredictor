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
    Platform, UIManager
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
function AddStocksModal({onAddStocks}) {
    const [searchText, setSearchText] = useState('');
    const [stocksToAdd, setStocksToAdd] = useState([]);
    const [stocksToAddSize, setStocksToAddSize] = useState(0);

    function handleSearchSubmit() {
        if(!stocksToAdd.includes(searchText)){
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            const tmp = [...stocksToAdd];
            tmp.unshift(searchText);
            setStocksToAdd(tmp);
            setSearchText('');
            setStocksToAddSize(stocksToAddSize + 1);
        }
    }

    function deleteSymbol(symbol) {
        const updatedStocks = stocksToAdd.filter((stock) => stock !== symbol);
        setStocksToAdd(updatedStocks);
        setStocksToAddSize(stocksToAddSize - 1);
    }

    return (
        <View style={{alignItems:'center', justifyContent:'center'}}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:15}}>
                <TextInput
                    style={styles.searchBar}
                    placeholder={"Insert stock symbol"}
                    placeholderTextColor={'lightgray'}
                    value={searchText}
                    onChangeText={(text) => {
                        text = text.toUpperCase();
                        setSearchText(text)
                    }}
                    onSubmitEditing={handleSearchSubmit}
                    blurOnSubmit={false}
                    autoFocus={true}
                    keyboardAppearance="dark"
                    autoCapitalize="none"
                    returnKeyType="join"
                />
                <TouchableOpacity onPress={handleSearchSubmit}>
                    <Text style={{color:'white', fontSize:16}}>Search</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={stocksToAdd}
                horizontal={true}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={{height:50}}>
                        <View style={{ backgroundColor:'rgba(250, 250, 250, 0.3)',
                            borderRadius:5,
                            marginRight:10,
                            paddingLeft:5,
                            paddingRight:1,
                            flexDirection:'row',
                            alignItems: 'center',}}>
                            <View >
                                <Text style={{color:'#f8adb3', fontSize:14}}>{item}</Text>
                            </View>
                            <TouchableOpacity style={{marginBottom:7,  padding:5}} onPress={()=>deleteSymbol(item)}>
                                <Icon name={'close-circle-outline'} color={'white'} size={13} />
                            </TouchableOpacity>

                        </View>
                    </View>
                )}
            />
            {stocksToAddSize > 0 ?
                (<View style={styles.addButton}>
                    <Button title="Add" color={'#f8adb3'} onPress={() => {onAddStocks(stocksToAdd);}}/>
                 </View>)
                :
                (<></>)}
        </View>

    );
}

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: 35,
        paddingHorizontal: 10,
        marginRight:15,
        flex:2,
    },
    addButton: {
    }
})
export default AddStocksModal;