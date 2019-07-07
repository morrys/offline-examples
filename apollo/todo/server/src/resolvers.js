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
} from 'graphql-relay';

import {
  Todo,
  User,
  USER_ID,
  getTodoOrThrow,
  getTodos,
  getUserOrThrow,
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
  User: {
    id: user => user.id,
    userId: user => user.id,
    todos: ({id}, {status, after, before, first, last}) => {
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
  Mutation: {
    /*addChannel: (root, args) => {
      const name = args.name;
      const id = addChannel(name);
      return getChannel(id);
    },
    addMessage: (root, { message }) => {
      const channel = channels.find(
        channel => channel.id === message.channelId
      );
      if (!channel) throw new Error('Channel does not exist');

      const newMessage = {
        id: String(lastMessageId++),
        text: message.text,
        createdAt: +new Date(),
      };
      channel.messages.push(newMessage);

      pubsub.publish('messageAdded', {
        messageAdded: newMessage,
        channelId: message.channelId,
      });

      return newMessage;
    },*/
  },
};
