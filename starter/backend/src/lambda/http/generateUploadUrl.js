import {getUserId} from "../utils.mjs";
import {generateUploadUrl} from "../../businessLogic/todos.js";
import {createLogger} from "../../utils/logger.mjs";
const logger = createLogger('GenerateUploadURL');
export async function handler(event) {
  logger.info('Caller event GenerateUploadURL');
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const preSignedUrl = await generateUploadUrl(todoId, userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({uploadUrl: preSignedUrl})
  }
}

