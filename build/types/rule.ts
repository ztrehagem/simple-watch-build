import { Task } from "../tasks/task.js"

export interface Rule {
  name: string
  /** glob string array */
  include: string[]
  /** glob string array */
  exclude: string[]
  createTask: (pathname: string) => Task
}
