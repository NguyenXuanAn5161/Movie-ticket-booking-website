import ExcelJS from "exceljs";
import moment from "moment";
import { FORMAT_DATE, FORMAT_DATE_HH_MM_SS } from "../../utils/constant";

export const StatisticByCinema = (listData, dateRanger, cinema) => {
  console.log("Export data", listData, dateRanger);

  if (listData.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Doanh thu theo rạp");
    var checked = false;
    if (listData.length === 1 && listData[0].code === cinema) {
      checked = true;
    }

    // Tùy chỉnh bảng
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultColWidth = 25;

    // Tạo một hàng mới cho tiêu đề
    const titleRow = worksheet.addRow([]);

    // Thêm tiêu đề vào hàng tiêu đề
    const titleCell = titleRow.getCell(1);
    titleCell.value = "BÁO CÁO TỔNG KẾT DANH THU THEO RẠP"; // Tiêu đề

    // Merge các ô từ tiêu đề đến ô cuối cùng của tiêu đề
    const titleCount =
      listData.length > 0 ? Object.keys(listData[0]).length : 0;
    const mergeEndCell = worksheet.getCell(getColumnLetter(titleCount) + "1");
    worksheet.mergeCells("A1:" + mergeEndCell.address);
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 11, name: "Times New Roman" }; // Thiết lập font chữ cho tiêu đề
    // Thiết lập chiều cao của hàng tiêu đề
    titleRow.height = 30;

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
    )} - Đến ngày ${moment(dateRanger.startDate).format(FORMAT_DATE)}`;
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
    authorCell.value = "Người xuất: "; // Tạm thời để trống
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
    listData.forEach((data, index) => {
      const rowData = [
        index + 1,
        data.name,
        data.address,
        data.totalInvoice,
        data.totalTicket,
        data.totalRevenue, // Giữ hai số sau dấu phẩy cho tổng doanh thu
      ];

      // Thêm dòng mới vào bảng
      const row = worksheet.addRow(rowData);

      // Thiết lập wrap text cho dòng dữ liệu
      row.alignment = {
        wrapText: true,
        vertical: "distributed",
        horizontal: "left",
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

      // Thiết lập chiều rộng cho cột "Địa chỉ"
      worksheet.getColumn(3).width = 50; // Cột "Địa chỉ" có index là 2 và có chiều rộng là 50
      worksheet.getColumn(6).width = 30;
      worksheet.getColumn(6).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"
    });

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
    totalRow.getCell(4).value = totalInvoice;
    totalRow.getCell(5).value = totalTicket;
    totalRow.getCell(6).value = totalRevenue;

    // Định dạng font và size cho hàng tổng cộng
    totalRow.eachCell((cell) => {
      cell.font = { bold: true, size: 11, name: "Times New Roman" };
    });

    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(6).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"

    // Xuất file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ExportRevenueByCinema.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
};

export const StatisticByUser = (listData, dateRanger, user, type = null) => {
  console.log("Export data", listData, dateRanger);

  if (listData.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      `Doanh thu theo ${type ? "nhân viên" : "khách hàng"}`
    );
    var checked = false;
    if (listData.length === 1 && listData[0].code === user) {
      checked = true;
    }

    // Tùy chỉnh bảng
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultColWidth = 25;

    // Tạo một hàng mới cho tiêu đề
    const titleRow = worksheet.addRow([]);

    // Thêm tiêu đề vào hàng tiêu đề
    const titleCell = titleRow.getCell(1);
    titleCell.value = `BÁO CÁO TỔNG KẾT DANH THU THEO ${
      type ? "NHÂN VIÊN" : "KHÁCH HÀNG"
    }`; // Tiêu đề

    // Merge các ô từ tiêu đề đến ô cuối cùng của tiêu đề
    const titleCount =
      listData.length > 0 ? Object.keys(listData[0]).length + 1 : 0;
    const mergeEndCell = worksheet.getCell(getColumnLetter(titleCount) + "1");
    worksheet.mergeCells("A1:" + mergeEndCell.address);
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 11, name: "Times New Roman" };
    // Thiết lập chiều cao của hàng tiêu đề
    titleRow.height = 30;

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
    )} - Đến ngày ${moment(dateRanger.startDate).format(FORMAT_DATE)}`;
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
    authorCell.value = "Người xuất: "; // Tạm thời để trống
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
    listData.forEach((data, index) => {
      const rowData = [
        index + 1,
        data.code,
        data.name,
        data.email,
        data.phone,
        data.totalInvoice,
        data.totalTicket,
        data.totalRevenue, // Giữ hai số sau dấu phẩy cho tổng doanh thu
      ];

      // Thêm dòng mới vào bảng
      const row = worksheet.addRow(rowData);

      // Thiết lập wrap text cho dòng dữ liệu
      row.alignment = {
        wrapText: true,
        vertical: "distributed",
        horizontal: "left",
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

      worksheet.getColumn(8).width = 30;
      worksheet.getColumn(8).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"
    });

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

    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(8).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"

    // Xuất file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ExportRevenueBy${type ? "Staff" : "User"}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
};

