import { StyleSheet, View, Text } from 'react-native';
import FileUploader from '@/features/uploads/components/FileUploader';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.h2}>File Uploader</Text>
      <View style={{ flex: 1 }}>
        <FileUploader />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#505050',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    height: 100
  },
  h2: {
    color: '#f0f0f0',
    marginTop: 32,
    fontSize: 32,
    fontWeight: 'bold'
  }
});