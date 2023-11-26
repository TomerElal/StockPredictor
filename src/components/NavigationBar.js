import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    TextInput,
    LayoutAnimation, Keyboard, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GridIcon from '../../assets/icons/GridIcon';
import Menu from "./Menu";

const NavigationBar = forwardRef(({
                                      onSearchSubmit, onHomeReturn, flatListRef, boolIsHomeScreen, onEditWatchlist,
                                      isEditMode, onPriceOrChangeDisplay, onChangeCurrency, isPriceDisplay
                                  }, ref) => {
    const [HomePagePressed, setHomePagePressed] = useState(false);
    const [searchPressed, setSearchPressed] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);

    const handleMenuPress = () => {
        setSearchPressed(false);
        setMenuVisible(!menuVisible);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    };

    function handleHomePress() {
        if (boolIsHomeScreen) {
            flatListRef.current.scrollToIndex({index: 0, animated: true});
        }
        onHomeReturn();
        setMenuVisible(false);
    }

    const handlePressIn = () => {
        setHomePagePressed(true);
    };

    const handlePressOut = () => {
        setHomePagePressed(false);
    };

    function handleSearch() {
        setMenuVisible(false);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        setSearchPressed(!searchPressed);
        setSearchText('');
        onSearchSubmit('');
    }

    function handleSearchInput(text) {
        setSearchText(text);
    }

    function handleSearchSubmit() {
        if (searchText) {
            const searchedStock = searchText.toUpperCase();
            onSearchSubmit(searchedStock); // Call the prop function
        }
    }

    function closeMenu() {
        setMenuVisible(false);
    }

    function closeKeyboard() {
        Keyboard.dismiss();
    }

    useImperativeHandle(ref, () => ({
        closeMenu: closeMenu,
        closeKeyboard: closeKeyboard,
    }));

    const handleEditWatchlist = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        onEditWatchlist();
        setMenuVisible(false);
    }

    function handleDoneEditing() {
        if (Platform.OS === 'ios') {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        }
        onEditWatchlist();
    }

    return (
        <SafeAreaView style={styles.navContainer}>
            {searchPressed ? (
                <>
                    <TextInput
                        style={styles.searchBar}
                        placeholder={"Search stock"}
                        value={searchText}
                        onChangeText={handleSearchInput}
                        onSubmitEditing={handleSearchSubmit}
                        autoFocus={true}
                        keyboardAppearance="dark"
                        autoCapitalize="none"
                        returnKeyType="search"
                    />
                    <TouchableOpacity onPress={handleSearch} style={{padding: 10, paddingLeft: 20, marginTop: 5}}>
                        <Text style={{color: "#f8adb3"}}>Cancel</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableHighlight
                        onPress={() => handleHomePress()}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        underlayColor="transparent"
                        style={{padding: 10}}
                    >
                        <Text style={[styles.appName, {color: HomePagePressed ? '#f8adb3' : 'white'}]}>
                            Stock Predictor
                        </Text>
                    </TouchableHighlight>

                    <TouchableOpacity onPress={handleSearch} style={{paddingTop: 15, marginRight:5, padding:10}}>
                        <Icon name="search" size={22} style={{color:'white'}}/>
                    </TouchableOpacity>
                </>
            )}
            {isEditMode ?
                (<>
                    <TouchableOpacity onPress={handleDoneEditing} style={styles.menuIcon}>
                        <Text style={{
                            fontFamily: "titleFont",
                            color: "#f8adb3",
                            fontSize: 20,
                        }}>Done</Text>
                    </TouchableOpacity>
                </>)
                :
                (<>

                </>)
            }
            {boolIsHomeScreen && !isEditMode ?
                (<>
                    <TouchableOpacity onPress={handleMenuPress} style={[styles.menuIcon, {padding:10}]}>
                        <GridIcon width={25} height={25}/>
                    </TouchableOpacity>
                </>)
                :
                (<></>)}


            {menuVisible && (
                <View style={styles.menu}>
                    <Menu onEditWatchlist={handleEditWatchlist}
                          onPriceOrChangeDisplay={onPriceOrChangeDisplay}
                          onChangeCurrency={onChangeCurrency}
                          isPriceDisplay={isPriceDisplay}
                          closeMenu={closeMenu}/>
                </View>
            )}
        </SafeAreaView>
    );
});

const styles = {
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#21262f',
        paddingHorizontal: 16,
        height: 70,
        zIndex: 999,
    },
    appName: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'titleFont',
        marginTop: 5,
        marginRight: 50,
    },
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 5,
        flex: 1,
        height: 35,
        paddingHorizontal: 15,
        marginTop: 5,
    },
    menuIcon: {
        marginTop: 7,

    },
    menu: {
        position: 'absolute',
        top: 70,
        right: 10,
        width: 250,
        backgroundColor: '#21262f',
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#f8adb3',
    },

};

export default NavigationBar;
