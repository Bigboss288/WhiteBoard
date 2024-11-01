import { useState } from "react";

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
    } else {
      const updatedHistory = [...history.slice(0, index + 1), newState];
      setHistory(updatedHistory);
      setIndex(updatedHistory.length - 1);
    }
  };

  const undo = () => {
    console.log(history)
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  return [history[index], setState, undo];
};