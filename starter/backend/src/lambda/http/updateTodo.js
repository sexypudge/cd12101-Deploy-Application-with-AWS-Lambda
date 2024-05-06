import {updateTodo} from "../../businessLogic/todos.js";
import {getUserId} from "../utils.mjs";
import {createLogger} from "../../utils/logger.mjs";

const logger = createLogger('UpdateTodo');
export async function handler(event) {
  logger.info('Caller event UpdateTodo');
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const userId = getUserId(event)
  const updateItem = await updateTodo(updatedTodo, todoId, userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updateItem
    })
  }
}
