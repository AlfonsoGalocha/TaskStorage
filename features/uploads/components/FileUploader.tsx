import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; 
import {supabase} from '@/core/supabase/client';

// import File from '@uploads/models/File';


const FileUploader = () => {
  const [files, setFiles] = useState<string[]>([]);
  const BASE_STORAGE_URL = process.env.EXPO_PUBLIC_BASE_BUCKET_URL;

  // Fetch files from Supabase storage
  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('uploads').list();
    if (error) {
      console.error('Error fetching files:', error);
    } else {
      setFiles(data.map((file) => {
        // console.log(file); // Para depuración
        return file.name;  // Retorna el nombre del archivo
      }));      
    }
  };

  useEffect(() => {
    fetchFiles();
    console.log(`Archivos actualizados. Hay ${files.length} archivos en el bucket.`)
  },[])

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`No se puede abrir la URL: ${url}`);
      }
    } catch (error) {
      console.error('Error al intentar abrir la URL:', error);
    }
  }

  // Handle file upload
  const uploadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    // Check if the operation was canceled
    if (!result.canceled) {
      const { name, uri } = result.assets[0]; // `uri` and `name` are available in the success result
      const response = await fetch(uri);
      const fileBlob = await response.blob();

      const { error } = await supabase.storage.from('uploads').upload(name, fileBlob);
      if (error) {
        console.error('Error uploading file:', error);
      } else {
        console.log('File uploaded successfully!');
        fetchFiles(); // Refresh file list
      }
    } else {
      console.log('Document selection canceled');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={uploadFile}>
        <Text style={styles.buttonText}>Upload File</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Uploaded Files:</Text>
      {files.map((file, index) => (
        <Text key={index} style={styles.fileName}>
          {file}
          <TouchableOpacity
            style={styles.button}
            onPress={() => openLink(`${BASE_STORAGE_URL}/${file}`)}
          >
            <Text style={styles.buttonText}>Abrir Imagen</Text>
          </TouchableOpacity>
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 50,
    paddingVertical: 25,
    backgroundColor: '#505050', // colocamos el mismo color de fondo que el container de uploads para que no haya dos colores (cámbialo para ver cómo afecta)
    width: '100%' // se usa todo el ancho, se usa el padding horizontal para separar el contenido interno de los bordes
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  uploadButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  fileItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  fileName: {
    color: 'white',
    fontSize: 16,
  },
  fileUrl: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default FileUploader;