export const StatisticByMovie = (listData, dateRanger, movie) => {
  console.log("Export data", listData, dateRanger);

  if (listData.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Doanh thu theo rạp");
    var checked = false;
    if (listData.length === 1 && listData[0].code === movie) {
      checked = true;
    }

    // Tùy chỉnh bảng
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultColWidth = 25;

    // Tạo một hàng mới cho tiêu đề
    const titleRow = worksheet.addRow([]);

    // Thêm tiêu đề vào hàng tiêu đề
    const titleCell = titleRow.getCell(1);
    titleCell.value = "BÁO CÁO TỔNG KẾT DANH THU THEO PHIM"; // Tiêu đề

    // Merge các ô từ tiêu đề đến ô cuối cùng của tiêu đề
    const titleCount =
      listData.length > 0 ? Object.keys(listData[0]).length - 1 : 0;
    const mergeEndCell = worksheet.getCell(getColumnLetter(titleCount) + "1");
    worksheet.mergeCells("A1:" + mergeEndCell.address);
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 11, name: "Times New Roman" };
    // Thiết lập chiều cao của hàng tiêu đề
    titleRow.height = 30;

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
    )} - Đến ngày ${moment(dateRanger.startDate).format(FORMAT_DATE)}`;
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
    authorCell.value = "Người xuất: "; // Tạm thời để trống
    authorCell.font = { italic: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho người xuất

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
    listData.forEach((data, index) => {
      const rowData = [
        index + 1,
        data.name,
        data.totalInvoice,
        data.totalTicket,
        data.totalRevenue, // Giữ hai số sau dấu phẩy cho tổng doanh thu
      ];

      // Thêm dòng mới vào bảng
      const row = worksheet.addRow(rowData);

      // Thiết lập wrap text cho dòng dữ liệu
      row.alignment = {
        wrapText: true,
        vertical: "distributed",
        horizontal: "left",
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

      worksheet.getColumn(5).width = 30;
      worksheet.getColumn(5).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"
    });

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
    totalRow.getCell(3).value = totalInvoice;
    totalRow.getCell(4).value = totalTicket;
    totalRow.getCell(5).value = totalRevenue;

    // Định dạng font và size cho hàng tổng cộng
    totalRow.eachCell((cell) => {
      cell.font = { bold: true, size: 11, name: "Times New Roman" };
    });

    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(5).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"

    // Xuất file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ExportRevenueByMovie.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
};

export const StatisticByReturnInvoice = (
  listData,
  dateRanger,
  invoiceDetail
) => {
  console.log("Export data", listData, dateRanger);

  if (listData.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Thống kê trả vé");

    // Tùy chỉnh bảng
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultColWidth = 25;

    // Tạo một hàng mới cho tiêu đề
    const titleRow = worksheet.addRow([]);

    // Thêm tiêu đề vào hàng tiêu đề
    const titleCell = titleRow.getCell(1);
    titleCell.value = "BẢNG KÊ CHI TIẾT TRẢ VÉ"; // Tiêu đề

    // Merge các ô từ tiêu đề đến ô cuối cùng của tiêu đề
    const titleCount = 5;
    const mergeEndCell = worksheet.getCell(getColumnLetter(titleCount) + "1");
    worksheet.mergeCells("A1:" + mergeEndCell.address);
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 11, name: "Times New Roman" };
    // Thiết lập chiều cao của hàng tiêu đề
    titleRow.height = 30;

    const filterRow = worksheet.addRow([]);
    const timeRow = worksheet.addRow([]);
    const authorRow = worksheet.addRow([]);

    // filter xuất báo cáo
    const filterCell = filterRow.getCell(1);
    filterCell.value = `Từ ngày ${moment(dateRanger.startDate).format(
      FORMAT_DATE
    )} - Đến ngày ${moment(dateRanger.startDate).format(FORMAT_DATE)}`;
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
    authorCell.value = "Người xuất: "; // Tạm thời để trống
    authorCell.font = { italic: true, size: 10, name: "Times New Roman" }; // Thiết lập font chữ cho người xuất

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
    listData.forEach((data, index) => {
      const rowData = [
        index + 1,
        data.invoiceCode,
        moment(data.invoiceDate).format(FORMAT_DATE),
        data.code,
        moment(data.cancelDate).format(FORMAT_DATE),
        data.quantity,
        data.total, // Giữ hai số sau dấu phẩy cho tổng doanh thu
      ];

      // Thêm dòng mới vào bảng
      const row = worksheet.addRow(rowData);

      // Thiết lập wrap text cho dòng dữ liệu
      row.alignment = {
        wrapText: true,
        vertical: "distributed",
        horizontal: "left",
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

      worksheet.getColumn(7).width = 30;
      worksheet.getColumn(7).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"
    });

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

    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(7).numFmt = "#,##0.00"; // Định dạng số cho cột "Tổng doanh thu"

    // Xuất file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ExportRevenueByReturnInvoice.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
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
