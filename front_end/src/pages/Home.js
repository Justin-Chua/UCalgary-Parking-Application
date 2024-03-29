import React, { useState, useEffect } from 'react';

function Home() {
    const [todos, setTodos] = useState([]);
    useEffect(() => {
        console.log("Fetching data...");
        const fetchData = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/');
                const todosData = await res.json();
                console.log("Data fetched successfully:", todosData);
                setTodos(todosData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);
    return (
        <div>
            <h3>This is the home page</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
            <h2>Todo List</h2>
                <ul>
                {todos.map(item => (
                <li key={item.id}>
                    <h5>{item.title}</h5>
                    <p>{item.description}</p>
                </li>
            ))}
            </ul>
        </div>
    );
}

export default Home;