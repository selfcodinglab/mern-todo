import axios from "axios";

export interface Todo {
  _id: string;
  title: string;
  isCompleted: boolean;
}

interface TodoListProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}
const TodoList = ({todos, setTodos}: TodoListProps) => {

  const markCompleted = (todo: Todo) => {
    axios.put(`/todo/${todo._id}`, {}, {headers: { token: localStorage.getItem('token')}})
      .then(res => {
        if (res.status === 200) {
          let _todos = todos;
          setTodos(_todos.filter(todo => res.data.todo._id !== todo._id));
        }
      });
  }

  return(
    <>
      {todos.filter(todo => !todo.isCompleted).map((todo) => (
        <div className="border border-gray-400 p-4 rounded-md mb-4 flex justify-between items-center" key={todo._id}>
          {todo.title}
          <input type="button" className="py-2 px-3 bg-green-400 text-white rounded-md cursor-pointer" value="DONE" onClick={() => markCompleted(todo)} />
        </div>
      ))}
    </>
  )
}

export default TodoList;