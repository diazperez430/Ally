import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { createTodo } from './src/graphql/mutations';
import { listTodos } from './src/graphql/queries';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const scale = (size: number): number => {
  const baseWidth = 375;
  const scaleFactor = screenWidth / baseWidth;
  return Math.round(size * scaleFactor);
};

interface Todo {
  id?: string;
  name: string;
  description?: string | null;
}

interface FormState {
  name: string;
  description: string;
}

const initialState: FormState = { name: '', description: '' };
const client = generateClient();

const TodoScreen = () => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key: keyof FormState, value: string) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log('error fetching todos:', err);
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await client.graphql({
        query: createTodo,
        variables: {
          input: todo
        }
      });
      // Refresh the list after adding
      fetchTodos();
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Todo List</Text>
          
          <View style={styles.formContainer}>
            <TextInput
              onChangeText={(value) => setInput('name', value)}
              style={styles.input}
              value={formState.name}
              placeholder="Todo name"
              placeholderTextColor="#999"
            />
            <TextInput
              onChangeText={(value) => setInput('description', value)}
              style={styles.input}
              value={formState.description}
              placeholder="Description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
            <Pressable onPress={addTodo} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Create Todo</Text>
            </Pressable>
          </View>

          <View style={styles.todosContainer}>
            <Text style={styles.sectionTitle}>Your Todos</Text>
            {todos.map((todo, index) => (
              <View key={todo.id ? todo.id : index} style={styles.todo}>
                <Text style={styles.todoName}>{todo.name}</Text>
                <Text style={styles.todoDescription}>{todo.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fae7f7',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? 60 : 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    color: '#6426A9',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: isTablet ? 24 : 16,
    marginBottom: 24,
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: isTablet ? 12 : 10,
    paddingHorizontal: isTablet ? 18 : 12,
    fontSize: isTablet ? 15 : 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0d6ef',
    color: '#6426A9',
  },
  buttonContainer: {
    backgroundColor: '#6426A9',
    borderRadius: 8,
    paddingVertical: isTablet ? 14 : 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isTablet ? 16 : 14,
    letterSpacing: 1,
  },
  todosContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#6426A9',
    marginBottom: 16,
  },
  todo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: isTablet ? 16 : 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#6426A9',
    marginBottom: 4,
  },
  todoDescription: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    lineHeight: 20,
  },
});

export default TodoScreen; 