import { auth } from "@/auth";
import styles from "@/components/(Branch)/Branch.module.css";
import React from "react";
import Branch from "@/components/(Branch)/Branch";


const BranchPage = async () => {
  const session = await auth();
  const LoggedBranch = session?.branch;

  return (
    <div className={styles.branchContainer}>
      <Branch LoggedBranch={LoggedBranch} />
    </div>
  );
};

export default BranchPage;
