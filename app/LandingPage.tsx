import { View, Text,Image, Modal, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'

const LandingPage = () => {
  const [modalVisible,setModalVisible] = useState(false);
  return (
    
    <View>
      <View className='flex-row'>
        <Pressable className='h-14 w-14' onPress={() => setModalVisible(true)}>
        <Image
        
        source={require("../assets/images/design_resolution_original.jpg")}
        resizeMode='contain'
        />
      </Pressable>
      </View>
      
      <Modal
      visible={modalVisible}
      transparent={false}
      animationType="fade"
      
      >
        <View className='flex-1 items-center justify-center'>
          <View className='bg-red-900 w-20 h-20'>
            <Text>this is a modal</Text>
            <Pressable  onPress={()=> setModalVisible(false)} >
                <Text>close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default LandingPage