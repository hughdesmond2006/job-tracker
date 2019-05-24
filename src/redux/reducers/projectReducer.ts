import Project from "../../interfaces/Project";
import Action from "../../interfaces/Action";
import AppState from "../../interfaces/AppState";
import {
  completeProjectFailure,
  completeProjectSuccess, fetchProjectsBegin,
  fetchProjectsFailure,
  fetchProjectsSuccess,
  resetFailure
} from "../actions/projectActions";
import store from "../store";

const initialState: AppState = {
  projects: [],
  loading: false,
  error: null
};

export default function productReducer(state = initialState, action: Action) {
  switch (action.type) {
    // Mark the state as "loading" for spinner and reset errors
    case "FETCH_PROJECTS_BEGIN": {
      fetch(`https://interview.termpay-demo.com/api/projects/`, {
        headers: {
          Authorization: "JZgCty4BXU237DCUmdZv"
        }
      })
        .then((res: any) => {
          if (res.status !== 200) {
            throw new Error(res.error);
          }

          return res.json();
        })
        .then((data: any) => {
          store.dispatch(fetchProjectsSuccess(data));
        })
        .catch(err => {
          store.dispatch(fetchProjectsFailure(err));
        });

      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case "FETCH_PROJECTS_SUCCESS":
      // refresh project data from server. Set loading to false
      return {
        ...state,
        loading: false,
        projects: action.payload.projects
      };

    case "FETCH_PROJECTS_FAILURE": {
      // Failed. set loading to false
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }

    // mark project as completed
    case "COMPLETE_PROJECT_BEGIN": {
      const formData = new FormData();
      formData.append("completed", "true");

      fetch(
        `https://interview.termpay-demo.com/api/projects/${
          action.payload.projectID
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "JZgCty4BXU237DCUmdZv"
          },
          body: JSON.stringify({ completed: true })
        }
      )
        .then((res: any) => {
          if (res.status !== 200) {
            throw new Error(res.error);
          }

          return res.json();
        })
        .then((data: any) => {
          store.dispatch(completeProjectSuccess(action.payload.projectID));
        })
        .catch(err => {
          store.dispatch(completeProjectFailure(err));
        });

      return {
        ...state,
        error: null
      };
    }

    case "COMPLETE_PROJECT_SUCCESS": {
      const newProjectsArray = state.projects.map((project: Project) => {
        // update the corresponding project with new completed status
        if (project.id === action.payload.projectID) {
          return {
            ...project,
            completed: true
          };
        }

        // Leave every other project unchanged
        return project;
      });

      // update only the target project
      return {
        ...state,
        projects: newProjectsArray
      };
    }

    case "COMPLETE_PROJECT_FAILURE": {
      return {
        ...state,
        error: action.payload.error
      };
    }

    // reset data
    case "RESET_BEGIN": {
      const formData = new FormData();
      formData.append("completed", "true");

      fetch(`https://interview.termpay-demo.com/api/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "JZgCty4BXU237DCUmdZv"
        }
      })
        .then((res: any) => {
          if (res.status !== 200) {
            throw new Error(res.error);
          }

          return res.json();
        })
        .then((data: any) => {
          store.dispatch(fetchProjectsBegin());
        })
        .catch(err => {
          store.dispatch(resetFailure(err));
        });

      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case "RESET_FAILURE": {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }

    default:
      return state;
  }
}
