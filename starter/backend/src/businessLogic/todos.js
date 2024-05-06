import {TodosAccess} from "../dataLayer/todosAccess.js";
import * as uuid from 'uuid';
import {getUploadUrl} from "../fileStorage/attachmentUtils.js";

const imagesBucket = process.env.IMAGES_S3_BUCKET;
const todosAccess = new TodosAccess();
export async function getTodos(userId) {
    return await todosAccess.getTodosByKey(userId);
}
export async function createTodo(createTodoRequest, userId) {
    const itemId = uuid.v4()
    const newItem ={
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        createdAt: new Date().toISOString(),
    }

    await todosAccess.createTodo(newItem);
    return newItem;
}

export async function updateTodo(updateTodoRequest, todoId, userId) {
    return await todosAccess.updateTodo(updateTodoRequest, todoId, userId);
}

export async function deleteTodo(todoId, userId) {
    return await todosAccess.deleteTodo( todoId, userId);
}

export async function generateUploadUrl(todoId, userId) {
    const imageId = uuid.v4();
    await updateUploadUrlToItem(todoId, userId, imageId);

    return await getUploadUrl(imageId);
}

export async function updateUploadUrlToItem(todoId, userId, imageId) {
    await todosAccess.updateUploadUrlToItem(todoId, userId, imageId);
}