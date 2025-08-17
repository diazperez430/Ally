import { post, get, put, del } from 'aws-amplify/api';

// API Configuration
const API_CONFIG = {
  TODO_API: 'TodoAPI',
  USER_API: 'UserAPI',
  BASE_URL: '/api/v1'
};

// Types
export interface Todo {
  id?: string;
  name: string;
  description?: string | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Todo API Service
export class TodoService {
  static async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await get({
        apiName: API_CONFIG.TODO_API,
        path: `${API_CONFIG.BASE_URL}/todos`
      });
      const result = await response.response;
      return (result.body as unknown as Todo[]) || [];
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  static async createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    try {
      const response = await post({
        apiName: API_CONFIG.TODO_API,
        path: `${API_CONFIG.BASE_URL}/todos`,
        options: {
          body: todo
        }
      });
      const result = await response.response;
      return result.body as unknown as Todo;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  static async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    try {
      const response = await put({
        apiName: API_CONFIG.TODO_API,
        path: `${API_CONFIG.BASE_URL}/todos/${id}`,
        options: {
          body: updates
        }
      });
      const result = await response.response;
      return result.body as unknown as Todo;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  static async deleteTodo(id: string): Promise<void> {
    try {
      await del({
        apiName: API_CONFIG.TODO_API,
        path: `${API_CONFIG.BASE_URL}/todos/${id}`
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
}

// User API Service
export class UserService {
  static async getUserProfile(userId: string): Promise<User> {
    try {
      const response = await get({
        apiName: API_CONFIG.USER_API,
        path: `${API_CONFIG.BASE_URL}/users/${userId}`
      });
      const result = await response.response;
      return result.body as unknown as User;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const response = await put({
        apiName: API_CONFIG.USER_API,
        path: `${API_CONFIG.BASE_URL}/users/${userId}`,
        options: {
          body: updates
        }
      });
      const result = await response.response;
      return result.body as unknown as User;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

// Export default API instance
export const api = {
  todos: TodoService,
  users: UserService
};
