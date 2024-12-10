import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from '@/core/supabase/client';
import { Task } from '@/features/tasks/models/Task';


const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1); 
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

  const fetchTasks = async () => {
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase.from('tasks').select('*').range(start, end);

    if (filterCompleted !== null) {
      query = query.eq('completed', filterCompleted);
    }

    const { data, error } = await query.order('id', { ascending: false });

    if (!error && data) {
      setTasks(data as Task[]);
    } else {
      console.error('Error al obtener las tareas:', error);
    }
  };

  const toggleTaskCompletion = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error al alternar el estado de la tarea:', error);
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !currentStatus } : task
      )
    );
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al borrar la tarea:', error);
      return;
    }

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const goToNextPage = () => setPage(page + 1);
  const goToPreviousPage = () => page > 1 && setPage(page - 1);

  const toggleFilter = () => {
    setFilterCompleted(filterCompleted === null ? false : filterCompleted ? false : true);
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filterCompleted]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <Text style={[styles.status, item.completed ? styles.completed : styles.notCompleted]}>
                {item.completed ? '✔' : '❌'}
              </Text>
              <Text style={styles.taskText}>{item.title}</Text>
            </View>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.completeButton]}
                onPress={() => toggleTaskCompletion(item.id, item.completed)}
              >
                <Text style={styles.buttonText}>
                  {item.completed ? 'Desmarcar' : 'Completar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={goToPreviousPage} disabled={page === 1}>
          <Text style={styles.paginationText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>Página {page}</Text>
        <TouchableOpacity onPress={goToNextPage}>
          <Text style={styles.paginationText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleFilter} style={styles.filterButton}>
        <Text style={styles.buttonText}>
          {filterCompleted === null
            ? 'Mostrar todas las tareas'
            : filterCompleted
            ? 'Mostrar tareas no completadas'
            : 'Mostrar tareas completadas'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbe9e7', // Fondo melocotón claro
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffab91',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskText: {
    color: '#d84315', // Naranja oscuro
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completed: {
    color: '#4caf50', // Verde
  },
  notCompleted: {
    color: '#d84315', // Naranja oscuro
  },
  taskDescription: {
    color: '#5d4037',
    fontSize: 16,
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  completeButton: {
    backgroundColor: '#8bc34a', // Verde claro
  },
  deleteButton: {
    backgroundColor: '#e53935', // Rojo fuerte
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    alignItems: 'center',
  },
  paginationText: {
    color: '#795548', // Marrón
    fontSize: 16,
    paddingHorizontal: 20,
  },
  pageNumber: {
    color: '#795548',
    fontSize: 16,
    fontWeight: '600',
  },
  filterButton: {
    backgroundColor: '#ff7043', // Naranja vibrante
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
});


export default TaskList;