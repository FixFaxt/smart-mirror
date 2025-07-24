import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTodoBoardParams,
  TodoBoardReturn,
  UpdateTodoBoardParams,
} from './types/todo-board.types';
import { CreateTodoParams, Todo, UpdateTodoParams } from './types/todo.types';

/**
 * Service for managing todo boards and tasks.
 * This service provides methods to create, retrieve, update, and delete todo boards and tasks.
 */
@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Creates a new todo board.
   * @param params - The parameters for creating a todo board.
   * @param params.title - The title of the todo board.
   * @param params.description - The description of the todo board.
   * @param params.userId - The ID of the user creating the todo board.
   */
  async createTodoBoard({
    title,
    description,
    userId,
  }: CreateTodoBoardParams): Promise<void> {
    await this.prisma.todoBoard.create({
      data: {
        title,
        description,
        userId,
      },
    });
  }

  /**
   * Retrieves all todo boards for a specific user.
   * @param userId - The ID of the user whose todo boards are to be retrieved.
   * @returns An array of todo boards associated with the user.
   */
  async getTodoBoardsForUser(userId: number): Promise<TodoBoardReturn[]> {
    const boards = await this.prisma.todoBoard.findMany({
      where: { userId },
      include: {
        todos: true,
      },
    });
    return boards as TodoBoardReturn[];
  }

  /**
   * Retrieves a todo board by its title.
   * @param title - The title of the todo board to retrieve.
   * @returns The todo board if found, otherwise null.
   */
  async getTodoBoardByTitle(title: string): Promise<TodoBoardReturn | null> {
    const board = await this.prisma.todoBoard.findUnique({
      where: { title },
      include: {
        todos: true,
      },
    });
    return board as TodoBoardReturn | null;
  }

  /**
   * Updates an existing todo board.
   * @param params - The parameters for updating the todo board.
   * @param params.title - The current title of the todo board.
   * @param params.newTitle - The new title for the todo board.
   * @param params.description - The updated description of the todo board.
   * @param params.userId - The ID of the user updating the todo board.
   */
  async updateTodoBoard({
    title,
    newTitle,
    description,
    userId,
  }: UpdateTodoBoardParams): Promise<void> {
    await this.prisma.todoBoard.update({
      where: { title },
      data: {
        title: newTitle ?? title,
        description,
        userId,
      },
    });
  }

  /**
   * Deletes a todo board by its ID.
   * @param id - The ID of the todo board to delete.
   */
  async deleteTodoBoard(id: number): Promise<void> {
    await this.prisma.todoBoard.delete({
      where: { id },
    });
  }

  // Tasks

  /**
   * Creates a new todo task.
   * @param params - The parameters for creating a todo task.
   * @param params.title - The title of the todo task.
   * @param params.description - The description of the todo task.
   * @param params.userId - The ID of the user creating the todo task.
   * @param params.expiration - The expiration date of the todo task.
   */
  async createTodo({
    title,
    description,
    userId,
    expiration,
  }: CreateTodoParams): Promise<void> {
    await this.prisma.todo.create({
      data: {
        title,
        description,
        userId,
        expiration,
      },
    });
  }

  /**
   * Retrieves all todo tasks for a specific user.
   * @param userId - The ID of the user whose todo tasks are to be retrieved.
   * @returns An array of todo tasks associated with the user.
   */
  async getTodos(userId: number): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({ where: { userId } });
    return todos as Todo[];
  }

  /**
   * Retrieves all daily todos for an user.
   * @param userId - The ID of the user whose todo tasks are to be retrieved.
   * @returns An array of todos.
   */
  async getDailyTodos(userId: number): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        userId,
        AND: { expiration: { not: null, equals: Date.now().toString() } },
      },
    });
    return todos as Todo[];
  }

  /**
   * Retrieves a todo task by its title.
   * @param title - The title of the todo task to retrieve.
   * @returns The todo task if found.
   */
  async getTodoByTitle(title: string): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { title },
    });
    return todo as Todo;
  }

  /**
   * Updates an existing todo task.
   * @param params - The parameters for updating the todo task.
   * @param params.title - The current title of the todo task.
   * @param params.newTitle - The new title for the todo task.
   * @param params.description - The updated description of the todo task.
   * @param params.completed - The completion status of the todo task.
   * @param params.expiration - The updated expiration date of the todo task.
   */
  async updateTodo({
    title,
    newTitle,
    description,
    completed,
    expiration,
  }: UpdateTodoParams) {
    await this.prisma.todo.update({
      where: { title },
      data: {
        title: newTitle ?? title,
        description,
        completed,
        expiration,
      },
    });
  }

  /**
   * Deletes a todo task by its title.
   * @param title - The title of the todo task to delete.
   */
  async deleteTodo(title: string) {
    await this.prisma.todo.delete({
      where: { title },
    });
  }
}
