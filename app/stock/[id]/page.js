
import { auth } from "@/auth";
import styles from "@/components/(Stock)/Stock.module.css";
import StockDetails from "@/components/(Stock)/StockDetails";

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