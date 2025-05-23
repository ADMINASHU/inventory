import React from "react";
import styles from "./page.module.css";

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to Our Application!</h1>
      <p>We&apos;re excited to have you here. Let&apos;s get you started with a quick overview.</p>
    </div>
  );
};

export default WelcomePage;
