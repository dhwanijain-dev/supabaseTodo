'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import React,{ useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import supabase from './supabase-client'
const page = () => {
  const [newTask,setNewTask] = useState({title:'',description:''})
  const [message,setMessage] = useState('')
  const [todos,setTodos] = useState<any[]>([])
  const [updateTodo,setUpdateTodo] = useState('')
  const [updateDescription,setUpdateDescription] = useState('')
 const [open, setOpen] = useState(false)
 
 React.useEffect(() => {
    fetchTodos();
    
  }, [todos])

  const fetchTodos = async () => {
    const {data,error} = await supabase
    .from('todo')
    .select('*')
    if(error){
      console.log(error)
    }else{
      setTodos(data)
    }
  }
  

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(newTask.title === '' || newTask.description === ''){
      setMessage('Please fill in all fields')
      return;
    }
    const {data,error} = await supabase
    .from('todo')
    .insert([{todo:newTask.title,description:newTask.description}])
    if(error){
      setMessage('Error adding task')
      console.log(error)
    }else{
      setMessage('Task added successfully')
      setNewTask({title:'',description:''})
    }
  }
  return (
    <div className='flex flex-col justify-center items-center h-screen '>
      
<Card className="h-96 w-96 p-4 flex flex-col justify-evenly gap-3">
  <h1 className='text-2xl font-bold text-center'>Welcome To My Todo </h1>

    <div>
      <form className=" flex flex-col gap-2">
        <Label htmlFor='task'>New Todo</Label>
          <Input type='text'
          placeholder='Add a new todo...' 
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          />
          <Label htmlFor='taskDesc'>Todo Description</Label>
          <Input type='text' 
          placeholder='Add a task description...' 
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          />
          <Button type='submit' onClick={handleSubmit} className='mt-4'>Add Task</Button>
          {message && <p className='text-green-500'>{message}</p>}
      </form>

      
      

    </div>


</Card>
    
<Card className='w-1/2 mt-10'>
{todos.length === 0 ? (
  <p className='p-10 text-center'>No todos available</p>
):(
  <Table className='p-10'>

  <TableCaption className='mb-3'>All Todos</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Todo</TableHead>
      <TableHead>Description</TableHead>

    </TableRow>
  </TableHeader>
  <TableBody>
    {todos.map((todo) => (
      <TableRow key={todo.id}>
        <TableCell className="font-medium">{todo.todo}</TableCell>
        <TableCell>{todo.description}</TableCell>
        <TableCell className='flex items-center justify-end gap-2'>
            <Button variant='destructive' onClick={async() => {
                const {data,error} = await supabase
                .from('todo')
                .delete()
                .eq('id',todo.id)
                if(error){
                  console.log(error)
                }else{
                  setMessage('Task deleted successfully')
                }
              }}>Delete</Button>

        
        <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger onClick={() => setOpen(true)}>Update</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>This Will Edit Your Todo?</DialogTitle>
                  <DialogDescription>
                    This will update your todo to "Updated Task"
                  </DialogDescription>
                </DialogHeader>
                <Input type='text' placeholder='update todo'
                onChange={(e) => setUpdateTodo(e.target.value)}
                />
                <Input type='text' placeholder='update description'
                onChange={(e) => setUpdateDescription(e.target.value)}
                />
                <Button variant='secondary' onClick={async() => {
                const {data,error} = await supabase
                .from('todo')
                .update({todo: updateTodo, description: updateDescription})
                .eq('id',todo.id)
                if(error){
                  console.log(error)
                }else{
                  setMessage('Task updated successfully')
                  setOpen(false)
                }
              }}>Update</Button>

              
              </DialogContent>
            </Dialog>

        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
)
}

</Card>

    </div>
  )
}

export default page