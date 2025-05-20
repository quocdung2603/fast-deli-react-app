import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'


interface HeaderProps{
    openSideBar: ()=>void
  }
export const Header:React.FC<HeaderProps>=({ openSideBar })=> {
    const navigation = useNavigation<any>();
    const [notificationCount, setNotificationCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const getNotificationCount = () => {
        // console.log("haha");
        
    };

    useEffect(() => {
        getNotificationCount();
    }, []);

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => openSideBar()}>
                <FontAwesome name="bars" size={24} color="#fff" />
            </TouchableOpacity>

            <Image source={require('../images/logo.png')} style={{ width: 50, height: 50 }} resizeMode='contain' />

            <View style={styles.notificationIconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
                    <FontAwesome name="bell" size={24} color="#fff" />
                </TouchableOpacity>

                {loading ? (
                    <ActivityIndicator size="small" color="#fff" style={styles.loadingIndicator} />
                ) : (
                    notificationCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{notificationCount}</Text>
                        </View>
                    )
                )}
            </View>
        </View>
    );
}
interface HeaderBackProps{
    name: String
}
export const HeaderBack:React.FC<HeaderBackProps>=({name})=> {
    const nav = useNavigation<any>();
    return (
        <View style={[styles.header, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderRadius: 10 }]}>
            <AntDesign onPress={() => nav.goBack()} name="arrowleft" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Cairo-Bold' }}>{name}</Text>
            <View style={{ width: 24 }} />
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        height: 70,
        backgroundColor: '#53045F',
        marginBottom: 10,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    notificationIconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        position: 'absolute',
        right: -8,
        top: -8,
    },
})