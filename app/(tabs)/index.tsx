
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import TaskForm from '@/features/tasks/components/TaskForm'; // Asegúrate de tener la ruta correcta
import TaskList from '@/features/tasks/components/TaskList'; // Asegúrate de tener la ruta correcta
import { Task } from '@/features/tasks/models/Task';


export default function App() {
  const [tasks, setTasks] = useState([]); // Para almacenar las tareas guardadas
  const [taskToEdit, setTaskToEdit] = useState(null); // Para almacenar la tarea a editar

  // Función que se pasa como onSave al componente TaskForm
  const handleSaveTask = () => {
    // Lógica para actualizar las tareas o hacer lo que necesites
    console.log('Tarea guardada, actualizar lista de tareas');
    // Aquí podrías agregar lógica para actualizar el estado de tareas
    // o hacer una llamada a la API para obtener las tareas actualizadas.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tareas</Text>

      {/* Renderiza TaskForm y pasa la función handleSaveTask */}
      <View style={styles.formContainer}>
        <TaskForm onSave={handleSaveTask} />
      </View>

      <View style={styles.listContainer}>
        <TaskList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f4f7fc',
    padding: 20,
    paddingBottom: 30, // Evitar que el contenido quede pegado al final de la pantalla
  },
  header: {
    fontSize: 32,
    color: '#333',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center', // Centrado del título
  },
  formContainer: {
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Para dispositivos Android
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    maxWidth: 600,
    marginHorizontal: 'auto', // Centrado horizontal
  },
  listContainer: {
    width: '100%',
    maxWidth: 600,
    marginHorizontal: 'auto', // Centrado horizontal
  },
});