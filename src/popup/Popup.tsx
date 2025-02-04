import { useEffect } from "react";
import { clearBatchText } from "../chrome/badge";

const Popup = () => {
  // Clear batch text whenever popup opens
  useEffect(() => {
    clearBatchText();
  }, []);

  return <div>Popup component</div>;
};

export default Popup;
