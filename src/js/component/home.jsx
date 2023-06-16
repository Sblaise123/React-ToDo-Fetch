import React, { useEffect, useState } from 'react';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  const handleAddTodo = () => {
    const newTodoItem = {
      id: Date.now(),
      title: newTodo,
      completed: false
    };

    fetch('https://jsonplaceholder.typicode.com/todos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTodoItem)
    })
      .then(response => response.json())
      .then(data => {
        setTodos([...todos, data]);
        setNewTodo('');
      })
      .catch(error => {
        console.error('Error adding new todo:', error);
      });
  };

  const handleToggleComplete = todoId => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTodos.find(todo => todo.id === todoId))
    })
      .then(response => response.json())
      .then(data => {
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={event => setNewTodo(event.target.value)}
      />
      <button onClick={handleAddTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
            />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
