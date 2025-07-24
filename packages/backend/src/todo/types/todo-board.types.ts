import { Todo } from './todo.types';

export interface TodoBoardReturn {
  id: number;
  title: string;
  description?: string;
  userId: number;
  todos?: Todo[];
}

export interface CreateTodoBoardParams {
  title: string;
  description?: string;
  userId: number;
}

export interface UpdateTodoBoardParams {
  title: string;
  newTitle?: string;
  description?: string;
  userId: number;
}
