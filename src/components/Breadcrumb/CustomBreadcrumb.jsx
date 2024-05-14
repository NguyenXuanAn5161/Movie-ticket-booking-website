import { Breadcrumb } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import useTheme from "../../core/useTheme";

function CustomBreadcrumb(props) {
  const location = useLocation();
  const { theme } = useTheme();

  const items = [
    {
      path: "/",
      title: "",
      key: "admin",
      children: [
        {
          path: "/dashboard",
          title: "Tổng quan",
          key: "dashboard",
        },
        {
          path: "/statisticalCinema",
          title: "Doanh thu theo rạp",
          key: "statisticalCinema",
        },
        {
          path: "/statisticalMovie",
          title: "Doanh thu theo phim",
          key: "statisticalMovie",
        },
        {
          path: "/statisticalUser",
          title: "Doanh thu theo khách hàng",
          key: "statisticalUser",
        },
        {
          path: "/statisticalStaff",
          title: "Doanh số bán theo nhân viên",
          key: "statisticalStaff",
        },
        {
          path: "/statisticalReturnInvoice",
          title: "Thống kê trả hóa đơn",
          key: "statisticalReturnInvoice",
        },
        {
          path: "/statisticalPromotion",
          title: "Thống kê khuyến mãi",
          key: "statisticalPromotion",
        },
        {
          path: "/order",
          title: "Hóa đơn",
          key: "order",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết hóa đơn",
              key: "orderShow",
            },
          ],
        },
        {
          path: "/returnInvoice",
          title: "Hóa đơn trả",
          key: "returnInvoice",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết hóa đơn trả",
              key: "returnInvoiceShow",
            },
          ],
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
          path: "/schedule",
          title: "Lịch chiếu phim",
          key: "schedule",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết lịch chiếu phim",
              key: "scheduleShow",
            },
            {
              path: "/create",
              title: "Tạo mới lịch chiếu phim",
              key: "scheduleCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật lịch chiếu phim",
              key: "scheduleEdit",
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
              title: "Xem chi tiết rạp",
              key: "cinemaShow",
            },
            {
              path: "/create",
              title: "Tạo mới rạp phim",
              key: "cinemaCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật rạp phim",
              key: "cinemaEdit",
            },
            {
              path: "/room",
              title: "Phòng chiếu",
              key: "room",
              children: [
                {
                  path: "/show",
                  title: "Xem chi tiết phòng",
                  key: "roomShow",
                },
                {
                  path: "/create",
                  title: "Tạo mới phòng",
                  key: "roomCreate",
                },
                {
                  path: "/edit",
                  title: "Cập nhật phòng",
                  key: "roomEdit",
                },
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
          title: "Chương trình quản lý giá",
          key: "price",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết chương trình quản lý giá",
              key: "priceShow",
            },
            {
              path: "/create",
              title: "Tạo mới chương trình quản lý giá",
              key: "priceCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật chương trình quản lý giá",
              key: "priceEdit",
            },
          ],
        },
        {
          path: "/promotion",
          title: "Sự kiện khuyến mãi",
          key: "promotion",
          children: [
            {
              path: "/show",
              title: "Xem chi tiết sự kiện khuyến mãi",
              key: "promotionShow",
            },
            {
              path: "/create",
              title: "Tạo mới sự kiện khuyến mãi",
              key: "promotionCreate",
            },
            {
              path: "/edit",
              title: "Cập nhật sự kiện khuyến mãi",
              key: "promotionEdit",
            },
          ],
        },
        {
          path: "/booking",
          title: "Đặt vé",
          key: "booking",
        },
      ],
    },
  ];

  let pathChildren = [];

  const getItemByPath = (path, itemList) => {
    for (const item of itemList) {
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

  const shouldRenderTitle = (route) => {
    return route.path !== "/";
  };

  const renderTitle = (route, pathChildren, matchingPathChild, item) => {
    if (pathChildren.length > 0) {
      if (matchingPathChild) {
        return <span>{matchingPathChild.title}</span>;
      }
    }
    return <span>{item ? item.title : null}</span>;
  };

  const renderLinkOrSpan = (last, paths, item) => {
    return last ? (
      <span>{item ? item.title : null}</span>
    ) : (
      <Link to={paths.join("/")}>{item ? item.title : null}</Link>
    );
  };

  const itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    const item = getItemByPath(route.path, items);
    const hasRoomPath = routes.some((route) => route.path === "/room");

    if (!shouldRenderTitle(route)) {
      return null;
    }

    if (!hasRoomPath) {
      if (["/show", "/edit", "/create"].includes(route.path)) {
        const matchingPathChild = pathChildren.find(
          (pathChild) => pathChild.path === route.path
        );
        return matchingPathChild
          ? renderTitle(route, pathChildren, matchingPathChild, null)
          : renderLinkOrSpan(last, paths, item);
      }

      return renderLinkOrSpan(last, paths, item);
    } else if (hasRoomPath) {
      // chỉ xử lý breadcrumb đến show, edit, create trước /room, không xử lý các show, edit, create sau /room
      if (["/show", "/edit", "/create"].includes(route.path)) {
        const matchingPathChild = pathChildren.find(
          (pathChild) => pathChild.path === route.path
        );
        console.log("matchingPathChild trong co room: ", matchingPathChild);
        return matchingPathChild
          ? renderTitle(route, pathChildren, matchingPathChild, null)
          : renderLinkOrSpan(last, paths, item);
      }
    }
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
  return (
    <Breadcrumb
      itemRender={itemRender}
      items={itemsPath}
      style={{
        fontSize: theme.fontSize.fz_18,
      }}
    />
  );
}

export default CustomBreadcrumb;
