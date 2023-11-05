import React, {} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

// Import custom components and utilities
import Home from "./src/screens/Home";
import {View} from "react-native";
import StockDetails from "./src/screens/StockDetails";

const Stack = createStackNavigator();

const transitionConfig = {
    animation: 'timing',
    config: {
        duration: 600,
    },
};

/**
 * The main application component.
 *
 * This component serves as the entry point of the application and
 * contains the structure of the app, including the font loading logic,
 * safe area view, navigation bar, and stock list.
 */
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home"
                              component={Home}
                              options={{ headerShown: false }}/>
                <Stack.Screen
                    name="StockDetailsScreen"
                    component={StockDetails}
                    options={{
                        gestureEnabled: true, // Enable gestures
                        gestureResponseDistance: 450,
                        gestureVelocityImpact:2000,
                        gestureDirection: 'vertical',
                        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
                        cardOverlay: () => (
                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
                        ),
                        headerTintColor: '#f8adb3',
                        headerTitle: '',
                        headerStyle: {
                            backgroundColor: 'black',
                        },
                        transitionSpec: {
                            open: transitionConfig,
                            close: transitionConfig,
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
