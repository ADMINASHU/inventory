import { auth } from "@/auth";
import styles from "@/components/(Customers)/Customers.module.css";
import React from "react";
import Customers from "@/components/(Customers)/Customers";


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
