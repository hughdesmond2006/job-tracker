import React, { Component } from "react";
import { connect } from "react-redux";
import {fetchProjectsBegin, resetBegin} from "../../redux/actions/projectActions";
import store from "../../redux/store";

import Project from "../../interfaces/Project";
import ProjectCard from "../ProjectCard/ProjectCard";
import styles from "./ProjectList.module.scss";
import Spinner from "../Spinner/Spinner";
import AppState from "../../interfaces/AppState";

export class ProjectList extends Component<AppState> {
  componentDidMount() {
    store.dispatch(fetchProjectsBegin());
  }

  reset = (): void => {
    store.dispatch(resetBegin());
  };

  sortNewestFirst = (project1: Project, project2: Project) => {
    return new Date(project1.startDate) > new Date(project2.startDate) ? -1 : 1;
  };

  sortIncompleteFirst = (project1: Project, project2: Project) => {
    return !project1.completed && project2.completed ? -1 : 1;
  };

  render() {
    const { projects, loading, error } = this.props;

    return (
      <React.Fragment>
        <div className={styles.reset} onClick={this.reset}>
          Reset
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <ul className={styles.list}>
            {projects
              .sort(this.sortNewestFirst)
              .sort(this.sortIncompleteFirst)
              .map((project: Project) => {
                return (
                  <li key={project.id}>
                    <ProjectCard
                      id={project.id}
                      name={project.name}
                      address={project.address}
                      startDate={project.startDate}
                      completed={project.completed}
                    />
                  </li>
                );
              })}
          </ul>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  projects: state.projects,
  loading: state.loading,
  error: state.error
});

export default connect(mapStateToProps)(ProjectList);
