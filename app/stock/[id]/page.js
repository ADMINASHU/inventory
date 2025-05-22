
import { auth } from "@/auth";

import StockDetails from "@/Components/(Stock)/StockDetails";

const StockDetailsPage = async({ params }) => {
  const { id } = await params;
  const session = await auth();
  const loggedUser = session?.user;


 

  return (
    <div>
      <StockDetails id={id} loggedUser={loggedUser} />
    </div>
  );
}

export default StockDetailsPage;