import { auth } from "@/auth";
import styles from "@/Components/(Customers)/Customers.module.css";
import React from "react";
import Customers from "@/Components/(Customers)/Customers";


const CustomersPage = async () => {
  const session = await auth();
  const LoggedCustomer = session?.customer;

  return (
    <div className={styles.customerContainer}>
      <Customers LoggedCustomer={LoggedCustomer} />
    </div>
  );
};

export default CustomersPage;
