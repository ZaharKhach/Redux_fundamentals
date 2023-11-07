import { client } from "../../api/client";

import { todoAdded, todosLoaded, todosLoading } from "../actions/actions";
import { StatusFilters } from "../filters/filterSlice";

import { createSelector } from "reselect";

const initialState = {
    loadingStatus: 'idle',
    todos: {}
};


export default function todosReducer(state = initialState, action) {
    switch (action.type) {

        case "todos/todoAdded": {
            const todo = action.payload
            return {
                ...state,
                todos: {
                    ...state.todos,
                    [todo.id]: todo
                }
            };
        }
        case "todos/todoToggled": {
            const todoId = action.payload;
            const todo = state.todos[todoId]
            return {
                ...state,
                todos: {
                    ...state.todos,
                    [todoId]: {
                        ...todo,
                        completed: !todo.completed
                    }
                }
            }
        }
        case "todos/colorSelected": {
            const { color, todoId } = action.payload
            const todo = state.todos[todoId];
            return {
                ...state,
                todos: {
                    ...state.todos,
                    [todoId]: {
                        ...todo,
                        color
                    }
                }
            }
        }
        case "todos/todoDeleted": {
            const newTodos = { ...state.todos }
            delete newTodos[action.payload];
            return {
                ...state,
                todos: newTodos
            }
        }
        case "todos/allCompleted": {
            const newTodos = { ...state.todos }
            Object.values(newTodos).forEach(todo => {
                newTodos[todo.id] = {
                    ...todo,
                    completed: true
                }
            })
            return {
                ...state,
                todos: newTodos
            }
        }
        case "todos/completedCleared": {
            const newTodos = { ...state.todos };
            Object.values(newTodos).map(todo => {
                if (todo.completed) {
                    delete newTodos[todo.id]
                }

            })
            return {
                ...state,
                todos: newTodos
            }
        }
        case "todos/todosLoading": {
            return {
                ...state,
                loadingStatus: 'loading'
            }
        }
        case "todos/todosLoaded": {
            const newTodos = { ...state.todos }
            action.payload.forEach(todo => {
                newTodos[todo.id] = todo
            })
            return {
                ...state,
                loadingStatus: 'idle',
                todos: newTodos
            }
        }
        default: {
            return state;
        }
    }
}

//Thunk function
export const fetchTodos = () => async dispatch => {
    dispatch(todosLoading())
    const response = await client.get("fakeApi/todos");
    dispatch(todosLoaded(response.todos));
}
export function saveMeTodo(text) {
    //создаем внешнюю функцию которая принимает текст с инпута
    return async function (dispatch, getState) {
        //дальше идет так называемая thunk фция 
        //которая делает пост запрос и посылает action
        const newTodo = {
            text: text
        };

        const response = await client.post("/fakeApi/todos", { todo: newTodo });
        dispatch(todoAdded(response.todo))
    }
}


const selectTodoArray = state => state.todosReducer.todos;
export const selectTodos = createSelector(
    selectTodoArray,
    (todoArray) => Object.values(todoArray)
)

export const selectFilteredTodos = createSelector(
    selectTodos,
    (state) => state.filtersReducer,

    (todos, { status, colors }) => {
        const showAllCompletions = status === StatusFilters.All;
        if (status === 'all' && colors.length === 0) {
            return todos
        }

        const completedTodosStatus = status === StatusFilters.Completed;
        return todos.filter(todo => {
            const statusMathces =
                showAllCompletions || todo.completed === completedTodosStatus;
            const colorMatches = colors.length === 0 || colors.includes(todo.color);
            return statusMathces && colorMatches
        })
    }

)

export const selectFilteredTodosId = createSelector(
    //creating 'imput selector'
    selectFilteredTodos,

    //creating out 
    (todos) => todos.map(todo => todo.id)
)