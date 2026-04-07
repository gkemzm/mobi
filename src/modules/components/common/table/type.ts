import { ReactNode } from "react";

export interface CommonTableColumn<T> {
  id: string;
  label: string;
  width?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (item: T) => ReactNode;
}

export interface CommonTableProps<T> {
  title?: string;
  columns: CommonTableColumn<T>[];
  items: T[];
  rowKey: (item: T) => string;

  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onChangePage?: (page: number) => void;

  selectable?: boolean;
  selectedRowIds?: string[];
  onChangeSelectedRowIds?: (ids: string[]) => void;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (columnId: string, order: "asc" | "desc") => void;

  headerAction?: ReactNode;
  toolbar?: ReactNode;
  emptyText?: string;
}
