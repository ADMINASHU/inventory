import Stock from '@/Components/(Stock)/Stock'
import React from 'react'
import { auth } from '@/auth';

const StockPage = async () => {
    const session =await auth();
    const loggedUser = session?.user;
  return (
  <Stock loggedUser={loggedUser} />
  )
}

export default StockPage