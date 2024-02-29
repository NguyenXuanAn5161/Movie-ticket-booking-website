import { Badge, Descriptions, Drawer, Tag } from "antd";
import moment from "moment";

const PromotionViewDetail = (props) => {
  const {
    openViewDetail,
    dataViewDetail,
    setOpenViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  return (
    <Drawer
      title={`Chi tiết ${dataViewDetail?.name}`}
      width={"50vw"}
      onClose={onClose}
      visible={openViewDetail}
    >
      <Descriptions title="Thông tin Ưu đãi" bordered column={2}>
        <Descriptions.Item label="Mã Ưu đãi">
          {dataViewDetail?.code}
        </Descriptions.Item>
        <Descriptions.Item label="Tên Ưu đãi">
          {dataViewDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">
          {moment(dataViewDetail?.start_date).format("DD-MM-YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">
          {moment(dataViewDetail?.end_date).format("DD-MM-YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {dataViewDetail?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={2}>
          <Badge
            status={
              dataViewDetail?.status === "available" ? "success" : "error"
            }
            text={
              <Tag
                color={
                  dataViewDetail?.status === "available" ? "success" : "error"
                }
              >
                {dataViewDetail?.status === "available"
                  ? "Hoạt động"
                  : "Không hoạt động"}
              </Tag>
            }
          />
        </Descriptions.Item>
      </Descriptions>

      {dataViewDetail?.promotionLines.map((promotionLine) => (
        <Descriptions
          key={promotionLine.id}
          title={promotionLine.name}
          bordered
          column={2}
          style={{ marginTop: "20px" }}
        >
          <Descriptions.Item label="Mã Ưu đãi">
            {promotionLine.code}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>
            {promotionLine.description}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">
            {moment(promotionLine.start_date).format("DD-MM-YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">
            {moment(promotionLine.end_date).format("DD-MM-YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={2}>
            <Badge
              status={
                promotionLine.status === "available" ? "success" : "error"
              }
              text={
                <Tag
                  color={
                    promotionLine.status === "available" ? "success" : "error"
                  }
                >
                  {promotionLine.status === "available"
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </Tag>
              }
            />
          </Descriptions.Item>
          <Descriptions.Item label="Chi tiết Ưu đãi">
            <Descriptions bordered>
              <Descriptions.Item label="Giá trị giảm giá">
                {promotionLine.promotionDetails?.discount_value}%
              </Descriptions.Item>
              <Descriptions.Item label="Chi tiêu tối thiểu">
                {promotionLine.promotionDetails?.min_spend.toLocaleString(
                  "vi-VN"
                )}{" "}
                VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Chi tiêu tối đa">
                {promotionLine.promotionDetails?.max_spend === Infinity
                  ? "Không giới hạn"
                  : promotionLine.promotionDetails?.max_spend.toLocaleString(
                      "vi-VN"
                    )}{" "}
                VNĐ
              </Descriptions.Item>
            </Descriptions>
          </Descriptions.Item>
        </Descriptions>
      ))}
      {!dataViewDetail?.promotionLines.length && (
        <Descriptions
          title="Chi tiết Ưu đãi"
          bordered
          column={2}
          style={{ marginTop: "20px" }}
        >
          <Descriptions.Item label="Giá trị giảm giá">
            {dataViewDetail?.promotionLines[0].promotionDetails?.discount_value}
            %
          </Descriptions.Item>
          <Descriptions.Item label="Chi tiêu tối thiểu">
            {dataViewDetail?.promotionLines[0].promotionDetails?.min_spend.toLocaleString(
              "vi-VN"
            )}{" "}
            VNĐ
          </Descriptions.Item>
          <Descriptions.Item label="Chi tiêu tối đa">
            {dataViewDetail?.promotionLines[0].promotionDetails?.max_spend ===
            Infinity
              ? "Không giới hạn"
              : dataViewDetail?.promotionLines[0].promotionDetails?.max_spend.toLocaleString(
                  "vi-VN"
                )}{" "}
            VNĐ
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default PromotionViewDetail;
