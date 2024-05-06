import {getTodos} from "../../businessLogic/todos.js";
import {createLogger} from "../../utils/logger.mjs";
import {getUserId} from "../utils.mjs";

const logger = createLogger('getTodos');

export async function handler(event) {
  logger.info('Caller event getTodos');
  const userId = getUserId(event);

  const items = await getTodos(userId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({items: items})
  }
}
