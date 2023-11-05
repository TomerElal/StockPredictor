import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from "react-native";

function Menu({onEditWatchlist}) {

    const handleMenuItemPress = (option) => {
        // Handle menu item press here
        // You can perform different actions based on the selected option
        // For now, let's just log the selected option
        console.log('Selected option:', option);
    };
    return (
        <>
            <TouchableOpacity onPress={() => onEditWatchlist()} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Edit your watchlist</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemPress('Option 2')} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Change displayed currency</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemPress('Option 3')}
                              style={[styles.menuItem, {borderBottomWidth: 0,}]}>
                <Text style={styles.menuItemText}>ML description</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        height:40,
        borderBottomColor: '#f8adb3',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        color: 'white',
        fontSize: 16,
    },
});
export default Menu;