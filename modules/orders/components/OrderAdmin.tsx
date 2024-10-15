import { OverlayLoading } from "@edn/components";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAnalytics from "./OrderAnalytics";
import OrdersFilter from "./OrdersFilter";
import OrdersTable from "./OrdersTable";

export const OrderAdmin = () => {
  const router = useRouter();

  const isCanAccess = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent, UserRole.MonitorOrder]);

  useEffect(() => {
    if (!isCanAccess) {
      router.push("/403");
    }
  }, [isCanAccess]);

  if (!isCanAccess) return <OverlayLoading />;
  
  return (
    <>
      <div>
        <OrderAnalytics />
        <div className="mt-5 block md:flex items-end gap-2">
          <OrdersFilter isAdmin />
        </div>
        <OrdersTable isAdmin />
      </div>
    </>
  );
};
