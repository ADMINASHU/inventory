
import { auth } from '@/auth';
import Transaction from '@/components/(Transaction)/Transaction'
import React from 'react'

const TransactionPage = async() => {
  const session =await auth();
  const loggedUser = session?.user;

  return (
   <Transaction loggedUser={loggedUser} />
  )
}

export default TransactionPage