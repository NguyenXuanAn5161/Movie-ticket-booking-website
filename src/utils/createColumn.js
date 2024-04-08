// Tạo cột
export const createColumn = (
  title,
  dataIndex,
  width,
  sorter = false,
  render = undefined,
  fixed
) => {
  const column = {
    title: title,
    dataIndex: dataIndex,
    width: width,
    sorter: sorter,
    fixed: fixed,
  };

  if (render) {
    console.log("check: ", render);
    column.render = render;
  }

  return column;
};
