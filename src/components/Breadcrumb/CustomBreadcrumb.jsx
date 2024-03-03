import { Breadcrumb } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

function CustomBreadcrumb(props) {
  const location = useLocation();

  const items = [
    {
      path: "/admin",
      title: "",
      children: [
        {
          path: "/dashboard",
          title: "Tổng quan",
        },
        {
          path: "/order",
          title: "Hóa đơn",
        },
        {
          path: "/user",
          title: "Người dùng",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết người dùng",
            },
            {
              path: "/create",
              title: "Tạo mới người dùng",
            },
            {
              path: "/edit",
              title: "Cập nhật người dùng",
            },
          ],
        },
        {
          path: "/movie",
          title: "Phim",
        },
        {
          path: "/cinema",
          title: "Rạp chiếu",
          children: [
            {
              path: "/room",
              title: "Phòng chiếu",
              children: [
                {
                  path: "/seat",
                  title: "Ghế",
                },
                {
                  path: "/seatType",
                  title: "Loại ghế",
                },
              ],
            },
          ],
        },
        {
          path: "/food",
          title: "Đồ ăn",
        },
        {
          path: "/foodCategories",
          title: "Loại đồ ăn",
        },
        {
          path: "/promotion",
          title: "Khuyến mãi",
        },
      ],
    },
  ];

  const getItemByPath = (path, itemList) => {
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i];
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const foundItem = getItemByPath(path, item.children);
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return null;
  };

  const currentPath = location.pathname;

  const itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    const item = getItemByPath(route.path, items);

    // Không render title cho mục đầu tiên
    if (route.path === "/admin") {
      return null;
    }

    // Kiểm tra nếu route là 'show', 'edit', hoặc 'create' thì chỉ hiển thị span
    if (["/show", "/edit", "/create"].includes(route.path)) {
      return <span>{item ? item.title : null}</span>;
    }

    return last ? (
      <span>{item ? item.title : null}</span>
    ) : (
      <Link to={paths.join("/")}>{item ? item.title : null}</Link>
    );
  };

  // Tạo mảng itemsPath dựa trên điều kiện
  let itemsPath;
  if (currentPath.includes("/show") || currentPath.includes("/edit")) {
    const showOrEditIndex = Math.max(
      currentPath.indexOf("/show"),
      currentPath.indexOf("/edit")
    );
    const showOrEditPath = currentPath.substring(0, showOrEditIndex + 5); // +5 để bao gồm "/show"
    itemsPath = showOrEditPath;
    itemsPath = itemsPath.split("/").map((path) => ({ path: `/${path}` }));
  } else {
    console.log("currentPath: ", currentPath);
    itemsPath = currentPath.split("/").map((path) => ({ path: `/${path}` }));
  }

  // Trả về phần tử Breadcrumb với itemsPath và itemRender
  return <Breadcrumb itemRender={itemRender} items={itemsPath} />;
}

export default CustomBreadcrumb;
