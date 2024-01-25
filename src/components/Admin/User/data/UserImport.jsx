import { InboxOutlined } from "@ant-design/icons";
import { Divider, Modal, Table, Upload, message, notification } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";
import { callBulkCreateUser } from "../../../../services/api";

const { Dragger } = Upload;

const UserImport = (props) => {
  const { setOpenModalImport, openModalImport } = props;
  const [dataExcel, setDataExcel] = useState([]);

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("Ok");
    }, 500);
  };

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    //https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(">>>check info.file: ", info.file, info.fileList);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            // chuyen object -> json
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1, // skip dong header
            });

            if (json && json.length > 0) setDataExcel(json);
          };
        }
        message.success(`${info.file.name} tải tệp dữ liệu thành công.`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải tệp dữ liệu thất bại.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });

    const res = await callBulkCreateUser(data);
    console.log(">>> check res: ", res);
    if (res.data) {
      notification.success({
        description: `Thêm dữ liệu thành công: ${res.data.countSuccess}, Thêm dữ liệu thất bại: ${res.data.countError}`,
        message: "Thêm dữ liệu thành công!",
      });
      setDataExcel([]);
      setOpenModalImport(false);
      props.fetchUser();
    } else {
      notification.error({
        description: res.message,
        message: "Đã có lỗi xảy ra!",
      });
    }
  };

  return (
    <>
      <Modal
        title="Tải tệp dữ liệu người dùng"
        width={"50vw"}
        open={openModalImport}
        onOk={() => handleSubmit()}
        onCancel={() => {
          setOpenModalImport(false);
          setDataExcel([]);
        }}
        okText={"Tải tệp dữ liệu"}
        okButtonProps={{ disabled: dataExcel.length < 1 }}
        // khong dong khi click ra ngoai
        maskClosable={false}
      >
        <Divider />
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo tệp vào khu vực này để tải lên
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ tải lên một lần. Chỉ các file có định dạng .csv, .xls, .xlsx
          </p>
        </Dragger>
        <div style={{ paddingTop: 20 }}>
          <Table
            dataSource={dataExcel}
            title={() => <span>Dữ liệu tải lên:</span>}
            columns={[
              { dataIndex: "fullName", title: "Họ và tên" },
              { dataIndex: "email", title: "Email" },
              { dataIndex: "phone", title: "Số điện thoại" },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default UserImport;
