import React, { useState } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Todos from './Todos'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  title: {
    marginBottom: '0.3em',
    marginTop: '1em'
  },
  todos: {
    marginLeft: '0.2em',
    marginTop: '0.5em'
  }
})

function App() {
  const classes = useStyles()
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState('')

  const addTodoToArray = () => {
    if (todo !== '') {
      setTodos([...todos, {
        name: todo,
        isCheck: false,
        id: Math.random() * 1000
      }])
    }
    setTodo('')
  }

  return (
    <Container maxWidth="md">
      <Typography component="h1" variant="h3" className={classes.title}>
        ToDo list
        </Typography>
      <Grid container spacing={1}>
        <Grid item>
          <TextField
            variant="outlined"
            value={todo}
            placeholder="Enter a todo..."
            required
            size="small"
            onChange={e => setTodo(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" type="submit" onClick={addTodoToArray}>
            Add Todo
              </Button>
        </Grid>
      </Grid>
      <div className={classes.todos}>
        {
          todos.map((todo) => {
            return <Todos
              key={todo.id}
              todo={todo}
              todos={todos}
              setTodos={setTodos}
            />
          })
        }
      </div>
    </Container>
  )
}

export default App