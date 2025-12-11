import React, { useState } from "react";
import {
    Modal,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const { width, height} = Dimensions.get("window");

interface FullScreenImageModalProps {
    visible: boolean;
    imageUri: string;
    onClose: () => void;
}

const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({
    visible,
    imageUri,
    onClose,
}) => {
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <Modal
            visible={visible}
            // transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.95)" />
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Feather name="x" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="contain"
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />

                    {imageLoading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                </View>

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
    },

    header: {
        position: "absolute",
        top: 15,
        // left: 0,
        right: 10,
        paddingTop: StatusBar.currentHeight || 44,
        paddingHorizontal: 16,
        paddingBottom: 16,
        zIndex: 10,
    },

    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(14, 13, 13, 0.42)",
        justifyContent: "center",
        alignItems: "center",
    },

    imageWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    image: {
        width: width-50,
        height: height * 0.8,
    },

    loadingOverlay: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default FullScreenImageModal;
