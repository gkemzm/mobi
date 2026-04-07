"use client";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import classes from "./CommonTable.module.scss";
import { CommonTableColumn, CommonTableProps } from "./type";

const CommonTable = <T,>({
  title,
  columns,
  items,
  rowKey,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onChangePage,
  selectable = false,
  selectedRowIds = [],
  onChangeSelectedRowIds,
  sortBy,
  sortOrder = "desc",
  onSort,
  headerAction,
  toolbar,
  emptyText = "데이터가 없습니다.",
}: CommonTableProps<T>) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const isAllChecked =
    selectable &&
    items.length > 0 &&
    items.every((item) => selectedRowIds.includes(rowKey(item)));

  const handleToggleAll = (checked: boolean) => {
    if (!onChangeSelectedRowIds) return;

    if (checked) {
      onChangeSelectedRowIds(items.map((item) => rowKey(item)));
      return;
    }

    onChangeSelectedRowIds([]);
  };

  const handleToggleItem = (id: string, checked: boolean) => {
    if (!onChangeSelectedRowIds) return;

    if (checked) {
      if (selectedRowIds.includes(id)) return;
      onChangeSelectedRowIds([...selectedRowIds, id]);
      return;
    }

    onChangeSelectedRowIds(selectedRowIds.filter((itemId) => itemId !== id));
  };

  return (
    <section className={classes.container}>
      {(title || headerAction) && (
        <div className={classes.header}>
          {title && <h3 className={classes.title}>{title}</h3>}
          {headerAction}
        </div>
      )}

      {toolbar && <div className={classes.toolbar}>{toolbar}</div>}

      <div className={classes.tableWrap}>
        <table className={classes.table}>
          <colgroup>
            {selectable && <col style={{ width: "52px" }} />}
            {columns.map((column) => (
              <col key={column.id} style={{ width: column.width }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              {selectable && (
                <th>
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={(e) => handleToggleAll(e.target.checked)}
                  />
                </th>
              )}

              {columns.map((column) => {
                const isActiveSort = sortBy === column.id;

                return (
                  <th
                    key={column.id}
                    className={column.sortable ? classes.sort : classes.normal}
                    onClick={() => {
                      if (!column.sortable || !onSort) return;
                      const nextOrder =
                        isActiveSort && sortOrder === "desc" ? "asc" : "desc";
                      onSort(column.id, nextOrder);
                    }}
                  >
                    {column.label}

                    {column.sortable && (
                      <span className={classes.sortArea}>
                        {isActiveSort ? (
                          sortOrder === "desc" ? (
                            <FiChevronDown />
                          ) : (
                            <FiChevronUp />
                          )
                        ) : null}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className={classes.empty}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const id = rowKey(item);

                return (
                  <tr key={id}>
                    {selectable && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRowIds.includes(id)}
                          onChange={(e) =>
                            handleToggleItem(id, e.target.checked)
                          }
                        />
                      </td>
                    )}

                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={
                          column.align === "right"
                            ? classes.right
                            : column.align === "center"
                            ? classes.center
                            : ""
                        }
                      >
                        {column.render ? column.render(item) : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {onChangePage && totalPages > 0 && (
        <div className={classes.footer}>
          <span className={classes.paginationInfo}>
            {items.length > 0
              ? `${(currentPage - 1) * 10 + 1}-${
                  (currentPage - 1) * 10 + items.length
                }`
              : "0-0"}{" "}
            / {totalCount}
          </span>

          <div className={classes.pagination}>
            <button
              type="button"
              className={classes.pageArrow}
              onClick={() => onChangePage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            {pages.map((page) => (
              <button
                key={page}
                type="button"
                className={`${classes.pageButton} ${
                  currentPage === page ? classes.pageActive : ""
                }`}
                onClick={() => onChangePage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className={classes.pageArrow}
              onClick={() =>
                onChangePage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CommonTable;
