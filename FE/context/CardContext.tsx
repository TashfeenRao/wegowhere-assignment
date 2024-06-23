import React, { createContext, useState, useContext } from "react";

export const CardContext = createContext<any>(null);

export const CardProvider = ({ children }: any) => {
  const [cards, setCards] = useState<any>([]);

  const addCard = (card: any) => {
    setCards((prevCards: any) => [...prevCards, card]);
  };

  return (
    <CardContext.Provider value={{ cards, addCard }}>
      {children}
    </CardContext.Provider>
  );
};
