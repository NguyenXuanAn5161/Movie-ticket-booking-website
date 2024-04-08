import { Popconfirm } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";

const ActionButtons = ({
  record,
  handleDelete,
  handleView,
  showDelete,
  showEdit,
  showView,
  itemName,
}) => {
  return (
    <>
      {showDelete && (
        <Popconfirm
          placement="leftTop"
          title={`Xác nhận xóa ${itemName}?`}
          description={`Bạn có chắc chắn muốn xóa ${itemName} này?`}
          okText="Xác nhận"
          cancelText="Hủy"
          onConfirm={() => handleDelete(record.id)}
        >
          <span>
            <AiOutlineDelete
              style={{ color: "red", cursor: "pointer", marginRight: 10 }}
            />
          </span>
        </Popconfirm>
      )}
      {showView && (
        <BsEye
          style={{ cursor: "pointer", marginRight: 10 }}
          onClick={() => handleView(record, "show")}
        />
      )}
      {showEdit && (
        <CiEdit
          style={{ cursor: "pointer", color: "#F7C566" }}
          onClick={() => {
            handleView(record, "edit");
          }}
        />
      )}
    </>
  );
};

export default ActionButtons;
