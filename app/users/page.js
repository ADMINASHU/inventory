import { auth } from "@/auth";
import styles from "@/Components/(Users)/Users.module.css";
import React from "react";
import Users from "@/components/(Users)/Users";


const UsersPage = async () => {
  const session = await auth();
  const LoggedUser = session?.user;

  return (
    <div className={styles.userContainer}>
      <Users LoggedUser={LoggedUser} />
    </div>
  );
};

export default UsersPage;
