import { Breadcrumbs as BreadcrumbsCore } from "@mantine/core";
import Link from "@src/components/Link";
import { ChevronRight } from "tabler-icons-react";

interface BreadcrumbsProps {
  size?: string;
  data?: any;
  isWhite?: boolean;
  className?: string;
}

const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { data, isWhite } = props;
  if (!data) return <div className="w-full py-5"></div>;

  const items = data.map((item, index) => {
    const color = isWhite ? "!text-white" : "!text-[#2c31cf]";
    const bold = "";
    const isLasted = index === data.length - 1;
    if (isLasted) {
      return (
        <span key={index} style={{ wordBreak: "break-word" }} className={`text-[13px] whitespace-normal ${color}`}>
          {item.title}
        </span>
      );
    }
    if (!item.href) {
      return (
        <div className={`text-[13px] ${color} ${bold}`} key={index}>
          {item.title}
        </div>
      );
    }
    return (
      <Link href={item.href} className={`${color} ${bold} text-[13px]  hover:underline`} key={index}>
        {item.title}
      </Link>
    );
  });

  return (
    <nav className="w-full py-5">
      <BreadcrumbsCore
        className="flex-wrap gap-y-3 leading-loose text-sm"
        separator={<ChevronRight color={isWhite ? "white" : "#2c31cf"} size={15} />}
      >
        {items}
      </BreadcrumbsCore>
    </nav>
  );
};
export default Breadcrumbs;
