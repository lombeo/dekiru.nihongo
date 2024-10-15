import React from "react";
import styles from "./Progress.module.scss";

function Progress(props: any) {
  const { value, height } = props;
  const colorTrack = value >= 30 ? (value >= 70 ? "#2FA34E" : "#EE5A00") : "red";
  return (
    <div className={styles.wrapper}>
      <div className={styles.track} style={{ height: height }}>
        <div className={styles["edn-progress-bar"]} style={{ width: value + "%", backgroundColor: colorTrack }}></div>
      </div>
      <span className={styles["edn-progress-label"]}>{value + "%"}</span>
    </div>
  );
}

export default Progress;
