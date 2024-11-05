import { useState } from "react";
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000');                //socket logic

type SetStateAction<T> = T | ((prevState: T) => T);

export const useHistory = <T>(initialState: T): [T, (action: SetStateAction<T>, overwrite?: boolean) => void, () => void] => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  const setState = (action: SetStateAction<T>, overwrite = false) => {
    const newState = typeof action === 'function' ? (action as (prevState: T) => T)(history[index]) : action;

    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);

      // socket.emit('stateUpdate', historyCopy);              //socket logic
    } else {
      const updatedHistory = [...history.slice(0, index + 1), newState];
      setHistory(updatedHistory);
      setIndex(updatedHistory.length - 1);

      // socket.emit('stateUpdate', updatedHistory);           //socket logic
    }
  };

  const undo = () => {
    console.log(history)
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  // useEffect(() => {                                                       //socket logic
  //   socket.on('receiveStateUpdate', (newHistory: T[]) => {
  //     setHistory(newHistory);
  //     setIndex(newHistory.length - 1); // Set index to latest state
  //   });

  //   return () => {
  //     socket.off('receiveStateUpdate');
  //   };
  // }, []);

  return [history[index], setState, undo];
};