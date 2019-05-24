import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import ProjectCard from "./components/ProjectCard/ProjectCard";
import ProjectList from "./components/ProjectList/ProjectList";
import store from "./redux/store";
import { Provider } from "react-redux";

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
  // make sure the correct details are rendered and
  // in the correct format
  it("renders an incomplete project card", () => {
    const projectCard = shallow(testCard1);

    const expectedOutput =
      '<div class="detailsArea">' +
      '<div class="id">#12</div>' +
      '<div class="date">4/12/2019</div>' +
      '<div class="job">' +
      '<div class="title">Project</div>' +
      ' A nice Job</div>' +
      '<div class="address">' +
      '<div class="title">Address</div>' +
      ' Test Address,Test Street</div>' +
      '<div class="completeButton">Mark as Complete!</div>' +
      '</div>';

    expect(projectCard.html()).toEqual(expectedOutput);
  });

  // tests to see a complete project is rendered appropriately
  it("renders a complete project card", () => {
    const projectCard = shallow(testCard2);

    const expectedOutput =
      '<div class="detailsArea completed">' +
      '<div class="id completed">#4</div>' +
      '<div class="date completed">4/23/2019</div>' +
      '<div class="job">' +
      '<div class="title completed">Project</div>' +
      ' 3 Bedroom Refurb</div>' +
      '<div class="address">' +
      '<div class="title completed">Address</div>' +
      ' 159 Amiens Street,Dublin 13</div>' +
      '<div class="completeButton completed">Completed!</div>' +
      '</div>';

    expect(projectCard.html()).toEqual(expectedOutput);
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

describe("<ProjectList />", () => {
  // this tests the loading animation is working
  it("renders the loading spinner", () => {
    const projectList = shallow(
      <Provider store={store}>
        <ProjectList />
      </Provider>
    );

    const expectedOutput =
      '<div class="reset">Reset</div>' + '<div class="spinner">' + "</div>";

    expect(projectList.html()).toEqual(expectedOutput);
  });

  // this ensures the list is rendered properly and that the
  // incomplete projects appear first
  it("renders list", async () => {
    const projectList = await mount(
      <Provider store={store}>
        <ProjectList />
      </Provider>
    );

    const expectedOutput =
      '<div class="reset">Reset</div>' +
      '<ul class="list">' +
      "<li>" +
      '<div class="detailsArea">' +
      '<div class="detailsWrap">' +
      '<div class="id">#7</div>' +
      '<div class="job">Job: 3 Bedroom Refurb</div>' +
      '<div class="address">Address: 99 Mountjoy Square,Dublin 1</div>' +
      '<div class="date">Date: 4/13/2019</div>' +
      '<div class="incomplete">Mark as Complete!</div>' +
      "</div>" +
      "</div>" +
      "</li>" +
      "<li>" +
      '<div class="detailsArea">' +
      '<div class="detailsWrap">' +
      '<div class="id">#9</div>' +
      '<div class="job">Job: Living Room Update</div>' +
      '<div class="address">Address: 217 East Wall Road,Dublin 19</div>' +
      '<div class="date">Date: 4/24/2019</div>' +
      '<div class="incomplete">Mark as Complete!</div>' +
      "</div>" +
      "</div>" +
      "</li>" +
      "<li>" +
      '<div class="detailsArea">' +
      '<div class="detailsWrap">' +
      '<div class="id">#6</div>' +
      '<div class="job">Job: Window Replacements</div>' +
      '<div class="address">Address: 198 Fishamble Street,Dublin 10</div>' +
      '<div class="date">Date: 4/13/2019</div>' +
      "<div>Completed!</div>" +
      "</div>" +
      "</div>" +
      "</li>" +
      "</ul>";

    projectList.setState({ projects: testProjectList, loading: false });

    console.log(projectList.html());

    expect(projectList.html()).toEqual(expectedOutput);
  });
});
