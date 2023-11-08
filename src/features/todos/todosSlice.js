import { client } from "../../api/client";

import { StatusFilters } from "../filters/filterSlice";

import { createSelector } from "@reduxjs/toolkit";

import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter
} from "@reduxjs/toolkit";

const todosAdapter = createEntityAdapter();
const initialState = todosAdapter.getInitialState({
    status: "idle"
})


export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await client.get("fakeApi/todos");
    return response.todos
})
export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async (text) => {
    const initialTodo = { text };
    const response = await client.post("/fakeApi/todos", { todo: initialTodo });
    return response.todo
})

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        todoAdded: (state, action) => {
            const todo = action.payload;
            state.entities[todo.id] = todo
        },
        todoToggled: (state, action) => {
            console.log('here')
            const todoId = action.payload;
            const todo = state.entities[todoId]
            todo.completed = !todo.completed
        },
        todoColorSelected: (state, action) => {
            const { color, todoId } = action.payload;
            const todo = state.entities[todoId];
            todo.color = color
        },
        todoDeleted: (state, action) => {
            todosAdapter.removeOne(state, action.payload)
        },
        todoAllCompleted: (state, action) => {
            Object.values(state.entities).forEach(todo => {
                todo.completed = true
            })
        },
        todoCompletedCleared: (state) => {
            const completedIds = Object.values(state.entities)
                .filter(todo => todo.completed)
                .map(todo => todo.id)
            todosAdapter.removeMany(state, completedIds)
        },
        todosLoading: (state) => {
            state.loadingStatus = "loading"
        },
        todosLoaded: (state, action) => {
            const newTodos = {}
            action.payload.forEach(todo => {
                newTodos[todo.id] = todo
            });
            state.entities = newTodos
            state.status = 'idle'
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.loadingStatus = "loading"
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                const newTodos = {}
                action.payload.forEach(todo => {
                    newTodos[todo.id] = todo
                })
                state.loadingStatus = "idle";
                state.entities = newTodos
            })
            .addCase(saveNewTodo.fulfilled, (state, action) => {
                todosAdapter.addOne(state,action.payload );
                state.loadingStatus = 'idle'
            }
            )
    }
})
export const {
    todoAdded,
    todoToggled,
    todoColorSelected,
    todoDeleted,
    todoAllCompleted,
    todoCompletedCleared,
    todosLoading,
    todosLoaded } = todoSlice.actions;
export default todoSlice.reducer

// export const {
//     selectAll: selectTodosArray,
//     selectById: selectTodoById
// } = todosAdapter.getSelectors(state => state.todoReducer)

export const selectTodosArray = state => state.todosReducer.entities
export const selectTodos = createSelector(
    selectTodosArray,
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