import { Divider, Modal } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";

const UserExport = (props) => {
  const { setOpenModalExport, openModalExport, listUser } = props;
  const [selectedFormat, setSelectedFormat] = useState("xlsx");

  const handleChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleExportData = () => {
    // https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
    if (listUser.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, `ExportUser.${selectedFormat}`);
    }

    setOpenModalExport(false);
    setSelectedFormat("xlsx");
  };

  return (
    <>
      <Modal
        title="Xuất tệp dữ liệu người dùng dưới dạng"
        width={"30vw"}
        open={openModalExport}
        onOk={() => handleExportData()}
        onCancel={() => {
          setOpenModalExport(false);
          setSelectedFormat("xlsx");
        }}
        // khong dong khi click ra ngoai
        maskClosable={false}
      >
        <Divider />
        <div style={{ userSelect: "none" }}>
          <input
            type="radio"
            id="xlsx"
            name="formatFile"
            value="xlsx"
            style={{ marginRight: 10 }}
            checked={selectedFormat === "xlsx"}
            onChange={handleChange}
          />
          <label htmlFor="xlsx">Microsoft Excel (.xlsx)</label>
          <br />
          <input
            type="radio"
            id="csv"
            name="formatFile"
            value="csv"
            style={{ marginRight: 10 }}
            checked={selectedFormat === "csv"}
            onChange={handleChange}
          />
          <label htmlFor="csv">
            File dữ liệu được phân cách bởi dấu phẩy (.csv)
          </label>
        </div>
      </Modal>
    </>
  );
};

export default UserExport;
