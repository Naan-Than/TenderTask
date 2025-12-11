import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { clearFavorites } from '../../store/slice/productSlice';
import AppStrings from '../../constants/appStrings';
import ProductCard from '../../components/home/ProductCard';
import { wait } from '../../util/utils';


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

const FavoritesScreen = (props: any) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const favorites = useSelector((state: any) => state.product.favorites);
  const userData = useSelector((state: any) => state.auth.userData);
  const isOffline = useSelector((state: any) => state.product.isOffline);

  const handleClearAll = () => {
    dispatch(clearFavorites());
  };

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.id);
    props.navigation.navigate('ProductDetails', { product });
  };
  const onRefresh = async () => {

    setIsRefreshing(true);
    await wait(1500);
    setIsRefreshing(false);

  }

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard item={item} onPress={handleProductPress} />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Feather name="heart" size={80} color="#e0e0e0" />
      </View>
      <Text style={styles.emptyText}>No favorites yet</Text>
      <Text style={styles.emptySubText}>
        Start adding products to your favorites by tapping the heart icon
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection:"row",alignItems:"center",gap:3}}>
          <Text style={styles.headerTitle}>My Favorites</Text>
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Feather name="wifi-off" size={12} color="#fff" />
              <Text style={styles.offlineText}>Offline</Text>
            </View>)}
        </View>
        {favorites.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
          >
            <Icons name="delete-outline" size={22} color="#ff3b30" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={favorites}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={favorites.length > 0 ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[AppStrings.appColor]}
            tintColor={AppStrings.appColor}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
    flexDirection: 'row', alignItems: 'center',
    gap: 4,
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
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff3b30',
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
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptySubText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FavoritesScreen;