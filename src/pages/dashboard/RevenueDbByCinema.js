import ExcelJS from "exceljs";
import moment from "moment";

export const RevenueDbByCinema = (listData, dateRanger) => {
  console.log("Export data", listData, dateRanger);

  if (listData.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Doanh thu theo rạp");

    // Tùy chỉnh bảng
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultColWidth = 25;
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = { name: "Times New Roman", size: 10 };
        cell.border = null; // không hoạt động
      });
    });

    // Tạo một hàng mới cho tiêu đề
    const titleRow = worksheet.addRow([]);

    // Thêm tiêu đề vào hàng tiêu đề
    const titleCell = titleRow.getCell(1);
    titleCell.value = "BÁO CÁO TỔNG KẾT DANH THU THEO RẠP"; // Tiêu đề

    // Merge các ô từ tiêu đề đến ô cuối cùng của tiêu đề
    const titleCount =
      listData.length > 0 ? Object.keys(listData[0]).length - 1 : 0;
    const mergeEndCell = worksheet.getCell(getColumnLetter(titleCount) + "1");
    worksheet.mergeCells("A1:" + mergeEndCell.address);
    // Căn giữa tiêu đề
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 11, name: "Times New Roman" }; // Thiết lập font chữ cho tiêu đề
    // Thiết lập chiều cao của hàng tiêu đề
    titleRow.height = 30;

    // Thêm hai hàng mới dưới tiêu đề
    const filterRow = worksheet.addRow([]);
    const timeRow = worksheet.addRow([]);
    const authorRow = worksheet.addRow([]);

    // Người xuất báo cáo (tạm thời để trống)
    const filterCell = filterRow.getCell(1);
    filterCell.value = `Từ ngày ${dateRanger.startDate} - Đến ngày ${dateRanger.endDate}`; // Tạm thời để trống
    filterCell.font = {
      size: 10,
      name: "Times New Roman",
      italic: true,
    }; // Thiết lập font chữ cho thời gian

    // Thời gian xuất báo cáo
    const currentTime = new Date();
    const formattedTime = moment(currentTime).format("DD/MM/YYYY HH:mm:ss");

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
    listData.forEach((data) => {
      const rowData = [
        data.name,
        data.address,
        data.totalInvoice,
        data.totalTicket,
        data.totalRevenue.toFixed(2), // Giữ hai số sau dấu phẩy cho tổng doanh thu
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
      worksheet.getColumn(2).width = 50; // Cột "Địa chỉ" có index là 2 và có chiều rộng là 50
    });

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
