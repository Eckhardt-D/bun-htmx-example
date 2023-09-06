import { renderToString } from "react-dom/server";
import { Database } from "bun:sqlite";
import { Todos, type Todo } from "./todos";

const todosController = new Todos(
  new Database()
)

todosController.createTable();

const server = Bun.serve({
  port: 8080,
  hostname: "localhost",
  fetch: handler
});

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '' || url.pathname === '/')
    return new Response(Bun.file("index.html"))

  if (url.pathname === '/todos' && request.method === 'POST') {
    const { todo } = await request.json();

    if (!todo?.length) return new Response('Invalid input', { status: 500 })
    
    todosController.add(todo);
    const todos = todosController.list();
      
    return new Response(
      renderToString(<TodoList todos={todos} />)
    );
  }

  if (request.method === "GET" && url.pathname === "/todos") {
    const todos = todosController.list()
    

    return new Response(
      renderToString(<TodoList todos={todos} />)
    );
  }
  
  return new Response("NotFound", { status: 404 });
}

Bun.write(
  Bun.stdout,
  `Server is listening on http://${server.hostname}:${server.port}\n\n`
)


function TodoList(props: { todos: Todo[] }) {
  return <ul>
    { 
      props.todos.length
        ? props.todos.map(todo => <li key={todo.id}>{todo.text}</li>)
        : 'No items added'
    }
  </ul>
}
