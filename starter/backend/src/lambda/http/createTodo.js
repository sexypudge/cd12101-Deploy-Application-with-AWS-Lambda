import {getUserId} from "../utils.mjs";
import {createTodo} from "../../businessLogic/todos.js";
import {createLogger} from "../../utils/logger.mjs";

const logger = createLogger('CreateTodo');
export async function handler(event) {
  logger.info('Caller event CreateTodo')
  const newTodo = JSON.parse(event.body)
  const userId = getUserId(event)
  const newItem = await createTodo(newTodo, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}

