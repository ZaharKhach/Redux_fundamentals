export const print1 = (storeAPI) => (next) => (action) => {
  console.log('First middleware')
  return next(action)
}

export const asyncRequestMiddleware = store=> next => action => {
  //Проверяем является ли наш action (то что мы передали в dispatch) фцией
  if(typeof action === 'function') {
    //Если это так тогда мы вызываем эту функцию и передаем в ее аргументы store and dispatch(next)
    
    return action(store.dispatch, store.getState)
  }

  //В противном случае мы просто продолжим цепочку middlewares или store.dispatch
  return next(action);
}