import { useState } from "react";

const Popup = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1 className="underline font-bold">Sample react component</h1>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
};

export default Popup;
