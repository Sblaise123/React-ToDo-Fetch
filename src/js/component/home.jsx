import React, { useEffect, useState } from 'react';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
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

    fetch('https://jsonplaceholder.typicode.com/todos', {
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

    fetch(`https://jsonplaceholder.typicode.com/todos${todoId}`, {
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

  const handleDeleteTodo = todoId => {
    fetch(`https://jsonplaceholder.typicode.com/todos${todoId}`, {
      method: 'DELETE'
    })
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== todoId);
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  const handleEditTodo = todo => {
    setEditTodo(todo);
    setNewTodo(todo.title);
  };

  const handleUpdateTodo = () => {
    if (!editTodo) return;

    const updatedTodo = {
      ...editTodo,
      title: newTodo
    };

    fetch(`https://jsonplaceholder.typicode.com/todos${editTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTodo)
    })
      .then(response => response.json())
      .then(data => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === editTodo.id) {
            return data;
          }
          return todo;
        });
        setTodos(updatedTodos);
        setNewTodo('');
        setEditTodo(null);
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
        />
        {editTodo ? (
          <>
            <button onClick={handleUpdateTodo}>Update</button>
            <button onClick={() => setEditTodo(null)}>Cancel</button>
          </>
        ) : (
          <button onClick={handleAddTodo}>Add</button>
        )}
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
            />
            <span>{todo.title}</span>
            <div>
              <button onClick={() => handleEditTodo(todo)}>Edit</button>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
