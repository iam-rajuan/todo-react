import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "./components/Navbar";
import TodoItem from "./components/TodoItem";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  // todos stored in localStorage via custom hook
  const [todos, setTodos] = useLocalStorage("itask_todos_v1", []);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showFinished, setShowFinished] = useLocalStorage("itask_show_finished", false);
  const inputRef = useRef(null);

  // derived lists for performance/readability
  const remainingCount = useMemo(() => todos.filter((t) => !t.isCompleted).length, [todos]);
  const finishedCount = useMemo(() => todos.filter((t) => t.isCompleted).length, [todos]);

  // focus input when switching to edit
  useEffect(() => {
    if (editingId !== null) inputRef.current?.focus();
  }, [editingId]);

  const handleAddOrUpdate = (e) => {
    e?.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    if (editingId) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, todo: trimmed } : t))
      );
      setEditingId(null);
    } else {
      const newTodo = { id: uuidv4(), todo: trimmed, isCompleted: false, createdAt: Date.now() };
      setTodos((prev) => [newTodo, ...prev]);
    }

    setInput("");
  };

  const handleToggle = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)));
  };

  const handleEdit = (id) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    setEditingId(id);
    setInput(t.todo);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this todo?")) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setInput("");
    }
  };

  const handleClearFinished = () => {
    if (!finishedCount) return;
    if (!confirm(`Remove ${finishedCount} finished todo(s)?`)) return;
    setTodos((prev) => prev.filter((t) => !t.isCompleted));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInput("");
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <section className="bg-gradient-to-b from-violet-50 to-white p-6 rounded-2xl shadow">
          <header className="mb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              iTask — Manage your todos
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Small, fast, and mobile-first todo manager.
              <span className="ml-3 font-medium text-indigo-600">{remainingCount} open</span>
              <span className="ml-2 text-slate-500">• {finishedCount} finished</span>
            </p>
          </header>

          <form onSubmit={handleAddOrUpdate} className="flex flex-col sm:flex-row gap-3 items-center">
            <label htmlFor="todo" className="sr-only">Add todo</label>
            <input
              id="todo"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a new todo (press Enter to save)"
              className="flex-1 rounded-full px-4 py-2 border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />

            <div className="flex gap-2 items-center">
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 disabled:opacity-60"
              >
                {editingId ? "Update" : "Save"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-full bg-white border border-slate-200 shadow text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                id="showFinished"
                type="checkbox"
                checked={!!showFinished}
                onChange={() => setShowFinished((v) => !v)}
                className="h-4 w-4 rounded focus:ring-2 focus:ring-indigo-200"
              />
              <label htmlFor="showFinished" className="text-sm text-slate-700 cursor-pointer">
                Show finished todos
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setTodos((prev) =>
                    [...prev].sort((a, b) => (a.isCompleted === b.isCompleted ? b.createdAt - a.createdAt : a.isCompleted - b.isCompleted))
                  );
                }}
                className="text-sm px-3 py-1 rounded-md bg-white border border-slate-200 shadow-sm"
                title="Sort (unfinished first, then newest)"
              >
                Sort: unfinished → newest
              </button>

              <button
                onClick={handleClearFinished}
                className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-100 shadow-sm"
              >
                Clear finished
              </button>
            </div>
          </div>

          <hr className="mt-4 mb-4 border-slate-200" />

          <div className="space-y-3">
            {todos.length === 0 && <div className="text-center text-slate-500 p-6">No todos yet — add one ✨</div>}

            {todos
              .filter((t) => showFinished || !t.isCompleted)
              .map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </section>

        <footer className="mt-6 text-center text-sm text-slate-500">
          <div>Made with ❤️ — iTask &copy; iam-rajuan</div>

          <div className="mt-1">Tip: use the keyboard — Enter to save, Escape to cancel edit.</div>
        </footer>
      </main>

      {/* keyboard shortcuts */}
      <KeyHandlers onEscape={handleCancelEdit} />
    </>
  );
}

/* small keyboard handler component */
function KeyHandlers({ onEscape }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEscape]);

  return null;
}

export default App;

























// import { useState,useEffect } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import Navbar from "./components/Navbar";

// import { FaEdit } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";

// import { v4 as uuidv4 } from 'uuid';

// function App() {

//   const [todo, setTodo] = useState("")
//   const [todos, setTodos] = useState([])
//   const [showFinished, setshowFinished] = useState()

//   useEffect(() => {
//     let todoString = localStorage.getItem("todos")
//     if(todoString){
//       let todos = JSON.parse(localStorage.getItem("todos"))
//       setTodos(todos)
//     }
//   }, [])
  

//   const saveToLs = (params) => {
//     localStorage.setItem("todos", JSON.stringify(todos))
//   }
  
//   const toggleFinished = () => {
//     setshowFinished(!showFinished)
//     console.log(showFinished);
    
//   }

//   const handleEdit = (e, id)=> {
//     let t = todos.filter(i=>i.id === id)
//     setTodo(t[0].todo)

//     let newTodos = todos.filter(item=>{
//       return item.id !== id
//     })
//     setTodos(newTodos)
//     saveToLs()

//   }
//   const handleDelete = (e, id)=> {
//     // let id = e.target.name
//     let newTodos = todos.filter(item=>{
//       return item.id !== id
//     })
//     setTodos(newTodos)
//     saveToLs()
//   }
//   const handleAdd = ()=> {
//     setTodos([...todos, {id: uuidv4(), todo, isCompleted: false}])
//     setTodo("")
//     saveToLs()
//   }
//   const handleChange = (e)=> {
//     setTodo(e.target.value)
//     // console.log(todo);
    
