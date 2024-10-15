import { OrderAdmin } from "./components/OrderAdmin";
import OrderOwner from "./components/OrderOwner";

interface OrderListHistoryProps {
  isAdmin?: boolean;
}

const OrderListHistory = (props: OrderListHistoryProps) => {
  const { isAdmin } = props;
  return (
    <div className="max-w-[1200px] m-auto">
      {isAdmin && <OrderAdmin />}
      {!isAdmin && <OrderOwner />}
    </div>
  );
};

export default OrderListHistory;
