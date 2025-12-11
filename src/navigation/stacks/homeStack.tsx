import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../../pages/home/HomeScreen';
import ProductDetailsScreen from '../../pages/home/ProductDetailsScreen';

const homeStack = createStackNavigator();
const HomeStack = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}
            edges={['left', 'right']}>
            <homeStack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                }}
                initialRouteName='HomeScreen' >
                <homeStack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                />
                <homeStack.Screen
                    name="ProductDetails"
                    component={ProductDetailsScreen}
                />
            </homeStack.Navigator>
        </SafeAreaView>
    );
};

export default HomeStack;