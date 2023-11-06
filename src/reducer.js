import { combineReducers } from "redux";

import filtersReducer from "./features/filters/filterSlice";
import todosReducer from "./features/todos/todosSlice";

const rootReducer = combineReducers({
    todosReducer,
    filtersReducer
});

// console.log(rootReducer)

export default rootReducer;