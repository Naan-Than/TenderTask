import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../store/slice/productSlice';
import AppStrings from '../../constants/appStrings';

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

interface ProductCardProps {
    item: Product;
    onPress?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onPress }) => {
    const dispatch = useDispatch();
    const favorites = useSelector((state: any) => state.product.favorites);

    const isFavorite = favorites.some((fav: Product) => fav.id === item.id);

    const handleFavoriteToggle = () => {
        dispatch(toggleFavorite(item));
    };

    const handleCardPress = () => {
        if (onPress) {
            onPress(item);
        }
    };

    return (
        <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.8}
            onPress={handleCardPress}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title}
                </Text>

                <View style={styles.ratingContainer}>
                    <Feather name="star" size={14} color="#FFB800" />
                    <Text style={styles.ratingText}>
                        {item.rating.rate} ({item.rating.count})
                    </Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>

                    <TouchableOpacity style={styles.addButton}
                        onPress={handleFavoriteToggle}>
                        <Feather
                            name={isFavorite ? "heart" : "heart"}
                            size={16}
                            color={isFavorite ? "#ff3b30" : "#ffffffff"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    productCard: {
        // flex: 1,
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
          // borderStartColor:"red",
    },
    imageContainer: {
        width: '100%',
        height: 160,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfo: {
        padding: 12,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
        lineHeight: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AppStrings.appColor,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: AppStrings.appColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default ProductCard;