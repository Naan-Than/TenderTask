import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import AppStrings from '../../constants/appStrings';
import { getProductsAPI } from '../../services/product.service';
import { ToastMessage } from '../../constants/TostMessages';
import { setProducts, setOfflineMode } from '../../store/slice/productSlice';

import NetInfo from '@react-native-community/netinfo';
import ProductCard from '../../components/home/ProductCard';
import { ActivityIndicator } from 'react-native-paper';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const HomeScreen = (props: any) => {
  const dispatch = useDispatch();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const products = useSelector((state: any) => state.product.products);

  const isOffline = useSelector((state: any) => state.product.isOffline);
  const userData = useSelector((state: any) => state.auth.userData);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      dispatch(setOfflineMode(!state.isConnected));
    });

    fetchProducts();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        dispatch(setOfflineMode(true));
        if (products.length > 0) {
          setFilteredProducts(products);
          ToastMessage.Custom('info', 'Offline mode', 'please check your internet connection');
        } else {
          ToastMessage.Custom('error', 'No products available');
        }
      } else {
        dispatch(setOfflineMode(false));
        const { data } = await getProductsAPI();
        console.log(data, 'Products fetched');

        dispatch(setProducts(data));
        setFilteredProducts(data);
      }
    } catch (error) {
      if (products.length > 0) {
        setFilteredProducts(products);
        ToastMessage.Custom('error', 'Using offline products');
      } else {
        ToastMessage.Error();
      }
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      ToastMessage.Custom('error', 'No internet connection');
      setIsRefreshing(false);
      return;
    }

    setIsRefreshing(true);
    fetchProducts();
  };

  const filterProducts = () => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product: Product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.id);
    props.navigation.navigate('ProductDetails', { product });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard item={item} onPress={handleProductPress} />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="search" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No products found</Text>
      <Text style={styles.emptySubText}>
        {isOffline
          && 'You are offline.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hi, {userData?.name || 'Guest'}</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.headerSubtitle}>Explore our products</Text>
            {isOffline && (
              <View style={styles.offlineBadge}>
                <Feather name="wifi-off" size={12} color="#fff" />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      {isLoading ?
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppStrings.appColor} />
        </View> :
        <>
          <View style={styles.searchContainer}>
            <View
              style={[
                styles.searchWrapper,
                searchFocused && styles.searchWrapperFocused,
              ]}
            >
              <Feather name="search" size={20} color={AppStrings.graySix} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor={AppStrings.grayNine}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x-circle" size={20} color={AppStrings.graySix} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[AppStrings.appColor]}
                tintColor={AppStrings.appColor}
              />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
        </>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff9500',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchWrapperFocused: {
    backgroundColor: '#fff',
    borderColor: AppStrings.appColor,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HomeScreen;