import { Breadcrumb } from "antd";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function CustomBreadcrumb(props) {
  const location = useLocation();

  const items = [
    {
      path: "/admin",
      title: "",
      key: "admin",
      children: [
        {
          path: "/dashboard",
          title: "Tổng quan",
          key: "dashboard",
        },
        {
          path: "/order",
          title: "Hóa đơn",
          key: "order",
        },
        {
          path: "/user",
          title: "Người dùng",
          key: "user",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết người dùng",
              key: "userShow",
            },
            {
              path: "/create",
              title: "Tạo mới người dùng",
              key: "userCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật người dùng",
              key: "userEdit",
            },
          ],
        },
        {
          path: "/movie",
          title: "Phim",
          key: "movie",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết phim",
              key: "movieShow",
            },
            {
              path: "/create",
              title: "Tạo mới phim",
              key: "movieCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật phim",
              key: "movieEdit",
            },
          ],
        },
        {
          path: "/cinema",
          title: "Rạp chiếu",
          key: "cinema",
          children: [
            {
              path: "/room",
              title: "Phòng chiếu",
              key: "room",
              children: [
                {
                  path: "/seat",
                  title: "Ghế",
                  key: "seat",
                },
                {
                  path: "/seatType",
                  title: "Loại ghế",
                  key: "seatType",
                },
              ],
            },
          ],
        },
        {
          path: "/food",
          title: "Đồ ăn",
          key: "food",
        },
        {
          path: "/foodCategories",
          title: "Loại đồ ăn",
          key: "foodCategories",
        },
        {
          path: "/promotion",
          title: "Khuyến mãi",
          key: "promotion",
        },
      ],
    },
  ];

  let pathChildren = [];

  useEffect(() => {
    console.log("pathChildren useefect: ", pathChildren);
  }, [pathChildren]);

  const getItemByPath = (path, itemList) => {
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i];
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const foundItem = getItemByPath(path, item.children);
        if (foundItem) {
          if (foundItem.children) {
            pathChildren = foundItem.children;
          }
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
      if (pathChildren.length > 0) {
        console.log("pathChildren in itemRender: ", pathChildren);

        // Kiểm tra xem route.path trùng với bất kỳ đường dẫn nào trong pathChildren
        const matchingPathChild = pathChildren.find(
          (pathChild) => pathChild.path === route.path
        );

        console.log(
          "Check route.path cos trung hay khong: ",
          matchingPathChild
        );

        // Nếu tìm thấy đường dẫn trùng khớp, trả về tiêu đề của mục đó
        if (matchingPathChild) {
          return (
            <span>{matchingPathChild ? matchingPathChild.title : null}</span>
          );
        }
      }
      // Nếu không có đường dẫn trùng khớp hoặc không có pathChildren, hiển thị tiêu đề của item (nếu tồn tại)
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
    itemsPath = currentPath.split("/").map((path) => ({ path: `/${path}` }));
  }

  // Trả về phần tử Breadcrumb với itemsPath và itemRender
  return <Breadcrumb itemRender={itemRender} items={itemsPath} />;
}

export default CustomBreadcrumb;
