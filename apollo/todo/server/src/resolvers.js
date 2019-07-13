import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import faker from 'faker';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  cursorForObjectInConnection
} from 'graphql-relay';

import {
  Todo,
  User,
  USER_ID,
  getTodoOrThrow,
  getTodos,
  getUserOrThrow,
  addTodo,
  changeTodoStatus,
  renameTodo,
  removeTodo,
  markAllTodos,
  removeCompletedTodos
} from './database';


export const resolvers = {
  Query: {
    /*channels: () => {
      return channels;
    },*/

    user: (root, { id }) => {
      return getUserOrThrow(id);
    },
  },
  Mutation: {
    addTodo: (root, { input: { id, userId, text } }) => {
      const todoId = addTodo(id, userId, text, false);
      const todo = getTodoOrThrow(todoId);
      const outputFields = {
        todoEdge: {
          cursor: cursorForObjectInConnection([...getTodos(userId)], todo),
          node: todo,
        },
        user: {
          ...getUserOrThrow(userId),
        },
      }
      return outputFields;
    },
    changeTodoStatus: (root, { input: { id, complete, userId } }) => {
      changeTodoStatus(id, complete);
      const todo = getTodoOrThrow(id);
      const user = getUserOrThrow(userId);
      const outputFields = {
        todo,
        user,
      }

      return outputFields;
    },
    renameTodo: (root, { input: { id, text } }) => {
      renameTodo(id, text);
      const todo = getTodoOrThrow(id);
      const outputFields = {
        todo,
      }
      return outputFields;
    },
    removeTodo: (root, { input: { id, userId } }) => {
      removeTodo(id, userId);
      const user = getUserOrThrow(userId);
      const outputFields = {
        deletedTodoId: id,
        user,
      };
      return outputFields;
    },
    markAllTodos: (root, { input: { complete, userId } }) => {
      const changedTodoIds = markAllTodos(userId, complete);
      const user = getUserOrThrow(userId);
      const outputFields = {
        changedTodos: changedTodoIds.map((todoId) => getTodoOrThrow(todoId)),
        user,
      };
      return outputFields;
    },
    removeCompletedTodos: (root, { input: { userId } }) => {
      const deletedTodoIds = removeCompletedTodos(userId);
      const user = getUserOrThrow(userId);
      const outputFields = {
        deletedTodoIds,
        user,
      }
      return outputFields;
    }
  },
  User: {
    id: user => user.id,
    userId: user => user.id,
    todos: ({ id }, { status, after, before, first, last }) => {
      return connectionFromArray([...getTodos(id, status)], {
        after,
        before,
        first,
        last,
      });
    },
    totalCount: user => getTodos(user.id).length,
    completedCount: user => getTodos(user.id, 'completed').length,
  },
  // The new resolvers are under the Channel type
  /*Channel: {
    messageFeed: (channel, { cursor }) => {
      // The cursor passed in by the client will be an
      // integer timestamp. If no cursor is passed in,
      // set the cursor equal to the time at which the
      // last message in the channel was created.
      if (!cursor) {
        cursor =
          channel.messages[channel.messages.length - 1].createdAt;
      }

      cursor = parseInt(cursor);
      // limit is the number of messages we will return.
      // We could pass it in as an argument but in this
      // case let's use a static value.
      const limit = 10;

      const newestMessageIndex = channel.messages.findIndex(
        message => message.createdAt === cursor
      ); // find index of message created at time held in cursor
      // We need to return a new cursor to the client so that it
      // can find the next page. Let's set newCursor to the
      // createdAt time of the last message in this messageFeed:
      const newCursor =
        channel.messages[newestMessageIndex - limit].createdAt;

      const messageFeed = {
        messages: channel.messages.slice(
          newestMessageIndex - limit,
          newestMessageIndex
        ),
        cursor: newCursor,
      };

      return messageFeed;
    },
  },*/

};
