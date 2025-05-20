
import styles from "@/components/(Stock)/Stock.module.css";
import StockDetails from "@/components/(Stock)/StockDetails";

const StockDetailsPage = async({ params }) => {
  const { id } = await params;
 

  return (
    <div className={styles.detailsPage}>
      <StockDetails id={id} />
    </div>
  );
}

export default StockDetailsPage;