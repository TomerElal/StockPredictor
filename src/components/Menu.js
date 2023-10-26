import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from "react-native";

function Menu() {

    const handleMenuItemPress = (option) => {
        // Handle menu item press here
        // You can perform different actions based on the selected option
        // For now, let's just log the selected option
        console.log('Selected option:', option);
    };
    return (
        <>
            <TouchableOpacity onPress={() => handleMenuItemPress('Option 1')} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemPress('Option 2')} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemPress('Option 3')}
                              style={[styles.menuItem, {borderBottomWidth: 0,}]}>
                <Text style={styles.menuItemText}>Option 3</Text>
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