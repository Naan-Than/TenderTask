import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../../pages/home/HomeScreen';
import ProductDetailsScreen from '../../pages/home/ProductDetailsScreen';
import FavoritesScreen from '../../pages/home/FavoritesScreen';

const productStack = createStackNavigator();
const ProductStack = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}
            edges={['left', 'right']}>
            <productStack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                }}
                initialRouteName='FavoritesScreen' >
                <productStack.Screen
                    name="FavoritesScreen"
                    component={FavoritesScreen}
                />
                <productStack.Screen
                    name="ProductDetails"
                    component={ProductDetailsScreen}
                />
            </productStack.Navigator>
        </SafeAreaView>
    );
};

export default ProductStack;