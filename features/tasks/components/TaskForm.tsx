import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/core/supabase/client';
import { Task } from '@/features/tasks/models/Task';


interface TaskFormProps {
  onSave: () => void; // Callback para notificar al componente padre cuando se guarde una tarea
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      console.error('Por favor, completa todos los campos');
      return;
    }

    console.log('Datos del formulario:', { title, description });

    const user = await supabase.auth.getUser(); // Obtén el usuario autenticado
    const userId = user?.data.user?.id || process.env.EXPO_PUBLIC_ID_PRUEBAS;

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          user_id: userId,
        },
      ]);

    if (!error) {
      onSave();
      setTitle('');
      setDescription('');
    } else {
      console.error('Error al guardar la tarea:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Tarea</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#ccc"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Descripción"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa', // Fondo con un azul claro
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796b', // Verde esmeralda
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 2,
    borderColor: '#004d40',
    borderRadius: 10,
    fontSize: 16,
    color: '#004d40',
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#004d40', // Verde oscuro
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});


export default TaskForm;