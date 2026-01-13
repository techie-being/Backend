import React, { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  // 1. Initialize as an empty array to prevent .map() crashes
  const [jokes, setJokes] = useState([]); 

  useEffect(() => {
    axios.get('/api/jokes')
      .then((response) => {
        
        setJokes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jokes:", error);
      })
  }, []); 

  return (
    <>
      <h1>Jai Shree Hanuman</h1>
      <p>Jokes Count: {jokes.length}</p>
      
    
      {jokes.map((joke) => (
        
        <div key={joke.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>ID: {joke.id}</h3>
          <p>{joke.content}</p>
        </div>
      ))}
    </>
  )
}

export default App