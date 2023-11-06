import { client } from "../../api/client";

import { todoAdded, todosLoaded } from "../actions/actions";
import { StatusFilters } from "../filters/filterSlice";

import { createSelector } from "reselect";

const initialState = [];


export default function todosReducer(state = initialState, action) {
    switch (action.type) {

        case "todos/todoAdded": {
            return [
                ...state,
                action.payload
            ];
        }
        case "todos/todoToggled": {
            return state.map(item => {
                if (item.id !== action.payload) {
                    return item;
                }

                return {
                    ...item,
                    completed: !item.completed
                }
            });
        }
        case "todos/colorSelected": {
            const { color, todoId } = action.payload
            return state.map(item => {
                if (item.id !== todoId) {
                    return item;
                }

                return {
                    ...item,
                    color
                }
            })
        }
        case "todos/todoDeleted": {
            return state.filter(item => item.id !== action.payload)
        }
        case "todos/allCompleted": {
            return state.map(item => {
                return { ...item, completed: true }

            })
        }
        case "todos/completedCleared": {
            return state.filter(item => !item.completed)
        }
        case "todos/todosLoaded": {
            return [
                ...state,
                ...action.payload
            ]
        }
        default: {
            return state;
        }
    }
}

//Thunk function
export const fetchTodos = () => async dispatch => {
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

//

//we are doing it cause every time when some value in todos array change
//func map generate new arr and re-rendering started and also it has deeply equality check
//and THIS THING was created only for creating selectors exapt shallowEqual 

export const selectFilteredTodos = createSelector(
    (state) => state.todosReducer,
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