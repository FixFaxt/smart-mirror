export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  expiration?: Date;
  todoBoardId: number;
}

export interface CreateTodoParams {
  title: string;
  description?: string;
  userId: number;
  expiration?: Date;
}

export interface UpdateTodoParams {
  title: string;
  newTitle?: string;
  description?: string;
  completed?: boolean;
  expiration?: Date;
}
