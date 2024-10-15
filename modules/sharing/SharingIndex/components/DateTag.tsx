import { Text, clsx } from "@mantine/core";
import moment from "moment";
import "moment/locale/vi";
import { useRouter } from "next/router";

const DateTag = (props: any) => {
  const { dateTime, className } = props;
  const dateObj = moment(dateTime);
  const router = useRouter();
  const locale = router.locale;
  moment.locale(locale);
  const month = dateObj.format("MMM");
  const day = dateObj.format("DD");

  return (
    <div
      className={clsx(
        "absolute bg-white shadow-md z-100  rounded flex flex-col items-center justify-center",
        className
      )}
    >
      <Text size={16} color="1A1A1A" className="font-semibold">
        {day}
      </Text>
      <Text size={12} className="uppercase" color="#808080">
        {month}
      </Text>
    </div>
  );
};

export default DateTag;