//   }

//   const handleCheckbox = (e) => {
//     let id = e.target.name
//     let index = todos.findIndex(item=>{
//        return item.id === id
//     })
//     // console.log( `this is: ${index}` );
    
//     let newTodos =  [...todos];
//     newTodos[index].isCompleted = !newTodos[index].isCompleted
//     setTodos(newTodos)
//     saveToLs()
//   }
  
  


//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto my-5 p-5 bg-violet-100 rounded-xl min-h-[80vh]">
//         <h1 className="font-bold text-center text-3xl">
//           iTask-Manage Your Todo at One Place
//         </h1>

//           <h2 className="text-lg font-bold">Add a Todo</h2>

//         <div className="flex gap-3">
//           <input onChange={handleChange} value={todo} type="text" className="bg-violet-50 w-full rounded-full px-5 py-1"/>

//           <button onClick={handleAdd} disabled={todo.length<=0} className="btn ">
//             Save
//           </button>
//         </div>

//         <h2 className="text-lg font-bold">Your Todos</h2>
        
//         <div className="flex gap-3">
//         <input onChange={toggleFinished}  type="checkbox" checked={showFinished}  id="show" />
//         <label className="gap-3" htmlFor="show">Show Finished Todos</label>
//         </div>
//         <div className="h-[1px] bg-black opacity-15 w-[90] mx-auto my-2"></div>

//         <div className="todos">
//           {todos.length===0 && <div className="m-5">No Todos to Display</div>}
//           {todos.map(item=>{

//             return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex my-3 justify-between">

//             <div className="flex gap-3 ">
//             <input name={item.id} onChange={handleCheckbox}  type="checkbox" checked={item.isCompleted}  id="" />
//             <div className={item.isCompleted? "line-through":""} > {item.todo} </div>
//             </div>

//             <div className="button flex gap-4 h-full">

//               <button onClick={(e)=>handleEdit(e, item.id)} className="btn"><FaEdit /></button>
//               <button onClick={(e)=>handleDelete(e, item.id)} className="btn"><AiFillDelete /></button>
//             </div>
//           </div>
//           })}

//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

// import { useState, useEffect } from 'react'
// import Navbar from './components/Navbar'
// import { FaEdit } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";
// import { v4 as uuidv4 } from 'uuid';

// function App() {

//   const [todo, setTodo] = useState("")
//   const [todos, setTodos] = useState([])
//   const [showFinished, setshowFinished] = useState(true)

//   useEffect(() => {
//     let todoString = localStorage.getItem("todos")
//     if(todoString){
//       let todos = JSON.parse(localStorage.getItem("todos"))
//       setTodos(todos)
//     }
//   }, [])

//   const saveToLS = (params) => {
//     localStorage.setItem("todos", JSON.stringify(todos))
//   }

//   const toggleFinished = (e) => {
//     setshowFinished(!showFinished)
//   }

//   const handleEdit = (e, id)=>{
//     let t = todos.filter(i=>i.id === id)
//     setTodo(t[0].todo)
//     let newTodos = todos.filter(item=>{
//       return item.id!==id
//     });
//     setTodos(newTodos)
//     saveToLS()
//   }

//   const handleDelete= (e, id)=>{
//     let newTodos = todos.filter(item=>{
//       return item.id!==id
//     });
//     setTodos(newTodos)
//     saveToLS()
//   }

//   const handleAdd= ()=>{
//     setTodos([...todos, {id: uuidv4(), todo, isCompleted: false}])
//     setTodo("")
//     saveToLS()
//   }

//   const handleChange= (e)=>{
//     setTodo(e.target.value)
//   }

//   const handleCheckbox = (e) => {
//     let id = e.target.name;
//     let index = todos.findIndex(item=>{
//       return item.id === id;
//     })
//     let newTodos = [...todos];
//     newTodos[index].isCompleted = !newTodos[index].isCompleted;
//     setTodos(newTodos)
//     saveToLS()
//   }

//   return (
//     < >
//     <Navbar/>
//        <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
//         <h1 className='font-bold text-center text-3xl'>iTask - Manage your todos at one place</h1>
//          <div className="addTodo my-5 flex flex-col gap-4">
//           <h2 className='text-2xl font-bold'>Add a Todo</h2>
//           <div className="flex">

//           <input  onChange={handleChange} value={todo} type="text" className='w-full rounded-full px-5 py-1' />
//           <button onClick={handleAdd} disabled={todo.length<=3} className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'>Save</button>
//           </div>
//          </div>
//          <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} />
//          <label className='mx-2' htmlFor="show">Show Finished</label>
//          <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
//          <h2 className='text-2xl font-bold'>Your Todos</h2>
//          <div className="todos">
//           {todos.length ===0 && <div className='m-5'>No Todos to display</div> }
//           {todos.map(item=>{

//           return (showFinished || !item.isCompleted) && <div key={item.id} className={"todo flex my-3 justify-between"}>
//             <div className='flex gap-5'>
//             <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} id="" />
//             <div className={item.isCompleted?"line-through":""}>{item.todo}</div>
//             </div>
//             <div className="buttons flex h-full">
//               <button onClick={(e)=>handleEdit(e, item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
//               <button onClick={(e)=>{handleDelete(e, item.id)}} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><AiFillDelete /></button>
//             </div>
//           </div>
//           })}
//          </div>

//        </div>
//     </>
//   )
// }

// export default App
