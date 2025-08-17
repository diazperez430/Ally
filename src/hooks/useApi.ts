import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Todo, User } from '../services/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, execute };
};

// Todo-specific hooks
export const useTodos = () => {
  const { data: todos, loading, error, execute } = useApi<Todo[]>();

  const fetchTodos = useCallback(() => {
    return execute(() => api.todos.getAllTodos());
  }, [execute]);

  const createTodo = useCallback(async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await execute(() => api.todos.createTodo(todo));
    // Refresh todos after creation
    await fetchTodos();
    return result;
  }, [execute, fetchTodos]);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    const result = await execute(() => api.todos.updateTodo(id, updates));
    // Refresh todos after update
    await fetchTodos();
    return result;
  }, [execute, fetchTodos]);

  const deleteTodo = useCallback(async (id: string) => {
    await execute(() => api.todos.deleteTodo(id));
    // Refresh todos after deletion
    await fetchTodos();
  }, [execute, fetchTodos]);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo
  };
};

// User-specific hooks
export const useUser = () => {
  const { data: user, loading, error, execute } = useApi<User>();

  const fetchUserProfile = useCallback((userId: string) => {
    return execute(() => api.users.getUserProfile(userId));
  }, [execute]);

  const updateUserProfile = useCallback(async (userId: string, updates: Partial<User>) => {
    return await execute(() => api.users.updateUserProfile(userId, updates));
  }, [execute]);

  return {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile
  };
};
