import { Breadcrumb } from "antd";
import React from "react";
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
          path: "/movieGenre",
          title: "Thể loại phim",
          key: "movieGenre",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết thể loại phim",
              key: "movieGenreShow",
            },
            {
              path: "/create",
              title: "Tạo mới thể loại phim",
              key: "movieGenreCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật thể loại phim",
              key: "movieGenreEdit",
            },
          ],
        },
        {
          path: "/cinema",
          title: "Rạp chiếu",
          key: "cinema",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết rạp phim",
              key: "roomShow",
            },
            {
              path: "/create",
              title: "Tạo mới rạp phim",
              key: "roomCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật rạp phim",
              key: "roomEdit",
            },
            {
              path: "/room",
              title: "Phòng chiếu",
              key: "room",
              children: [
                {
                  path: "/show",
                  title: "Xem chi tiết phòng",
                  key: "cinemaShow",
                },
                {
                  path: "/create",
                  title: "Tạo mới phòng",
                  key: "cinemaCreate",
                },
                {
                  path: "/edit",
                  title: "Cập nhật phòng",
                  key: "cinemaEdit",
                },
                // {
                //   path: "/seat",
                //   title: "Ghế",
                //   key: "seat",
                //   children: [
                //     {
                //       path: "/show",
                //       title: "Xem chi tiết ghế",
                //       key: "seatShow",
                //     },
                //     {
                //       path: "/create",
                //       title: "Tạo mới ghế",
                //       key: "seatCreate",
                //     },
                //     {
                //       path: "/edit",
                //       title: "Cập nhật ghế",
                //       key: "seatEdit",
                //     },
                //   ],
                // },
                // {
                //   path: "/seatType",
                //   title: "Loại ghế",
                //   key: "seatType",
                //   children: [
                //     {
                //       path: "/show",
                //       title: "Xem chi tiết loại ghế",
                //       key: "seatTypeShow",
                //     },
                //     {
                //       path: "/create",
                //       title: "Tạo mới loại ghế",
                //       key: "seatTypeCreate",
                //     },
                //     {
                //       path: "/edit",
                //       title: "Cập nhật loại ghế",
                //       key: "seatTypeEdit",
                //     },
                //   ],
                // },
              ],
            },
          ],
        },
        {
          path: "/food",
          title: "Đồ ăn",
          key: "food",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết đồ ăn",
              key: "foodShow",
            },
            {
              path: "/create",
              title: "Tạo mới đồ ăn",
              key: "foodCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật đồ ăn",
              key: "foodEdit",
            },
          ],
        },
        {
          path: "/foodCategories",
          title: "Loại đồ ăn",
          key: "foodCategories",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết loại đồ ăn",
              key: "foodCategoriesShow",
            },
            {
              path: "/create",
              title: "Tạo mới loại đồ ăn",
              key: "foodCategoriesCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật loại đồ ăn",
              key: "foodCategoriesEdit",
            },
          ],
        },
        {
          path: "/price",
          title: "Giá sản phẩm",
          key: "price",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết giá sản phẩm",
              key: "priceShow",
            },
            {
              path: "/create",
              title: "Tạo mới giá sản phẩm",
              key: "priceCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật giá sản phẩm",
              key: "priceEdit",
            },
          ],
        },
        {
          path: "/promotion",
          title: "Khuyến mãi",
          key: "promotion",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết khuyến mãi",
              key: "promotionShow",
            },
            {
              path: "/create",
              title: "Tạo mới khuyến mãi",
              key: "promotionCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật khuyến mãi",
              key: "promotionEdit",
            },
          ],
        },
      ],
    },
  ];

  let pathChildren = [];

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
        // Kiểm tra xem route.path trùng với bất kỳ đường dẫn nào trong pathChildren
        const matchingPathChild = pathChildren.find(
          (pathChild) => pathChild.path === route.path
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
