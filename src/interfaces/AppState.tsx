import Project from "../interfaces/Project";

export default interface AppState {
  projects?: Project[],
  loading?: boolean,
  error?: Error
}