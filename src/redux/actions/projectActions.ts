import Project from "../../interfaces/Project";

export const fetchProjectsBegin = () => ({
  type: "FETCH_PROJECTS_BEGIN"
});

export const fetchProjectsSuccess = (projects: Project[]) => ({
  type: "FETCH_PROJECTS_SUCCESS",
  payload: {projects}
});

export const fetchProjectsFailure = (error: Error) => ({
  type: "FETCH_PROJECTS_FAILURE",
  payload: {error}
});

export const completeProjectBegin = (projectID: number) => ({
  type: "COMPLETE_PROJECT_BEGIN",
  payload: {projectID}
});

export const completeProjectSuccess = (projectID: number) => ({
  type: "COMPLETE_PROJECT_SUCCESS",
  payload: {projectID}
});

export const completeProjectFailure = (error: Error) => ({
  type: "COMPLETE_PROJECT_FAILURE",
  payload: {error}
});

export const resetBegin = () => ({
  type: "RESET_BEGIN"
});

export const resetFailure = (error: Error) => ({
  type: "RESET_FAILURE",
  payload: {error}
});
