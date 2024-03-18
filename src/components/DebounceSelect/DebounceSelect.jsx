import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useMemo, useRef, useState } from "react";

const DebounceSelect = ({ fetchOptions, debounceTimeout = 0, ...props }) => {
  const [fetching, setFetching] = useState(false); // State để theo dõi trạng thái của việc tìm kiếm
  const [options, setOptions] = useState([]); // State để lưu trữ danh sách các lựa chọn
  const fetchRef = useRef(0); // Biến tham chiếu để theo dõi số lần gọi hàm tìm kiếm

  // useMemo để tránh việc tạo lại hàm này mỗi lần render
  const debounceFetcher = useMemo(() => {
    // Hàm loadOptions được gọi khi người dùng nhập vào ô tìm kiếm
    const loadOptions = (value) => {
      fetchRef.current += 1; // Tăng biến tham chiếu để đảm bảo tính nhất quán của kết quả
      const fetchId = fetchRef.current; // Lưu trữ số phiên bản hiện tại của biến tham chiếu
      setOptions([]);
      setFetching(true);

      // Gọi hàm fetchOptions để lấy danh sách lựa chọn dựa trên giá trị nhập vào
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // Kiểm tra xem phiên bản hiện tại của biến tham chiếu có khớp với phiên bản khi hàm fetchOptions được gọi không
          // Nếu không, bỏ qua kết quả vì có một phiên bản mới đã được bắt đầu
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };
    // Sử dụng debounce từ thư viện lodash để tạo ra một phiên bản hàm được gọi sau một khoảng thời gian trễ
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]); // Dependency array để đảm bảo rằng hàm debounce được tạo lại khi có thay đổi trong các props hoặc state

  return (
    <Select
      showSearch
      allowClear
      labelInValue // Sử dụng để chứa giá trị và nhãn của mỗi lựa chọn
      filterOption={false} // Tắt tính năng tự động lọc lựa chọn
      onSearch={debounceFetcher} // Sử dụng hàm debounceFetcher khi người dùng nhập vào ô tìm kiếm
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props} // Truyền các props khác được truyền vào thành phần DebounceSelect
      options={options} // Truyền danh sách lựa chọn vào thành phần Select
    />
  );
};

export default DebounceSelect;
