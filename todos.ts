import { type Database } from "bun:sqlite";

export type Todo = {
  id: number;
  text: string;
}

export class Todos {
  db: Database

  constructor(db: Database) {
    this.db = db;
  }

  createTable() {
    const createTableQuery = this.db.query(`
      CREATE TABLE IF NOT EXISTS todos (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       text TEXT NOT NULL
      )
    `)

    createTableQuery.run()
  }

  add(text: string) {
    const todosAddQuery = this.db.query(`
      INSERT INTO todos (text)
      VALUES ("${text}");
    `)

    todosAddQuery.run();
  }

  list(): Todo[] {
    const todosQuery = this.db.query('SELECT * FROM todos')
    return todosQuery.all() as unknown[] as Todo[]
  }

}
