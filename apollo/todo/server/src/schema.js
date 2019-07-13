import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
input AddTodoInput {
  id: ID!
  text: String!
  userId: ID!
  clientMutationId: String
}

type AddTodoPayload {
  todoEdge: TodoEdge!
  user: User!
  clientMutationId: String
}

input ChangeTodoStatusInput {
  complete: Boolean!
  id: ID!
  userId: ID!
  clientMutationId: String
}

type ChangeTodoStatusPayload {
  todo: Todo!
  user: User!
  clientMutationId: String
}

input MarkAllTodosInput {
  complete: Boolean!
  userId: ID!
  clientMutationId: String
}

type MarkAllTodosPayload {
  changedTodos: [Todo!]
  user: User!
  clientMutationId: String
}

type Mutation {
  addTodo(input: AddTodoInput!): AddTodoPayload
  changeTodoStatus(input: ChangeTodoStatusInput!): ChangeTodoStatusPayload
  markAllTodos(input: MarkAllTodosInput!): MarkAllTodosPayload
  removeCompletedTodos(input: RemoveCompletedTodosInput!): RemoveCompletedTodosPayload
  removeTodo(input: RemoveTodoInput!): RemoveTodoPayload
  renameTodo(input: RenameTodoInput!): RenameTodoPayload
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!

  hasPreviousPage: Boolean!

  startCursor: String

  endCursor: String
}

type Query {
  user(id: String): User

  node(
    id: ID!
  ): Node
}

input RemoveCompletedTodosInput {
  userId: ID!
  clientMutationId: String
}

type RemoveCompletedTodosPayload {
  deletedTodoIds: [String!]
  user: User!
  clientMutationId: String
}

input RemoveTodoInput {
  id: ID!
  userId: ID!
  clientMutationId: String
}

type RemoveTodoPayload {
  deletedTodoId: ID!
  user: User!
  clientMutationId: String
}

input RenameTodoInput {
  id: ID!
  text: String!
  clientMutationId: String
}

type RenameTodoPayload {
  todo: Todo!
  clientMutationId: String
}

type Todo implements Node {
  id: ID!
  text: String!
  complete: Boolean!
}

type TodoConnection {
  pageInfo: PageInfo!
  edges: [TodoEdge]
}

type TodoEdge {
  node: Todo

  cursor: String!
}

type User implements Node {
  id: ID!
  userId: String!
  todos(status: String = "any", after: String, first: Int, before: String, last: Int): TodoConnection
  totalCount: Int!
  completedCount: Int!
}
`;



const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
