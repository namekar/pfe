import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Create from "./create"
import { Feather } from '@expo/vector-icons'
import { COLORS } from './CreateAnimalForm.styles'

export default function CreateAnimalModal({ visible, onClose, onSuccess, editingAnimal }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingAnimal ? 'Edit Animal' : 'New Animal'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
        
        <Create
          editingAnimal={editingAnimal}
          onSuccess={() => {
            onSuccess?.()
            onClose()
          }} 
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
})