export enum OrderUnitEnum {
  /// <summary>
  /// Status when create order
  /// </summary>
  Pending = 0,

  /// <summary>
  /// Status when call to fox pay
  /// </summary>
  Sent = 1,

  /// <summary>
  /// Success payment
  /// </summary>
  Success = 2,

  /// <summary>
  /// Fail payments
  /// </summary>
  Fail = 3,
}

export type OrderUnit = {
  type: OrderUnitEnum;
  label?: string;
  icon?: any;
};

export const GetStatusName = (status: number) => {
  let statusName = "";
  switch (status) {
    case OrderUnitEnum.Pending:
      statusName = "Pending";
      break;
    case OrderUnitEnum.Sent:
      statusName = "Processing";
      break;
    case OrderUnitEnum.Fail:
      statusName = "Failured";
      break;
    case OrderUnitEnum.Success:
      statusName = "Successfully";
      break;
    default:
      break;
  }
  return statusName;
};

export const testOrderStatus: { value: boolean; selectValue: string }[] = [
  { value: undefined || null, selectValue: "" },
  { value: false, selectValue: "0" },
  { value: true, selectValue: "1" },
];

export const timeFormat = [
  { value: "1", format: "DD/MM/YYYY" },
  { value: "2", format: "MM/YYYY" },
  { value: "3", format: "YYYY" },
];


export const timeFilter = [{ field: "fromDate" }, { field: "toDate" }];
