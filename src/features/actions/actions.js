export const todosLoaded = (todos) => {
    return {
        type: "todos/todosLoaded",
        payload: todos
    }
}
//also u can const todoAdded = todos => ({...actionObj...})
export const todoAdded = (todo) => {
    return {
        type: "todos/todoAdded",
        payload: todo
    }
} 
export const onStatusChangeAction = (status) => {
    return {
        type: "filters/statusFilterChanged",
        payload: status
    }
}
export const onColorChangeAction = (color, changeType) => {
    return {
        type: "filters/colorFilterChanged",
        payload: {color, changeType}
    }
}
export const todosLoading = () => {
    return {
        type: "todos/todosLoading"
    }
}