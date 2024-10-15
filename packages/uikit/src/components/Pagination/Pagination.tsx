import { Pagination as MantinePagination } from "@mantine/core";
import { useTranslation } from "next-i18next";
import React from "react";

export interface PaginationProps {
  pageIndex: number;
  currentPageSize: number;
  totalItems?: number;
  totalPages: number;
  label?: string;
  pageSize: number;
  onChange?: any;
  size?: "md" | "sm" | "xs";
}

const Pagination = ({
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
    <div className={`flex justify-end ${totalPages <= 0 ? "hidden" : ""}`}>
      <div className="flex flex-col flex-wrap md:flex-row items-center gap-3">
        {label && label.length > 0 && (
          <span className="text-right flex-none ml-auto">
            {`${t("Show")} ${previousTotal + 1} - `}
            {previousTotal + currentPageSize} {`${t("of")} ${totalItems} ${label}`}
          </span>
        )}
        <MantinePagination
          total={totalPages}
          className="ml-auto"
          position="right"
          withEdges
          size={size}
          value={pageIndex}
          onChange={onChange}
          //   styles={{
          //     item: {
          //       background: 'var(--color-smoke)',
          //       border: 'none',
          //       'min-width': '40px',
          //       'border-radius': '8px',
          //       height: '40px',
          //       opacity: 1,
          //       color: 'var(--color-black)',
          //       transition: 'all 300ms',
          //       '&:hover:not(:disabled)': {
          //         background: 'var(--color-blue)',
          //         color: 'var(--color-white)',
          //       },
          //       ':disabled': {
          //         color: 'var(--color-gray)',
          //         opacity: 1,
          //       },
          //       svg: {
          //         transform: 'scale(1.4)',
          //       },
          //     },
          //     active: { background: 'var(--color-blue)' },
          //   }}
        />
      </div>
    </div>
  );
};

export default Pagination;
