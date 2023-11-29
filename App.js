import React, {} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';

// Import custom components and utilities
import Home from "./src/screens/Home";
import {Platform, View} from "react-native";
import StockDetails from "./src/screens/StockDetails";
import StockPredictionDescription from "./src/screens/StockPredictionDescription";

const Stack = createStackNavigator();
import { I18nManager } from 'react-native';

I18nManager.forceRTL(false);
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
                              options={{headerShown: false}}/>
                <Stack.Screen
                    name="StockDetailsScreen"
                    component={StockDetails}
                    options={{
                        gestureEnabled: Platform.OS === 'ios',
                        gestureResponseDistance: 450,
                        gestureVelocityImpact: 2000,
                        gestureDirection: 'vertical',
                        cardStyleInterpolator: Platform.OS === 'ios' ?
                            CardStyleInterpolators.forFadeFromCenter
                            :
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                        cardOverlay: () => (
                            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}/>
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
                <Stack.Screen
                    name="PredictionDetailsScreen"
                    component={StockPredictionDescription}
                    options={{
                        gestureEnabled: Platform.OS === 'ios',
                        gestureResponseDistance: 450,
                        gestureVelocityImpact: 2000,
                        gestureDirection: 'vertical',
                        cardStyleInterpolator: Platform.OS === 'ios' ?
                            CardStyleInterpolators.forFadeFromCenter
                            :
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                        cardOverlay: () => (
                            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}/>
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
