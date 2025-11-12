import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "store/store";

const URL = import.meta.env.VITE_REACT_APPLICATION_BASE_URL;
const useSocket = (): Socket | null => {
  const token = useSelector((state: RootState) => state.states.token);
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    if (!token) return;
    if (!socketRef.current) {
      socketRef.current = io(URL, {
        auth: {
          token: `Bearer ${token}`,
        },
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return socketRef.current;
};

export default useSocket;
