import OrdersFilter from "./OrdersFilter";
import OrdersTable from "./OrdersTable";

const OrderOwner = () => {
  return (
    <>
      <div>
        <div className="block md:flex items-end gap-2 mt-2">
          <OrdersFilter />
        </div>
        <OrdersTable />
      </div>
    </>
  );
};

export default OrderOwner;
