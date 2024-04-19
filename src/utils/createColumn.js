// Tạo cột
export const createColumn = (
  title,
  dataIndex,
  width,
  sorter = false,
  render = undefined,
  fixed,
  filters = [],
  onFilter = undefined
) => {
  const column = {
    title: title,
    dataIndex: dataIndex,
    width: width,
    sorter: sorter,
    fixed: fixed,
  };

  if (render) {
    column.render = render;
  }

  if (filters.length > 0) {
    column.filters = filters;
  }

  if (onFilter) {
    column.onFilter = onFilter;
  }

  return column;
};
