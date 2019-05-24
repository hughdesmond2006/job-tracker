import React from "react";
import "./App.css";
import ProjectList from "./components/ProjectList/ProjectList";
import { Provider } from "react-redux";
import store from "./redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <ProjectList />
      </div>
    </Provider>
  );
};

export default App;
