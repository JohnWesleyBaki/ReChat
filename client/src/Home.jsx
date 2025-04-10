import React, { useState } from "react";
import ChatApp from "./components/ChatApp";

function Home() {
  const [isRandom, setIsRandom] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div>
        <button
          onClick={() => {
            setIsRandom(!isRandom);
          }}
        >
          Random
        </button>
      </div>

      {isRandom ? (
        <div>Random ui</div>
      ) : (
        <div className="flex-1">
          <ChatApp />
        </div>
      )}
    </div>
  );
}

export default Home;
