import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "./features/todos/todosSlice";
import filtersReducer from "./features/filters/filterSlice";

const store = configureStore({
  reducer: {
    todosReducer,
    filtersReducer
  }
})

export default store