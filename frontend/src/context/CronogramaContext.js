import React, { createContext, useContext, useState } from "react";


const CronogramaContext = createContext();


export const CronogramaProvider = ({ children }) => {
  const [cronograma, setCronograma] = useState(null);

  return (
    <CronogramaContext.Provider value={{ cronograma, setCronograma }}>
      {children}
    </CronogramaContext.Provider>
  );
};


export const useCronograma = () => {
  const context = useContext(CronogramaContext);
  if (!context) {
    throw new Error("useCronograma deve ser usado dentro de um CronogramaProvider");
  }
  return context;
};
