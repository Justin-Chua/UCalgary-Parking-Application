import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Map from '../components/Map';

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
        <>
            <h3 id="page-header">View UCalgary Parking</h3>
            <Map />
            <h2>Todo List</h2>
                <ul>
                {todos.map(item => (
                <li key={item.id}>
                    <h5>{item.title}</h5>
                    <p>{item.description}</p>
                </li>
            ))}
            </ul>
        </>
    );
}

export default Home;