import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Enzyme, { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore, { MockStore } from "redux-mock-store";

import ProjectCard from "./components/ProjectCard/ProjectCard";
import ProjectList from "./components/ProjectList/ProjectList";
import store from "./redux/store";
import { Provider } from "react-redux";
import Project from "./interfaces/Project";
import {
  completeProjectBegin,
  fetchProjectsBegin,
  resetBegin
} from "./redux/actions/projectActions";
import toJson from "enzyme-to-json";

Enzyme.configure({ adapter: new Adapter() });

describe("<App />", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

const testCard1 = (
  <ProjectCard
    id={12}
    name={"A nice Job"}
    address={["Test Address", "Test Street"]}
    startDate={"2019-04-12T00:00:00.000Z"}
    completed={false}
  />
);

const testCard2 = (
  <ProjectCard
    id={4}
    name={"3 Bedroom Refurb"}
    address={["159 Amiens Street", "Dublin 13"]}
    startDate={"2019-04-23T00:00:00.000"}
    completed={true}
  />
);

describe("<ProjectCard />", () => {
  //smoke
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(testCard1, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  // make sure the correct details are rendered and
  // in the correct format
  it("renders an incomplete project card", () => {
    const projectCard = shallow(testCard1);
    expect(projectCard).toMatchSnapshot();
  });

  // tests to see a complete project is rendered appropriately
  it("renders a complete project card", () => {
    const projectCard = shallow(testCard2);
    expect(projectCard).toMatchSnapshot();
  });
});

const testProjectList = [
  {
    address: ["217 East Wall Road", "Dublin 19"],
    completed: false,
    id: 9,
    name: "Living Room Update",
    startDate: "2019-04-24T00:00:00.000Z"
  },
  {
    address: ["198 Fishamble Street", "Dublin 10"],
    completed: true,
    id: 6,
    name: "Window Replacements",
    startDate: "2019-04-13T00:00:00.000Z"
  },
  {
    address: ["99 Mountjoy Square", "Dublin 1"],
    completed: false,
    id: 7,
    name: "3 Bedroom Refurb",
    startDate: "2019-04-13T00:00:00.000Z"
  }
];

const initialState: {
  projects: Project[];
  loading: boolean;
  error: Error;
} = {
  projects: [...testProjectList],
  loading: false,
  error: null
};

describe("<ProjectList />", () => {
  //smoke
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Provider store={store}>
        <ProjectList />
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  // this tests the loading animation is working
  it("renders the loading spinner", () => {
    const projectList = mount(
      <Provider store={store}>
        <ProjectList />
      </Provider>
    );

    const spinnerClass = projectList.find("div.spinner");

    expect(spinnerClass).toMatchSnapshot();
  });

  // this ensures the list is rendered properly and that the
  // incomplete projects appear first
  it("renders populated list", () => {
    const mockStore = configureStore();
    let store: MockStore;
    let wrapper: ShallowWrapper;

    // setup mount with mock redux store before each test
    store = mockStore(initialState);
    wrapper = shallow(
      <Provider store={store}>
        <ProjectList />
      </Provider>
    );

    wrapper.setState({...initialState});

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("Redux", () => {
  const mockStore = configureStore();
  let store: MockStore;
  let wrapper: ReactWrapper;

  // setup mount with mock redux store before each test
  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <ProjectList {...initialState} />
      </Provider>
    );
  });

  it("has props matching with initialState", () => {
    expect(wrapper.find(ProjectList).prop("projects")).toEqual(
      initialState.projects
    );
    expect(wrapper.find(ProjectList).prop("loading")).toEqual(
      initialState.loading
    );
    expect(wrapper.find(ProjectList).prop("error")).toEqual(initialState.error);
  });

  it("can dispatch actions", () => {
    let action;
    store.dispatch(fetchProjectsBegin());
    store.dispatch(completeProjectBegin(1));
    store.dispatch(resetBegin());

    action = store.getActions();

    expect(action[0].type).toBe("FETCH_PROJECTS_BEGIN");
    expect(action[1].type).toBe("COMPLETE_PROJECT_BEGIN");
    expect(action[2].type).toBe("RESET_BEGIN");
  });
});
