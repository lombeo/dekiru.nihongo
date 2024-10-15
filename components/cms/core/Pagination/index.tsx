import { Pagination } from "@mantine/core";
import { useTranslation } from "next-i18next";

export interface PaginationProps {
  pageIndex: number;
  currentPageSize: number;
  totalItems: number;
  totalPages: number;
  label?: string;
  pageSize: number;
  onChange?: any;
  size?: "md" | "sm" | "xs";
}

export const AppPagination = ({
  pageIndex,
  currentPageSize,
  totalItems,
  totalPages,
  label,
  pageSize,
  onChange,
  size = "md",
}: PaginationProps) => {
  const { t } = useTranslation();

  const previousTotal = (pageIndex - 1) * pageSize;

  return (
    <div className="flex justify-end">
      <div className="flex items-center justify-between gap-3">
        {label && label.length > 0 && (
          <span>
            {t("Show")} {previousTotal + (totalItems == 0 ? totalItems : 1)} - {previousTotal + currentPageSize}{" "}
            {t("of")} {totalItems} {/* {t(FunctionBase.formatPluralString(label, totalItems))} */}
            {label}
          </span>
        )}
        <Pagination total={totalPages} position="right" size={size} value={pageIndex} onChange={onChange} />
      </div>
    </div>
  );
};
