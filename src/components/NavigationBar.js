import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    TextInput,
    LayoutAnimation,
    SafeAreaView,
    Dimensions,
    Platform,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GridIcon from '../../assets/icons/GridIcon';
import Menu from './Menu';

const windowWidth = Dimensions.get('window').width;
const dimensions = Dimensions.get('window');

/**
 * NavigationBar component for handling various actions.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.onSearchSubmit - Function to handle search submission.
 * @param {Function} props.onHomeReturn - Function to handle returning to the home screen.
 * @param {React.Ref} props.flatListRef - Reference to the FlatList component.
 * @param {boolean} props.boolIsHomeScreen - Flag indicating if the current screen is the home screen.
 * @param {Function} props.onEditWatchlist - Function to handle editing the watchlist.
 * @param {boolean} props.isEditMode - Flag indicating whether the app is in edit mode.
 * @param {Function} props.onPriceOrChangeDisplay - Function to handle changing price display.
 * @param {Function} props.onChangeCurrency - Function to handle changing displayed currency.
 * @param {boolean} props.isPriceDisplay - Flag indicating whether to display prices or changes.
 */
const NavigationBar = forwardRef(
    (
        {
            onSearchSubmit,
            onHomeReturn,
            flatListRef,
            boolIsHomeScreen,
            onEditWatchlist,
            isEditMode,
            onPriceOrChangeDisplay,
            onChangeCurrency,
            isPriceDisplay,
        },
        ref
    ) => {
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
                flatListRef.current.scrollToIndex({ index: 0, animated: true });
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

        useImperativeHandle(ref, () => ({
            closeMenu: closeMenu,
        }));

        const handleEditWatchlist = () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            onEditWatchlist();
            setMenuVisible(false);
        };

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
                            placeholder={'Search stock'}
                            value={searchText}
                            onChangeText={handleSearchInput}
                            onSubmitEditing={handleSearchSubmit}
                            autoFocus={true}
                            keyboardAppearance="dark"
                            autoCapitalize="none"
                            returnKeyType="search"
                        />
                        <TouchableOpacity
                            onPress={handleSearch}
                            style={{ padding: 10, paddingLeft: 20, marginTop: Platform.OS === 'ios' ? 5 : 12 }}
                        >
                            <Text style={{ color: '#f8adb3' }}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableHighlight
                            onPress={() => handleHomePress()}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            underlayColor="transparent"
                            style={{ padding: 10 }}
                        >
                            <Text style={[styles.appName, { color: HomePagePressed ? '#f8adb3' : 'white' }]}>
                                Stock Predictor
                            </Text>
                        </TouchableHighlight>

                        <TouchableOpacity onPress={handleSearch} style={{ paddingTop: Platform.OS === 'ios' ? 15 : 22, padding: 10 }}>
                            <Icon name="search" size={(dimensions.width + dimensions.height) > 1200 ? 22 : 20} style={{ color: 'white' }} />
                        </TouchableOpacity>
                    </>
                )}
                {isEditMode ? (
                    <>
                        <TouchableOpacity onPress={handleDoneEditing} style={styles.menuIcon}>
                            <Text style={styles.menuIconText}>Done</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <></>
                )}
                {boolIsHomeScreen && !isEditMode ? (
                    <>
                        <TouchableOpacity onPress={handleMenuPress} style={styles.menuIcon}>
                            <GridIcon width={(dimensions.width + dimensions.height) > 1200 ? 25 : 23} height={(dimensions.width + dimensions.height) > 1200 ? 25 : 23} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <></>
                )}

                {menuVisible && (
                    <View style={styles.menu}>
                        <Menu onEditWatchlist={handleEditWatchlist} onPriceOrChangeDisplay={onPriceOrChangeDisplay} onChangeCurrency={onChangeCurrency} isPriceDisplay={isPriceDisplay} closeMenu={closeMenu} />
                    </View>
                )}
            </SafeAreaView>
        );
    }
);

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#21262f',
        paddingHorizontal: 10,
        height: 70,
        zIndex: 999,
    },
    appName: {
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 30 : 26,
        color: 'white',
        fontFamily: 'titleFont',
        paddingTop: 5,
        paddingRight: windowWidth < 400 ? (windowWidth < 370 ? 25 : 35) : windowWidth > 420 ? 75 : 65,
        shadowOpacity: 1,
        shadowColor: '#eb5779',
        elevation: 50,
        shadowOffset: {
            width: 3,
            height: -3,
        },
    },
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 5,
        flex: 1,
        height: (dimensions.width + dimensions.height) > 1200 ? 35 : 28,
        paddingHorizontal: 15,
        marginTop: Platform.OS === 'ios' ? 5 : 12,
    },
    menuIcon: {
        marginTop: Platform.OS === 'ios' ? 7 : 14,
        padding: 10,
        paddingRight:15,
    },
    menuIconText: {
        fontFamily: 'titleFont',
        color: '#f8adb3',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 20 : 18,
    },
    menu: {
        position: 'absolute',
        top: 70,
        right: 10,
        width: (dimensions.width + dimensions.height) > 1200 ? 250 : 220,
        backgroundColor: '#21262f',
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#f8adb3',
    },
});

export default NavigationBar;
