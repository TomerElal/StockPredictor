import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';

// Import custom components and utilities
import Home from "./src/screens/Home";
import Predict from "./src/screens/Predict";
import { View } from "react-native";

const Stack = createStackNavigator();

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
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen
                    name="PredictScreen"
                    component={Predict}
                    options={{
                        cardStyle: { backgroundColor: 'transparent' },
                        gestureEnabled: true, // Enable gestures
                        gestureResponseDistance:300, // slide from top to bottom anywhere on the screen to go back
                        gestureDirection: 'vertical', // Allow vertical gestures
                        cardOverlayEnabled: true,
                        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid, // Slide from the bottom
                        cardOverlay: () => (
                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
                        ),
                        headerTintColor: '#f8adb3',
                        headerTitle:'',
                        headerStyle: {
                            backgroundColor: 'black',
                        },

                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
