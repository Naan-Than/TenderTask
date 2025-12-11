import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import AppStrings from '../../constants/appStrings';

import { ToastMessage } from '../../constants/TostMessages';
import FullScreenImageModal from '../../components/common/FullScreenImageModal';
import { toggleFavorite } from '../../store/slice/productSlice';

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

interface Props {
    route: any;
    navigation: any;
}

const ProductDetailsScreen = (props: any) => {
    const dispatch = useDispatch();
    const { product }: { product: Product } = props.route.params;

    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [showFullImage, setShowFullImage] = useState<boolean>(false);

    const favorites = useSelector((state: any) => state.product.favorites || []);
    const isFavorite = favorites.some((fav: Product) => fav.id === product.id);

    const handleAddToFavorites = () => {
        dispatch(toggleFavorite(product));
        ToastMessage.Custom(
            'success',
            isFavorite ? 'Removed from favorites' : 'Added to favorites'
        );
    };

    const handleImagePress = () => {
        setShowFullImage(true);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Feather key={`star-${i}`} name="star" size={16} color="#FFD700" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Feather key="star-half" name="star" size={16} color="#FFD700" />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Feather
                    key={`empty-${i}`}
                    name="star"
                    size={16}
                    color="#E0E0E0"
                />
            );
        }

        return stars;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => props.navigation.goBack()}
                >
                    <Feather name="arrow-left" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <View style={styles.headerButton} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={handleImagePress}
                    activeOpacity={0.9}
                >
                    <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="contain"
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                        <View style={styles.imageLoader}>
                            <ActivityIndicator size="large" color={AppStrings.appColor} />
                        </View>
                    )}

                </TouchableOpacity>

                <View style={styles.contentContainer}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>
                    <Text style={styles.title}>{product.title}</Text>
                    <View style={styles.ratingContainer}>
                        <View style={styles.stars}>{renderStars(product.rating.rate)}</View>
                        <Text style={styles.ratingText}>
                            {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
                        </Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Price</Text>
                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.favoriteButton,
                        isFavorite && styles.favoriteButtonActive,
                    ]}
                    onPress={handleAddToFavorites}
                    activeOpacity={0.8}
                >
                    <Feather
                        name={isFavorite ? 'heart' : 'heart'}
                        size={20}
                        color={isFavorite ? '#fff' : AppStrings.appColor}
                        fill={isFavorite ? '#fff' : 'transparent'}
                    />
                    <Text
                        style={[
                            styles.favoriteButtonText,
                            isFavorite && styles.favoriteButtonTextActive,
                        ]}
                    >
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Text>
                </TouchableOpacity>
            </View>
            <FullScreenImageModal
                visible={showFullImage}
                imageUri={product.image}
                onClose={() => setShowFullImage(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    imageContainer: {
        width: '100%',
        height: 350,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imageLoader: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomHint: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    zoomHintText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '500',
    },
    contentContainer: {
        padding: 20,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textTransform: 'capitalize',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        lineHeight: 32,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    priceLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: AppStrings.appColor,
    },
    descriptionContainer: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: AppStrings.appColor,
    },
    favoriteButtonActive: {
        backgroundColor: AppStrings.appColor,
        borderColor: AppStrings.appColor,
    },
    favoriteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: AppStrings.appColor,
        marginLeft: 8,
    },
    favoriteButtonTextActive: {
        color: '#fff',
    },
});

export default ProductDetailsScreen;