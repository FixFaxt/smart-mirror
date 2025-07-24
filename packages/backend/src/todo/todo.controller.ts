import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  CreateTodoBoardParams,
  TodoBoardReturn,
  UpdateTodoBoardParams,
} from './types/todo-board.types';
import { CreateTodoParams, Todo, UpdateTodoParams } from './types/todo.types';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Todo Boards
  @Post('boards')
  async createTodoBoard(
    @Body() params: CreateTodoBoardParams,
  ): Promise<{ message: string }> {
    try {
      await this.todoService.createTodoBoard(params);
      return { message: 'Todo board created successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('boards/user/:userId')
  async getTodoBoardsForUser(
    @Param('userId') userId: number,
  ): Promise<TodoBoardReturn[]> {
    try {
      return await this.todoService.getTodoBoardsForUser(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('boards/title/:title')
  async getTodoBoardByTitle(
    @Param('title') title: string,
  ): Promise<TodoBoardReturn | null> {
    try {
      const board = await this.todoService.getTodoBoardByTitle(title);
      if (!board) {
        throw new HttpException('Todo board not found', HttpStatus.NOT_FOUND);
      }
      return board;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put('boards')
  async updateTodoBoard(
    @Body() params: UpdateTodoBoardParams,
  ): Promise<{ message: string }> {
    try {
      await this.todoService.updateTodoBoard(params);
      return { message: 'Todo board updated successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('boards/:id')
  async deleteTodoBoard(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.todoService.deleteTodoBoard(id);
      return { message: 'Todo board deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Todo Tasks
  @Post('tasks')
  async createTodo(
    @Body() params: CreateTodoParams,
  ): Promise<{ message: string }> {
    try {
      await this.todoService.createTodo(params);
      return { message: 'Todo task created successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('tasks/user/:userId')
  async getTodos(@Param('userId') userId: number): Promise<Todo[]> {
    try {
      return await this.todoService.getTodos(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('tasks/daily/:userId')
  async getDailyTodos(@Param('userId') userId: number): Promise<Todo[]> {
    try {
      return await this.todoService.getDailyTodos(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('tasks/title/:title')
  async getTodoByTitle(@Param('title') title: string): Promise<Todo> {
    try {
      const todo = await this.todoService.getTodoByTitle(title);
      if (!todo) {
        throw new HttpException('Todo task not found', HttpStatus.NOT_FOUND);
      }
      return todo;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put('tasks')
  async updateTodo(
    @Body() params: UpdateTodoParams,
  ): Promise<{ message: string }> {
    try {
      await this.todoService.updateTodo(params);
      return { message: 'Todo task updated successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('tasks/:title')
  async deleteTodo(
    @Param('title') title: string,
  ): Promise<{ message: string }> {
    try {
      await this.todoService.deleteTodo(title);
      return { message: 'Todo task deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
