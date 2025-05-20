import { ActivityIndicator, Dimensions, View, Image } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';


const { width } = Dimensions.get('window');


const Loading = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
                autoPlay
                loop
                source={require('@/assets/online-delivery-service.json')}
                style={{ width: width, height: width * 1 }}
            />

            {/* <Image source={require('../../assets/splash.png')} style={{ width: '80%', height: width * 0.8, resizeMode: 'contain' }} /> */}
        </View>
    )
}

export default Loading