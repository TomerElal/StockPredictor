import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GridIcon from '../../assets/icons/GridIcon';

/**
 * The navigation bar component for the application.
 */
const NavigationBar = ({ onSearchSubmit, onHomeReturn }) => {
    // State to track whether the homepage button is pressed
    const [HomePagePressed, setHomePagePressed] = useState(false);
    const [searchPressed, setSearchPressed] = useState(false)
    const [searchText, setSearchText] = useState('')

    function handlePress(key) {
        console.log('Button pressed', key);
        onHomeReturn()
    }
    const handlePressIn = () => {
        setHomePagePressed(true);
    };
    const handlePressOut = () => {
        setHomePagePressed(false);
    };

    function handleSearch(){
        setSearchPressed(!searchPressed);
        setSearchText('');
        onSearchSubmit('');
    }
    function handleSearchInput(text){
        setSearchText(text);
    }

    function handleSearchSubmit() {
        if (searchText) {
            onSearchSubmit(searchText); // Call the prop function
        }
    }

    return (
        <View style={styles.container}>
                {searchPressed?(
                    <>
                        <TextInput
                            style={styles.searchBar}
                            placeholder={"Search stock"}
                            value={searchText}
                            onChangeText={handleSearchInput}
                            onSubmitEditing={handleSearchSubmit}
                            autoFocus={true}
                        />
                        <TouchableOpacity onPress={handleSearch} style={{padding:10, paddingLeft:20, marginTop: 5}}>
                            <Text style={{color: "#f8adb3"}}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ):(
                    <>
                    <TouchableHighlight
                    onPress={() => handlePress('HomePage')}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                underlayColor="transparent"
                style={{padding: 10}}
            >
                <Text style={[styles.appName, {color: HomePagePressed ? '#f8adb3' : 'white'}]}>
                    Stock Predictor
                </Text>
                </TouchableHighlight>

                <TouchableOpacity onPress={handleSearch} style={{padding: 10, marginTop: 5}}>
                    <Icon name="search" size={22} style={styles.icon}/>
                </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity onPress={() => handlePress('Menu')} style={{padding: 10, marginTop:5}}>
                    <GridIcon width={25} height={25}/>
                </TouchableOpacity>
        </View>
    );
};

// Styles for the NavigationBar component
const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#21262f',
        paddingHorizontal: 16,
        height: 70,
    },
    appName: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'titleFont',
        marginTop: 5,
    },
    iconsContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    icon: {
        color: 'white',
        marginLeft: 65,
    },
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 5,
        flex:1,
        height: 35,
        paddingHorizontal: 15,
        marginTop: 5,
    }
};

export default NavigationBar;
