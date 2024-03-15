import { useEffect, useState } from "react";

const SeatComponent = ({
  isSelected,
  id,
  text,
  index,
  checkSelection,
  selectionOn,
  setSelectedItems,
  setSelectedIndexes,
  handleKeyUp,
  handleKeyDown,
  ctrlPressed,
}) => {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  }, [isSelected]);

  useEffect(() => {
    if (selectionOn && isSelected && !rendered) {
      setRendered(true);
      checkSelection(index, true);
    } else if (!selectionOn) {
      setRendered(false);
    }
  }, [selectionOn, isSelected, checkSelection, index, rendered]);

  const handleClick = () => {
    if (ctrlPressed) {
      setSelectedIndexes((prev) =>
        isSelected ? prev.filter((item) => item !== index) : [...prev, index]
      );
    }
  };

  return (
    <div
      data-testid={`grid-cell-${index}`}
      key={index}
      className={`element ${isSelected ? "selected" : ""} `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      {text}
    </div>
  );
};

export default SeatComponent;
