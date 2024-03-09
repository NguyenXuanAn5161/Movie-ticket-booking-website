import {
  Button,
  Col,
  Divider,
  Drawer,
  Popconfirm,
  Row,
  Table,
  Tag,
} from "antd";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

const FoodCategoriesTable = () => {
  const [listFood, setListFood] = useState([
    {
      _id: "1",
      label: "Phở",
      foods: [
        {
          status: "available",
          name: "Phở bò",
          image:
            "https://th.bing.com/th/id/R.004dae07b47f7f00f35a98961db5000a?rik=byOFasQUj2DYyA&pid=ImgRaw&r=0",
        },
        {
          status: "unavailable",
          name: "Phở gà",
          image:
            "https://th.bing.com/th/id/OIP.62ri7pkZjhq37CBev76W6QHaEK?w=308&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
        {
          status: "available",
          name: "Phở cuốn",
          image:
            "https://th.bing.com/th/id/OIP.Au3fkPN9KsLkyqc54lanKgHaFe?w=241&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "2",
      label: "Bánh mì",
      foods: [
        {
          status: "unavailable",
          name: "Bánh mì thịt",
          image:
            "https://th.bing.com/th/id/OIP.IxSQxenayDYM2oZcHwj7PgHaEo?w=250&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
        {
          status: "available",
          name: "Bánh mì pate",
          image:
            "https://th.bing.com/th/id/OIP.IxSQxenayDYM2oZcHwj7PgHaEo?w=308&h=192&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
        {
          status: "available",
          name: "Bánh mì chảo",
          image:
            "https://th.bing.com/th/id/OIP.JUuFrAwQCXVLaLOsGh_O2wHaE4?w=227&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "3",
      label: "Bún chả",
      foods: [
        {
          status: "unavailable",
          name: "Bún chả Hà Nội",
          image:
            "https://th.bing.com/th/id/OIP.teuX9kbKu-fyNcrWYoKILwHaE9?w=272&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
        {
          status: "available",
          name: "Bún chả Sài Gòn",
          image:
            "https://th.bing.com/th/id/OIP.XCab2pWF1Ourr3HR6nlxmAHaFe?w=267&h=198&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "4",
      label: "Cơm tấm",
      foods: [
        {
          status: "unavailable",
          name: "Cơm tấm sườn",
          image:
            "https://th.bing.com/th/id/OIP.ADGE7S23fWcKNQrKZAdUJAHaEL?w=268&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
        {
          status: "available",
          name: "Cơm tấm bì",
          image:
            "https://th.bing.com/th/id/OIP.yLDdvZNyI_a876RPw5VX6QHaEL?w=228&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "5",
      label: "Gỏi cuốn",
      foods: [
        {
          status: "available",
          name: "Gỏi cuốn tôm thịt",
          image:
            "https://th.bing.com/th/id/OIP.pWM0ubN1MkEWzq3f00UBeQHaEo?w=298&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
        {
          status: "available",
          name: "Gỏi cuốn chay",
          image:
            "https://th.bing.com/th/id/OIP.dPZUZxU2HMgK94rFCwV-wwHaE-?w=195&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "6",
      label: "Bánh xèo",
      foods: [
        {
          status: "unavailable",
          name: "Bánh xèo miền Nam",
          image:
            "https://th.bing.com/th/id/OIP.GvK0JpP-2ApxX6UxKZGgiAHaEL?w=284&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
        {
          status: "available",
          name: "Bánh xèo miền Trung",
          image:
            "https://th.bing.com/th/id/OIP.T1f-qhC1TorG7KNvsKsuNQHaEL?w=291&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "7",
      label: "Bún bò Huế",
      foods: [
        {
          status: "unavailable",
          name: "Bún bò Huế",
          image:
            "https://th.bing.com/th/id/OIP.8G5Jqz-vGiYzisD_1pxOAgHaFL?w=228&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "8",
      label: "Bánh canh",
      foods: [
        {
          status: "available",
          name: "Bánh canh cua",
          image:
            "https://th.bing.com/th/id/OIP.NxmKS6bXzMDntQHWTZNYgQHaE9?w=271&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
        {
          status: "unavailable",
          name: "Bánh canh chả cá",
          image:
            "https://th.bing.com/th/id/OIP.al91yeTyy7vpFqaqGXY6NQHaE8?w=245&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "9",
      label: "Bún riêu",
      foods: [
        {
          status: "available",
          name: "Bún riêu cua",
          image:
            "https://th.bing.com/th/id/OIP.al91yeTyy7vpFqaqGXY6NQHaE8?w=245&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
    {
      _id: "10",
      label: "Chả cá",
      foods: [
        {
          status: "unavailable",
          name: "Chả cá Lã Vọng",
          image:
            "https://th.bing.com/th/id/OIP.5x2fWhuZyGyX0ZAfGOjPoAHaFj?w=211&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        },
      ],
    },
  ]);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const openDrawer = (food) => {
    setSelectedFood(food);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Tên loại đồ ăn",
      dataIndex: "label",
    },
    {
      title: "Danh sách đồ ăn theo loại",
      dataIndex: "foods",
      render: (foods) => (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          {foods.map((food) => (
            <div key={food.name} onClick={() => openDrawer(food)}>
              <img
                src={food.image}
                alt={food.name}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Thao tác",
      render: () => (
        <>
          <Popconfirm
            placement="leftTop"
            title={"Xác nhận xóa đồ ăn"}
            description={"Bạn có chắc chắn muốn xóa đồ ăn này?"}
            okText="Xác nhận"
            cancelText="Hủy"
            onConfirm={() => handleDeleteBook(record._id)}
          >
            <span>
              <AiOutlineDelete
                style={{ color: "red", cursor: "pointer", marginRight: 10 }}
              />
            </span>
          </Popconfirm>

          <CiEdit
            style={{ color: "#f57800", cursor: "pointer" }}
            onClick={() => {
              setDataUpdate(record);
              setOpenModalUpdate(true);
            }}
          />
        </>
      ),
    },
  ];

  const onClose = () => {
    setDrawerVisible(false);
    setSelectedFood(null);
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}></Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={listFood}
            rowKey="_id"
            pagination={false}
          />
        </Col>
      </Row>

      <Drawer
        width={"40vw"}
        title={selectedFood ? selectedFood.name : ""}
        placement="right"
        closable={true}
        onClose={onClose}
        open={drawerVisible}
      >
        {selectedFood && (
          <div>
            <div
              style={{
                backgroundColor: "#F5F5F5",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                padding: 10,
              }}
            >
              <img
                src={selectedFood.image}
                alt={selectedFood.name}
                style={{
                  width: 250,
                  height: "auto",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              />
            </div>
            <Divider style={{ margin: "10px 0" }} />

            <p style={{ marginBottom: 10 }}>
              Tên món ăn:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {selectedFood.name}
              </span>
            </p>
            <Divider style={{ margin: "10px 0" }} />

            <p style={{ marginBottom: 10 }}>
              Giá:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {selectedFood.price ? selectedFood.price : "10$"}
              </span>
            </p>
            <Divider style={{ margin: "10px 0" }} />

            <p style={{ marginBottom: 10 }}>
              Loại:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {selectedFood.category ? selectedFood.category : "loại 1"}
              </span>
            </p>
            <Divider style={{ margin: "10px 0" }} />

            <p style={{ marginBottom: 10 }}>
              Trạng thái:{" "}
              <Tag
                color={selectedFood.status === "available" ? "green" : "red"}
              >
                {selectedFood.status === "available" ? (
                  <span style={{ fontSize: 16, fontWeight: "500" }}>Còn</span>
                ) : (
                  <span style={{ fontSize: 16, fontWeight: "500" }}>Hết</span>
                )}
              </Tag>
            </p>
            <Divider style={{ margin: "10px 0" }} />

            {/* Thêm các nút Xóa và Cập nhật */}
            <div style={{ marginTop: 20 }}>
              <Popconfirm
                placement="topLeft"
                title={"Xác nhận xóa món ăn"}
                description={"Bạn có chắc chắn muốn xóa món ăn này?"}
                okText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => handleDeleteFood(selectedFood._id)}
              >
                <Button type="danger" style={{ marginRight: 10 }}>
                  Xóa
                </Button>
              </Popconfirm>

              <Button type="primary">Cập nhật</Button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default FoodCategoriesTable;
