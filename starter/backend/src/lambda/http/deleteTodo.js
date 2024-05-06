import {getUserId} from "../utils.mjs";
import {deleteTodo} from "../../businessLogic/todos.js";
import {createLogger} from "../../utils/logger.mjs";

const logger = createLogger('DeleteTodo');
export async function handler(event) {
  logger.info('Caller event DeleteTodo');
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const deletedItem = await deleteTodo(todoId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({deletedItem: deletedItem})
  }
}

