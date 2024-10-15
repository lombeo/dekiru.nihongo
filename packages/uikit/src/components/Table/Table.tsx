import { Pagination } from "@edn/components";
import { Image, Skeleton } from "@mantine/core";
import clsx from "clsx";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import styles from "./Table.module.scss";

export interface TableColumn {
  title?: string;
  dataIndex?: string;
  headClassName?: string;
  className?: string;
  wrapClassName?: string;
  isIndex?: boolean;
  isRanking?: boolean;
  disabled?: boolean;
  render?: any;
  renderHeading?: any;
  noData?: string;
}
//Interface for pagination.
interface PaginationProps {
  wrapData?: any;
  onChangePage?: any;
  label?: string;
}
//Table Interface
interface TableProps {
  data: any;
  wrapData?: any;
  metaData?: any;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  columns: any;
  wrapClassName?: string;
  className?: string;
  rowClassName?: string;
  isLoading?: boolean;
  noData?: string;
  pagination?: PaginationProps;
  onClickRow?: any;
  onChangePage?: any;
  paginationLabel?: any;
  startIndex?: number;
}
const ColumnContent = (data: any, column: TableColumn, startIndex: number, index: number) => {
  if (column.isIndex) {
    if (column.isRanking) {
      const rank = startIndex + index;
      if (rank < 4) {
        return <Image width={24} height={24} fit="cover" alt="" src={`/images/top${index}.svg`} />;
      }
    }
    return startIndex + index;
  }
  if (column.render) {
    return column.render(data);
  }
  if (!isNil(column.dataIndex)) {
    return data[column.dataIndex];
  }
  return null;
};

const TableMetaDataPagination = (props: any) => {
  const { metaData, currentPageSize, label, onChangePage } = props;
  if (metaData.total < metaData.pageSize && metaData.pageIndex === 1) return null;
  if (metaData.total) {
    return (
      <div className="mt-8 pb-8">
        <Pagination
          pageIndex={metaData.pageIndex}
          currentPageSize={currentPageSize}
          totalItems={metaData.total}
          totalPages={metaData.pageTotal}
          label={label}
          pageSize={metaData.pageSize}
          onChange={onChangePage}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

const TablePagination = (props: PaginationProps) => {
  const { wrapData, label, onChangePage } = props;
  if (wrapData.rowCount) {
    return (
      <div className="mt-8 pb-8">
        <Pagination
          pageIndex={wrapData.currentPage}
          currentPageSize={wrapData.results?.length || 0}
          totalItems={wrapData.rowCount}
          totalPages={wrapData.pageCount}
          label={label}
          pageSize={wrapData.pageSize}
          onChange={onChangePage}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

const Table = (props: TableProps) => {
  const {
    data,
    wrapData,
    metaData,
    columns,
    wrapClassName = "",
    className = "",
    rowClassName = "",
    isLoading = false,
    noData = "",
    onClickRow,
    onChangePage,
    paginationLabel,
    size = "md",
    startIndex
  } = props;
  const startIndexTable = (metaData && (metaData.pageIndex - 1) * metaData.pageSize + 1) || 1;

  let rowData;

  const { t } = useTranslation();

  if (data?.length) {
    rowData = data.map((row: any, rowIndex: number) => (
      <tr key={"row-" + rowIndex} className={rowClassName} onClick={() => onClickRow && onClickRow(row)}>
        {columns.map(
          (column: TableColumn, idx: number) =>
            !column.disabled && (
              <td
                key={"col-" + idx}
                className={clsx(
                  {
                    "text-center": column.isIndex,
                  },
                  column.className
                )}
              >
                {ColumnContent(row, column, startIndex || startIndexTable, rowIndex)}
              </td>
            )
        )}
      </tr>
    ));
  } else {
    const colsNotDisable = columns.filter((column: any) => !column.disabled);
    rowData = (
      <tr>
        <td className="text-center" colSpan={colsNotDisable.length}>
          {noData ? noData : t("No data")}
        </td>
      </tr>
    );
  }
  return (
    <>
      <div className={wrapClassName + " " + styles["edn-table"] + " " + styles[size]}>
        <table className={className}>
          <thead>
            <tr>
              {columns.map(
                (column: TableColumn, idx: number) =>
                  !column.disabled && (
                    <th key={idx} className={column.headClassName}>
                      {column.renderHeading ? column.renderHeading(data) : column.title}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <Skeleton height={15} width="100%" radius="xl" />
                  <Skeleton height={15} width="100%" mt={8} radius="xl" />
                  <Skeleton height={15} width="100%" mt={8} radius="xl" />
                  <Skeleton height={15} width="100%" mt={8} radius="xl" />
                </td>
              </tr>
            ) : (
              rowData
            )}
          </tbody>
        </table>
      </div>
      {data && metaData && (
        <TableMetaDataPagination
          currentPageSize={data?.length || 0}
          label={paginationLabel}
          onChangePage={onChangePage}
          metaData={metaData}
        />
      )}
      {data && wrapData && !metaData && (
        <TablePagination label={paginationLabel} wrapData={wrapData} onChangePage={onChangePage} />
      )}
    </>
  );
};
export default Table;
