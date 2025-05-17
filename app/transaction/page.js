
import { auth } from '@/auth';
import Transaction from '@/components/(Transaction)/Transaction'
import React from 'react'

const TransactionPage = async() => {
  const session =await auth();
  const loggedUser = session?.user;
  console.log(loggedUser?._id);
  return (
   <Transaction loggedUser={loggedUser} />
  )
}

export default TransactionPage