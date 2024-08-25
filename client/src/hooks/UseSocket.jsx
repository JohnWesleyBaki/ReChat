import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:5050", {
      auth: { token },
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return { socket };
};
