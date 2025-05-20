import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HeaderBack } from '@/app/Components/Header';

const Notification = () => {
    const [data, setData] = React.useState([
        {
            id: 1,
            title: "Đơn hàng mới",
            body: "Bạn có một đơn hàng mới cần giao.",
            created_at: "2025-02-26 10:30",
            image: "https://via.placeholder.com/50",
            is_read: 0, // Chưa đọc
        },
        {
            id: 2,
            title: "Đơn hàng đã giao",
            body: "Bạn đã hoàn thành đơn hàng #12345.",
            created_at: "2025-02-26 09:15",
            image: "https://via.placeholder.com/50",
            is_read: 1, // Đã đọc
        },
        {
            id: 3,
            title: "Khuyến mãi mới",
            body: "Nhận ngay ưu đãi 20% cho đơn giao tiếp theo!",
            created_at: "2025-02-25 18:00",
            image: "https://via.placeholder.com/50",
            is_read: 0, // Chưa đọc
        },
    ]);
    
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();
    const opacityAnim = React.useRef(new Animated.Value(0)).current; 

    

    const renderNotificationItem = ({ item }: { item: { id: number; title: string; body: string; created_at: string; image?: string; is_read: number } }) => (
        <Animated.View
            style={[
                styles.notificationCard,
                item.is_read === 0 && styles.unreadNotificationCard, 
                { opacity: opacityAnim }
            ]}
        >
            {item.image && (
                <View style={styles.iconContainer}>
                    <Image source={{ uri: item.image }} style={styles.imageStyle} />
                </View>
            )}
            <View style={styles.textContainer}>
                <Text style={[styles.title, item.is_read === 0 && styles.unreadTitle]}>{item.title}</Text>
                <Text style={[styles.description, item.is_read === 0 && styles.unreadDescription]}>{item.body}</Text>
                <Text style={styles.timestamp}>{item.created_at}</Text>
            </View>
        </Animated.View>
    );
    useEffect(() => {
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500, // Animation trong 500ms
            useNativeDriver: true,
        }).start();
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            <HeaderBack name={t('notification')} />
            {data.length > 0 ? (
                <FlatList
                    data={data}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <Text style={styles.noNotificationsText}>لا يوجد اشعارات</Text>
            )}
        </SafeAreaView>
    );
};

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    listContent: {
        paddingBottom: 20,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
        width: '94%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        opacity: 0.9,
    },
    unreadNotificationCard: {
        backgroundColor: '#e6f7ff', 
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e0e0e0',
        marginRight: 15,
    },
    imageStyle: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textContainer: {
        flex: 1,
        paddingLeft: 5,
    },
    title: {
        fontSize: 18,
        color: '#333',
        marginBottom: 5,
        fontFamily: 'Cairo-Bold',
    },
    unreadTitle: {
        color: '#007bff', 
    },
    description: {
        fontSize: 15,
        color: '#666',
        marginBottom: 5,
        fontFamily: 'Cairo-Regular',
    },
    unreadDescription: {
        fontWeight: 'bold', 
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Cairo-Regular',
        marginTop: 8,
    },
    noNotificationsText: {
        textAlign: 'center',
        marginTop: '50%',
        fontFamily: 'Cairo-SemiBold',
        fontSize: 18,
        color: '#999',
    },
});