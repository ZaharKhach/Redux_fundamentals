import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import { saveNewTodo } from '../todos/todosSlice';

const Header = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('idle');

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleKeyDown = async e => {
    const trimmedText = text.trim();
    
    if (e.key === 'Enter' && trimmedText) {
      setLoadingStatus('loading')
      //dispatch the async action
      await dispatch(saveNewTodo(trimmedText))
      //update our state value
      setText('')
      setLoadingStatus('idle')
    }
  }

  let isLoading = loadingStatus === 'loading'
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className="loader" /> : null

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header
