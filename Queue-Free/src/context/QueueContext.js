import React, { createContext, useReducer } from "react";

const QueueContext = createContext();

const initialState = {
  currentQueue: null,
  position: null,
};

function queueReducer(state, action) {
  switch (action.type) {
    case "JOIN_QUEUE":
      return { currentQueue: action.payload, position: 5 }; 
    case "UPDATE_POSITION":
      return { ...state, position: Math.max(state.position - 1, 0) };
    case "LEAVE_QUEUE":
      return initialState;
    default:
      return state;
  }
}

export function QueueProvider({ children }) {
  const [state, dispatch] = useReducer(queueReducer, initialState);

  return (
    <QueueContext.Provider value={{ state, dispatch }}>
      {children}
    </QueueContext.Provider>
  );
}

export default QueueContext;
