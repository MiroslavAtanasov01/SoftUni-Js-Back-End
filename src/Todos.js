import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import DeleteIcon from '@material-ui/icons/Delete'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'

const Todos = ({ todo, todos, setTodos }) => {
    const checkTodo = () => {
        setTodos(todos.map(elem => {
            if (elem.id === todo.id) {
                return {
                    ...elem, isCheck: !elem.isCheck
                }
            }
            return elem
        }))
    }

    const deleteTodo = () => {
        setTodos(todos.filter(e => e.id !== todo.id))
    }

    return (
        <Grid container item xs={8} direction="row" justify="space-between" alignItems="center">
            <Grid item xs onClick={checkTodo} >
                <Checkbox value="allowExtraEmails" color="secondary" />
            </Grid>
            <Grid item xs={8} style={{ textDecoration: todo.isCheck ? "line-through" : 'none' }}>
                {todo.name}
            </Grid>
            <Grid item xs={3} >
                <IconButton onClick={deleteTodo}>
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default Todos


