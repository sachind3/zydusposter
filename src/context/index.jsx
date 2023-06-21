import { createContext, useEffect, useState } from "react";
import templates from "../lib/templates";
export const AppContext = createContext();

export const AppState = ({ children }) => {
  const info = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(info || null);
  const [docInfo, setDocInfo] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const store = {
    user,
    setUser,
    docInfo,
    setDocInfo,
    loading,
    setLoading,
    templates,
    selectedPoster,
    setSelectedPoster,
  };
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
