import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import { saveMeTodo } from '../todos/todosSlice';

const Header = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('')

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleKeyDown = e => {
    const trimmedText = text.trim();
    
    if (e.key === 'Enter' && trimmedText) {
      //dispatch the async action
      dispatch(saveMeTodo(trimmedText))
      //update our state value
      setText('')
    }
  }

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </header>
  )
}

export default Header
