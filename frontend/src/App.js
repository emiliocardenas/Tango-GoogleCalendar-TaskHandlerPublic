
import{GoogleLogin} from 'react-google-login'
import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import logo from './images/Logo.png'
import { v1 as uuidv1 } from 'uuid'
import TodoList from './TodoList'

const LOCAL_STORAGE_KEY = 'todoApp.todos'

function App() {
  

  const responseGoogle = (response) => {
    console.log(response)
    const { code } = response
    axios.post('/api/create-tokens', { code })
    .then(response => {
      console.log(response.data)
      setSignedIn(true)
    })
    .catch(error=> console.log(error.message))
  }
  
  
  const responseError = error => {
    console.log(error)
  }
  
  const startDateTime = '2022-03-16T15:30'
  const endDateTime = '2022-03-16T16:30'

  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(summary, description, location, startDateTime, endDateTime)
    axios.post('/api/create-event', {
      summary, description, location, startDateTime, endDateTime
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => console.log(error.message))

    setSummary("");
    setDescription("");
    setLocation("")
    
    // setStartDateTime("");
    // setEndDateTime("");
  }
  
  const [todos, setTodos] = useState([])
  const todoNameRef = useRef()

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedTodos) setTodos(storedTodos)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function toggleTodo(id) {
    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.complete = !todo.complete
    setTodos(newTodos)
  }



  function handleAddTodo(e) {
    const name = todoNameRef.current.value
    if (name === '')return
    setTodos(prevTodos => {
      return [...prevTodos, {id: uuidv1(), name: name, complete: false}]
    })
    todoNameRef.current.value = null

  }

 

  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  // const [startDateTime, setStartDateTime] = useState('')
  // const [endDateTime , setEndDateTime] = useState('')
  const [signedIn, setSignedIn] = useState(false)



  return (
    <div>

    <div className="App">
     <img className='logo' alt="TangoLogo" src={logo}/>
    </div>
    {
      !signedIn ? (<div className='button'>
        <GoogleLogin clientId='1004118899825-3tqvk4lpqh9l0sh8ae55nb24gea1fs4g.apps.googleusercontent.com' 
        buttonText='Sign In & Authorize Tango'
        onSuccess={responseGoogle}
        onFailure ={responseError}
        cookiePolicy={'single_host_origin'}
        // This is important!
        responseType='code'
        accessType='offline'
        scope='openid email profile https://www.googleapis.com/auth/calendar' 
        />
      </div>) : (<div className='button3'>
      <form id="myform" onSubmit={handleSubmit}>
        <label htmlFor='summary'>Chore:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <input ref={todoNameRef} type="text" id="summary" value={summary} onChange={e => setSummary(e.target.value)}/>
        <br/>
        <br/>
        <label htmlFor='description'>Description:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)}/> 
        <br/>
        <br/>
        <label htmlFor='location'>Duration (mins):&nbsp;</label>
        <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)}/>
        <br/>
        <br/>
        <label htmlFor='frequency'>Frequency: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <select name="frequency" id="dog-names">
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <br/>
        <br/>
        {/* <label htmlFor='startDateTime'>Start Date Time:</label>
        <input type="datetime-local" id="startDateTime" value={startDateTime} onChange={e => setStartDateTime(e.target.value)}/> */}
        <br/>
        {/* <label htmlFor='endDateTime'>End Date Time:</label>
        <input type="datetime-local" id="endDateTime" value={endDateTime} onChange={e => setEndDateTime(e.target.value)}/> */}
        <br/>
        <button onClick = {handleAddTodo} className='submitButton' type='submit'>Create Event</button>
      </form>
      <br/>
      <br/>
    

<div className='Chores'>
<h2>Chores</h2>
<div className='TodoList'><TodoList todos = {todos} toggleTodo={toggleTodo} /></div>
</div>
</div>

    
      )}

    </div>
  )
}

export default App;
