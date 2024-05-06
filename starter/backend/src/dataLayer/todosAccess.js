import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import {createLogger} from "../utils/logger.mjs";

const logger = createLogger('TodosAccess')
export class TodosAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        createAtIndex= process.env.TODOS_CREATED_AT_INDEX,
        imagess3BUCKET= process.env.IMAGES_S3_BUCKET,
    ) {
        this.documentClient = documentClient
        this.todosTable = todosTable
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClient, {
            marshallOptions: {
                removeUndefinedValues: true,
                convertClassInstanceToMap: true
            }
        })
        this.createAtIndex = createAtIndex
        this.imagess3BUCKET = imagess3BUCKET
    }

    async getTodosByKey(userId) {
        logger.info('Get all todos list of user  ',{ userId: userId });

        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            IndexName: this.createAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })

        return result.Items
    }

    async createTodo(todo) {
        logger.info('create a todo with id  ',  { todoId:  todo.todoId });

        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            Item: todo
        })

        return todo
    }

    async updateTodo(todo, todoId, userId) {
        logger.info('update a todo with id  ', { todoId: todoId });

        const params = {
            TableName: this.todosTable,
            Key: {
                "todoId": todoId,
                'userId': userId,
            },
            UpdateExpression: "SET dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":dueDate": todo.dueDate,
                ":done": todo.done
            },
            ReturnValues: "UPDATED_NEW"
        };

        return await this.dynamoDbClient.update(params)
    }

    async deleteTodo(todoId, userId) {
        logger.info('delete a todo with id  ', { todoId: todoId });

        await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: {
                'todoId': todoId,
                'userId': userId,
            },
        })

        return todoId
    }

    async updateUploadUrlToItem(todoId, userId, imageId) {
        logger.info('updateUploadUrlToItem a todo with id  ', { todoId: todoId });

        const params = {
            TableName: this.todosTable,
            Key: {
                "todoId": todoId,
                'userId': userId,
            },
            UpdateExpression: "SET attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${this.imagess3BUCKET}.s3.amazonaws.com/${imageId}`
            },
            ReturnValues: "UPDATED_NEW"
        };

        return await this.dynamoDbClient.update(params)
    }
}
