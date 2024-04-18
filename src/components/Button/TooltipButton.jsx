import { Button, Dropdown, Tooltip } from "antd";
import React from "react";

const TooltipButton = ({
  icon,
  tooltipTitle,
  onClick,
  htmlType,
  trigger,
  dropdown,
  width,
  height,
}) => {
  const button = (
    <Button
      type="primary"
      icon={icon}
      onClick={onClick}
      htmlType={htmlType}
      style={{ marginRight: dropdown ? 8 : 0, width: width, height: height }}
    />
  );

  return (
    <Tooltip title={tooltipTitle} trigger={trigger}>
      {dropdown ? (
        <Dropdown
          key="dropdown"
          menu={dropdown}
          trigger={trigger}
          placement="bottomRight"
        >
          {button}
        </Dropdown>
      ) : (
        button
      )}
    </Tooltip>
  );
};

export default TooltipButton;
