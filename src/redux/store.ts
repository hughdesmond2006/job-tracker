import { applyMiddleware, createStore } from "redux";
//import logger from "redux-logger";
import thunk from "redux-thunk";

import projectsReducer from "./reducers/projectReducer";

export default createStore(projectsReducer, applyMiddleware(/*logger,*/ thunk));