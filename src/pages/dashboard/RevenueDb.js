import ExcelJS from "exceljs";
import moment from "moment";
import { FORMAT_DATE, FORMAT_DATE_HH_MM_SS } from "../../utils/constant";

export const StatisticByCinema = (
  listData,
  dateRanger,
  cinema,
  userCurrent
) => {
  console.log("Export data", listData, dateRanger);
  if (listData.length === 0) return;

  const { workbook, worksheet } = createWorkbook("Doanh thu theo rạp");
  const checked = listData.length === 1 && listData[0].code === cinema;

  // Tạo một hàng mới cho tiêu đề
  const titleCount = listData.length > 0 ? Object.keys(listData[0]).length : 0;
  crateTitleRow(titleCount, worksheet, "BÁO CÁO TỔNG KẾT DANH THU THEO RẠP");

  const nameCinema = worksheet.addRow([]);
  const filterRow = worksheet.addRow([]);
  const timeRow = worksheet.addRow([]);
  const authorRow = worksheet.addRow([]);

  // Tên rạp
  const nameCinemaCell = nameCinema.getCell(1);
  nameCinemaCell.value = `Rạp: ${checked ? listData[0].name : "Tất cả"}`;
  nameCinemaCell.font = { italic: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho tên rạp

  // filter xuất báo cáo
  const filterCell = filterRow.getCell(1);
  filterCell.value = `Từ ngày ${moment(dateRanger.startDate).format(
    FORMAT_DATE
  )} - Đến ngày ${moment(dateRanger.endDate).format(FORMAT_DATE)}`;
  filterCell.font = {
    size: 10,
    name: "Times New Roman",
    italic: true,
  }; // Thiết lập font chữ cho thời gian

  // Thời gian xuất báo cáo
  const currentTime = new Date();
  const formattedTime = moment(currentTime).format(FORMAT_DATE_HH_MM_SS);

  // Ghi thời gian xuất vào hàng thời gian
  const timeCell = timeRow.getCell(1);
  timeCell.value = `Thời gian xuất báo cáo: ${formattedTime}`;
  timeCell.font = { italic: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho thời gian

  // Người xuất báo cáo (tạm thời để trống)
  const authorCell = authorRow.getCell(1);
  authorCell.value = `Người xuất: ${userCurrent}`; // Tạm thời để trống
  authorCell.font = { italic: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho người xuất

  // Thêm một hàng mới cho header row
  const headerRow = worksheet.addRow([]);

  // Thêm header vào hàng header
  const headerValues = [
    "STT",
    "Rạp",
    "Địa chỉ",
    "Tổng hóa đơn",
    "Tổng vé",
    "Tổng doanh thu",
  ];

  headerValues.forEach((header) => {
    const cell = headerRow.getCell(headerRow.cellCount + 1);
    cell.value = header;

    // Đặt màu nền và in đậm cho các ô trong header row
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "DDEBF7" }, // Màu nền #DDEBF7
    };
    cell.font = { bold: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho tiêu đề
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Thêm dữ liệu từ listData vào worksheet
  const tableData = listData.map((data, index) => {
    return [
      index + 1,
      data.name,
      data.address,
      data.totalInvoice,
      data.totalTicket,
      data.totalRevenue,
    ];
  });

  tableData.forEach((rowData) => {
    // Thêm dòng mới vào bảng
    const row = worksheet.addRow(rowData);

    // Thiết lập wrap text cho dòng dữ liệu
    row.alignment = {
      wrapText: true,
      vertical: "distributed",
    };

    // Duyệt qua từng ô trong hàng dữ liệu và đặt border cho các ô có nội dung
    row.eachCell((cell) => {
      if (cell.value) {
        cell.font = { size: 11, name: "Times New Roman" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    worksheet.getColumn(6).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"
  });

  // chỉnh sửa column width cho từng cột trong tableData
  fixWidthColumn(worksheet, tableData, headerValues);

  // Thêm dòng tổng cộng
  const totalRow = worksheet.addRow([]);
  totalRow.getCell(1).value = "Tổng cộng";

  // Tính tổng của các cột tương ứng
  const totalInvoice = listData.reduce(
    (acc, curr) => acc + curr.totalInvoice,
    0
  );
  const totalTicket = listData.reduce((acc, curr) => acc + curr.totalTicket, 0);
  const totalRevenue = listData.reduce(
    (acc, curr) => acc + curr.totalRevenue,
    0
  );

  // Ghi các giá trị tổng vào hàng tổng cộng
  totalRow.getCell(4).value = totalInvoice;
  totalRow.getCell(5).value = totalTicket;
  totalRow.getCell(6).value = totalRevenue;

  // Định dạng font và size cho hàng tổng cộng
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 11, name: "Times New Roman" };
  });

  worksheet.getColumn(3).width = 50;
  worksheet.getColumn(6).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"

  exportExcel(workbook, "ExportRevenueByCinema.xlsx");
};

export const StatisticByUser = (
  listData,
  dateRanger,
  user,
  type = null,
  userCurrent
) => {
  console.log("Export data", listData, dateRanger);

  if (listData.length > 0) {
    const sheetName = type
      ? "Doanh số bán theo nhân viên"
      : "Doanh thu theo khách hàng";
    const { workbook, worksheet } = createWorkbook(sheetName);
    var checked = false;
    if (listData.length === 1 && listData[0].code === user) {
      checked = true;
    }

    // Tạo một hàng mới cho tiêu đề
    const title = type
      ? "BÁO CÁO DOANH SỐ BÁN HÀNG THEO NHÂN VIÊN"
      : "BÁO CÁO TỔNG KẾT DANH THU THEO KHÁCH HÀNG";
    const titleCount =
      listData.length > 0 ? Object.keys(listData[0]).length + 1 : 0;
    crateTitleRow(titleCount, worksheet, title);

    const userName = worksheet.addRow([]);
    const filterRow = worksheet.addRow([]);
    const timeRow = worksheet.addRow([]);
    const authorRow = worksheet.addRow([]);

    // Tên khách hàng/nhân viên
    const userNameCell = userName.getCell(1);
    userNameCell.value = `${type ? "Nhân viên" : "Khách hàng"}: ${
      checked ? listData[0].name : "Tất cả"
    }`;
    userNameCell.font = { italic: true, size: 10, name: "Times New Roman" };

    // filter xuất báo cáo
    const filterCell = filterRow.getCell(1);
    filterCell.value = `Từ ngày ${moment(dateRanger.startDate).format(
      FORMAT_DATE
    )} - Đến ngày ${moment(dateRanger.endDate).format(FORMAT_DATE)}`;
    filterCell.font = {
      size: 10,
      name: "Times New Roman",
      italic: true,
    };

    // Thời gian xuất báo cáo
    const currentTime = new Date();
    const formattedTime = moment(currentTime).format(FORMAT_DATE_HH_MM_SS);

    // Ghi thời gian xuất vào hàng thời gian
    const timeCell = timeRow.getCell(1);
    timeCell.value = `Thời gian xuất báo cáo: ${formattedTime}`;
    timeCell.font = { italic: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho thời gian

    // Người xuất báo cáo (tạm thời để trống)
    const authorCell = authorRow.getCell(1);
    authorCell.value = `Người xuất: ${userCurrent}`;
    authorCell.font = { italic: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho người xuất

    // Thêm một hàng mới cho header row
    const headerRow = worksheet.addRow([]);

    // Thêm header vào hàng header
    const headerValues = [
      "STT",
      `Mã ${type ? "nhân viên" : "khách hàng"}`,
      `Tên ${type ? "Nhân viên" : "khách hàng"}`,
      "Email",
      "Số điện thoại",
      "Tổng hóa đơn",
      "Tổng vé",
      "Tổng doanh thu",
    ];

    headerValues.forEach((header) => {
      const cell = headerRow.getCell(headerRow.cellCount + 1);
      cell.value = header;

      // Đặt màu nền và in đậm cho các ô trong header row
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "DDEBF7" }, // Màu nền #DDEBF7
      };
      cell.font = { bold: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho tiêu đề
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Thêm dữ liệu từ listData vào worksheet
    const tableData = listData.map((data, index) => {
      return [
        index + 1,
        data.code,
        data.name,
        data.email,
        data.phone || " ",
        data.totalInvoice,
        data.totalTicket,
        data.totalRevenue,
      ];
    });

    tableData.forEach((rowData) => {
      // Thêm dòng mới vào bảng
      const row = worksheet.addRow(rowData);

      // Thiết lập wrap text cho dòng dữ liệu
      row.alignment = {
        wrapText: true,
        vertical: "distributed",
      };

      // Duyệt qua từng ô trong hàng dữ liệu và đặt border cho các ô có nội dung
      row.eachCell((cell) => {
        if (cell.value) {
          cell.font = { size: 11, name: "Times New Roman" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });

      worksheet.getColumn(8).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"
    });

    // chỉnh sửa column width cho từng cột trong tableData
    fixWidthColumn(worksheet, tableData, headerValues);

    // Thêm dòng tổng cộng
    const totalRow = worksheet.addRow([]);
    totalRow.getCell(1).value = "Tổng cộng";

    // Tính tổng của các cột tương ứng
    const totalInvoice = listData.reduce(
      (acc, curr) => acc + curr.totalInvoice,
      0
    );
    const totalTicket = listData.reduce(
      (acc, curr) => acc + curr.totalTicket,
      0
    );
    const totalRevenue = listData.reduce(
      (acc, curr) => acc + curr.totalRevenue,
      0
    );

    // Ghi các giá trị tổng vào hàng tổng cộng
    totalRow.getCell(6).value = totalInvoice;
    totalRow.getCell(7).value = totalTicket;
    totalRow.getCell(8).value = totalRevenue;

    // Định dạng font và size cho hàng tổng cộng
    totalRow.eachCell((cell) => {
      cell.font = { bold: true, size: 11, name: "Times New Roman" };
    });

    // worksheet.getColumn(8).width = totalRevenue.toString().length + 2;
    worksheet.getColumn(8).numFmt = "#,##0.00";

    const fileName = `ExportRevenueBy${type ? "Staff" : "User"}.xlsx`;
    exportExcel(workbook, fileName);
  }
};

export const StatisticByMovie = (listData, dateRanger, movie, userCurrent) => {
  console.log("Export data", listData, dateRanger);

  if (listData.length === 0) return;

  const { workbook, worksheet } = createWorkbook("Doanh thu theo rạp");
  const checked = listData.length === 1 && listData[0].code === cinema;

  // Tạo một hàng mới cho tiêu đề
  const titleCount =
    listData.length > 0 ? Object.keys(listData[0]).length - 1 : 0;
  crateTitleRow(titleCount, worksheet, "BÁO CÁO TỔNG KẾT DANH THU THEO PHIM");

  const nameMovie = worksheet.addRow([]);
  const filterRow = worksheet.addRow([]);
  const timeRow = worksheet.addRow([]);
  const authorRow = worksheet.addRow([]);

  // Tên phim
  const nameMoviecell = nameMovie.getCell(1);
  nameMoviecell.value = `Phim: ${checked ? listData[0].name : "Tất cả"}`;
  nameMoviecell.font = { italic: true, size: 10, name: "Times New Roman" };

  // filter xuất báo cáo
  const filterCell = filterRow.getCell(1);
  filterCell.value = `Từ ngày ${moment(dateRanger.startDate).format(
    FORMAT_DATE
  )} - Đến ngày ${moment(dateRanger.endDate).format(FORMAT_DATE)}`;
  filterCell.font = {
    size: 10,
    name: "Times New Roman",
    italic: true,
  };

  // Thời gian xuất báo cáo
  const currentTime = new Date();
  const formattedTime = moment(currentTime).format(FORMAT_DATE_HH_MM_SS);

  // Ghi thời gian xuất vào hàng thời gian
  const timeCell = timeRow.getCell(1);
  timeCell.value = `Thời gian xuất báo cáo: ${formattedTime}`;
  timeCell.font = { italic: true, size: 10, name: "Times New Roman" };

  // Người xuất báo cáo (tạm thời để trống)
  const authorCell = authorRow.getCell(1);
  authorCell.value = `Người xuất: ${userCurrent}`;
  authorCell.font = { italic: true, size: 10, name: "Times New Roman" };

  // Thêm một hàng mới cho header row
  const headerRow = worksheet.addRow([]);

  // Thêm header vào hàng header
  const headerValues = [
    "STT",
    "Tên phim",
    "Tổng hóa đơn",
    "Tổng vé",
    "Tổng doanh thu",
  ];

  headerValues.forEach((header) => {
    const cell = headerRow.getCell(headerRow.cellCount + 1);
    cell.value = header;

    // Đặt màu nền và in đậm cho các ô trong header row
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "DDEBF7" }, // Màu nền #DDEBF7
    };
    cell.font = { bold: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho tiêu đề
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Thêm dữ liệu từ listData vào worksheet
  const tableData = listData.map((data, index) => {
    return [
      index + 1,
      data.name,
      data.totalInvoice,
      data.totalTicket,
      data.totalRevenue,
    ];
  });

  tableData.forEach((rowData) => {
    // Thêm dòng mới vào bảng
    const row = worksheet.addRow(rowData);

    // Thiết lập wrap text cho dòng dữ liệu
    row.alignment = {
      wrapText: true,
      vertical: "distributed",
    };

    // Duyệt qua từng ô trong hàng dữ liệu và đặt border cho các ô có nội dung
    row.eachCell((cell) => {
      if (cell.value) {
        cell.font = { size: 11, name: "Times New Roman" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });
  });

  // chỉnh sửa column width cho từng cột trong tableData
  fixWidthColumn(worksheet, tableData, headerValues);

  // Thêm dòng tổng cộng
  const totalRow = worksheet.addRow([]);
  totalRow.getCell(1).value = "Tổng cộng";

  // Tính tổng của các cột tương ứng
  const totalInvoice = listData.reduce(
    (acc, curr) => acc + curr.totalInvoice,
    0
  );
  const totalTicket = listData.reduce((acc, curr) => acc + curr.totalTicket, 0);
  const totalRevenue = listData.reduce(
    (acc, curr) => acc + curr.totalRevenue,
    0
  );

  // Ghi các giá trị tổng vào hàng tổng cộng
  totalRow.getCell(3).value = totalInvoice;
  totalRow.getCell(4).value = totalTicket;
  totalRow.getCell(5).value = totalRevenue;

  // Định dạng font và size cho hàng tổng cộng
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 11, name: "Times New Roman" };
  });

  worksheet.getColumn(5).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"

  exportExcel(workbook, "ExportRevenueByMovie.xlsx");
};

export const StatisticByReturnInvoice = (
  listData,
  dateRanger,
  invoiceDetail,
  userCurrent
) => {
  console.log("Export data", listData, dateRanger);
  if (listData.length === 0) return;

  const { workbook, worksheet } = createWorkbook("Thống kê trả vé");

  // Tạo một hàng mới cho tiêu đề
  const titleCount = 5;
  crateTitleRow(titleCount, worksheet, "BẢNG KÊ CHI TIẾT TRẢ VÉ");

  const filterRow = worksheet.addRow([]);
  const timeRow = worksheet.addRow([]);
  const authorRow = worksheet.addRow([]);

  // filter xuất báo cáo
  const filterCell = filterRow.getCell(1);
  filterCell.value = `Từ ngày ${moment(dateRanger.startDate).format(
    FORMAT_DATE
  )} - Đến ngày ${moment(dateRanger.endDate).format(FORMAT_DATE)}`;
  filterCell.font = {
    size: 10,
    name: "Times New Roman",
    italic: true,
  };

  // Thời gian xuất báo cáo
  const currentTime = new Date();
  const formattedTime = moment(currentTime).format(FORMAT_DATE_HH_MM_SS);

  // Ghi thời gian xuất vào hàng thời gian
  const timeCell = timeRow.getCell(1);
  timeCell.value = `Thời gian xuất báo cáo: ${formattedTime}`;
  timeCell.font = { italic: true, size: 10, name: "Times New Roman" };

  // Người xuất báo cáo (tạm thời để trống)
  const authorCell = authorRow.getCell(1);
  authorCell.value = `Người xuất: ${userCurrent}`;
  authorCell.font = { italic: true, size: 10, name: "Times New Roman" };

  // Thêm một hàng mới cho header row
  const headerRow = worksheet.addRow([]);

  // Thêm header vào hàng header
  const headerValues = [
    "STT",
    "Hóa đơn mua",
    "Ngày mua",
    "Hóa đơn trả",
    "Ngày trả",
    "Số vé trả",
    "Doanh thu",
  ];

  headerValues.forEach((header) => {
    const cell = headerRow.getCell(headerRow.cellCount + 1);
    cell.value = header;

    // Đặt màu nền và in đậm cho các ô trong header row
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "DDEBF7" }, // Màu nền #DDEBF7
    };
    cell.font = { bold: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho tiêu đề
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Thêm dữ liệu từ listData vào worksheet
  const tableData = listData.map((data, index) => {
    return [
      index + 1,
      data.invoiceCode,
      moment(data.invoiceDate).format(FORMAT_DATE),
      data.code,
      moment(data.cancelDate).format(FORMAT_DATE),
      data.quantity,
      data.total,
    ];
  });

  tableData.forEach((rowData) => {
    // Thêm dòng mới vào bảng
    const row = worksheet.addRow(rowData);

    // Thiết lập wrap text cho dòng dữ liệu
    row.alignment = {
      wrapText: true,
      vertical: "distributed",
    };

    // Duyệt qua từng ô trong hàng dữ liệu và đặt border cho các ô có nội dung
    row.eachCell((cell) => {
      if (cell.value) {
        cell.font = { size: 11, name: "Times New Roman" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    worksheet.getColumn(8).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"
  });

  // chỉnh sửa column width cho từng cột trong tableData
  fixWidthColumn(worksheet, tableData, headerValues);

  // Thêm dòng tổng cộng
  const totalRow = worksheet.addRow([]);
  totalRow.getCell(1).value = "Tổng cộng";

  // Tính tổng của các cột tương ứng
  const total = listData.reduce((acc, curr) => acc + curr.total, 0);

  // Ghi các giá trị tổng vào hàng tổng cộng
  totalRow.getCell(7).value = total;

  // Định dạng font và size cho hàng tổng cộng
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 11, name: "Times New Roman" };
  });

  worksheet.getColumn(7).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"

  exportExcel(workbook, "ExportRevenueByReturnInvoice.xlsx");
};

// Hàm để chuyển đổi số cột thành chữ cái tương ứng
function getColumnLetter(columnNumber) {
  let dividend = columnNumber;
  let columnName = "";
  let modulo;

  while (dividend > 0) {
    modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
}

const fixWidthColumn = (worksheet, tableData, headerValues) => {
  // Tính độ dài của mỗi giá trị trong headerValues
  const headerLengths = headerValues.map((value) => value.length);

  // Khởi tạo mảng maxLengths có độ dài bằng số cột của mảng tableData, mỗi phần tử có giá trị ban đầu là 0
  const maxLengths = new Array(tableData[0].length).fill(0);

  // Duyệt qua từng hàng của mảng tableData để so sánh và cập nhật độ dài lớn nhất của mỗi cột
  tableData.forEach((row) => {
    row.forEach((value, index) => {
      // Nếu độ dài của value lớn hơn độ dài lớn nhất hiện tại của cột, cập nhật lại độ dài lớn nhất của cột
      if (String(value).length > maxLengths[index]) {
        maxLengths[index] = String(value).length;
      }
    });
  });

  // So sánh độ dài của mỗi giá trị trong headerValues với độ dài lớn nhất của mỗi cột trong tableData
  for (let i = 0; i < headerLengths.length; i++) {
    // Nếu độ dài của headerValues[i] lớn hơn maxLengths[i], cập nhật maxLengths[i] với giá trị lớn nhất
    if (headerLengths[i] > maxLengths[i]) {
      maxLengths[i] = headerLengths[i];
    }
  }

  // Duyệt qua từng cột trong bảng để cập nhật chiều rộng cho cột
  for (let i = 0; i < maxLengths.length; i++) {
    // Cập nhật chiều rộng cho cột i
    worksheet.getColumn(i + 1).width = maxLengths[i] + 3;
  }
};

const exportExcel = (workbook, fileName) => {
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  });
};

const createWorkbook = (nameSeat) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(nameSeat);
  worksheet.properties.defaultRowHeight = 20;
  worksheet.properties.defaultColWidth = 25;
  worksheet.views = [{ showGridLines: false }];

  return { workbook, worksheet };
};

const crateTitleRow = (titleCount, worksheet, title) => {
  const titleRow = worksheet.addRow([]);
  const titleCell = titleRow.getCell(1);
  titleCell.value = title;
  const mergeEndCell = worksheet.getCell(getColumnLetter(titleCount) + "1");
  worksheet.mergeCells("A1:" + mergeEndCell.address);
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.font = { bold: true, size: 11, name: "Times New Roman" };
  titleRow.height = 30;
};
