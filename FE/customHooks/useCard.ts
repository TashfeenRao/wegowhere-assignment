import { createContext, useContext } from "react";
import { CardContext } from "../context/CardContext";

export const useCard = () => {
  return useContext(CardContext);
};
