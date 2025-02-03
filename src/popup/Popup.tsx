import { useState } from "react";
import Test from "../components/Test";

const Popup = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Test />
      <h1>Sample react component</h1>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
};

export default Popup;
