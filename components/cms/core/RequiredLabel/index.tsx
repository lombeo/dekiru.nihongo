import React from 'react'
import styles from "./RequiredLabel.module.scss"
export const RequiredLabel = (props: any) => {
    const { children } = props;
    return (
        <span className={styles["edn-alterisk"]}>
            {children}
        </span>
    )
}