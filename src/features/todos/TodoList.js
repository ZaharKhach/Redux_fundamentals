import React from 'react';
import { useSelector } from 'react-redux';
import TodoListItem from './TodoListItem';

import { selectFilteredTodosId } from './todosSlice';

const TodoList = () => {
  // Выбираем только идентификаторы задач из состояния Redux с помощью селектора для того чтобы 
  //избежать re-render если изменяются данные в обьекте элемента массива а не сам массив
  const todosIds = useSelector(selectFilteredTodosId);
  //shallowEqual - позволяет сравнивать состояние по значениям. позволяет избегать re-render 
  //если сам массив не затрагивается 

  //loadingStatus 
  const loadingStatus = useSelector(({ todosReducer }) => todosReducer.loadingStatus);

  if (loadingStatus === 'loading') {
    return (
        <div className="todo-list">
          <div className="loader"></div>
        </div>
    )
  }

  // Создаем компоненты TodoListItem на основе идентификаторов задач.
  const renderedListItems = todosIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
