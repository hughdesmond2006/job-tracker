import React, { PureComponent } from "react";
import Project from "../../interfaces/Project";
import styles from "./ProjectCard.module.scss";
import store from "../../redux/store";
import { completeProjectBegin } from "../../redux/actions/projectActions";

class ProjectCard extends PureComponent<Project> {
  markCompleted = (id: number): void => {
    store.dispatch(completeProjectBegin(id));
  };

  render() {
    const { id, name, address, startDate, completed } = this.props;

    const completedClass = completed ? " " + styles.completed : "";
    const titleCompletedClass = completed ? " " + styles.titleCompleted : "";

    return (
      <div className={styles.detailsArea + completedClass}>
        <div className={styles.id + completedClass}>#{id}</div>
        <div className={styles.date + completedClass}>
          {new Date(startDate).toLocaleDateString("en-GB")}
        </div>
        <div className={styles.job}>
          <div className={styles.title + titleCompletedClass}>Project</div> {name}
        </div>
        <div className={styles.address}>
          <div className={styles.title + titleCompletedClass}>Address</div>{" "}
          {address.toString()}
        </div>
        {completed ? (
          <div className={styles.completeButton + completedClass}>
            Completed!
          </div>
        ) : (
          <div
            className={styles.completeButton}
            onClick={this.markCompleted.bind(this, id)}
          >
            Mark as Complete!
          </div>
        )}
      </div>
    );
  }
}

export default ProjectCard;
