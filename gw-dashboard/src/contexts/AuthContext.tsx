import React from "react";

export interface AuthContextType {
  isLoggedInGetränkewart: boolean;
  isLoggedInCB: boolean;
  login: () => void;
  loginCB: () => void;
  logout: () => void;
  logoutCB: () => void;
  dataCB: any;
  setDataCB: any;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [isLoggedInGetränkewart, setIsLoggedInGetränkewart] =
    React.useState<boolean>(
      localStorage.getItem("isLoggedInGetränkewart") === "true"
    );
  const [dataCB, setDataCB] = React.useState<any>(() => {
    const storedData = localStorage.getItem("userCBData");
    return storedData !== "undefined" &&
      storedData !== undefined &&
      storedData !== null
      ? JSON.parse(storedData)
      : null;
  });
  const [isLoggedInCB, setIsLoggedInCB] = React.useState<boolean>(
    dataCB !== "undefined" && dataCB !== undefined && dataCB !== null
      ? true
      : false
  );

  const cleanupSession = () => {
    localStorage.removeItem("isLoggedInGetränkewart");
    localStorage.removeItem("isLoggedInCB");
  };

  React.useEffect(() => {
    const storedLoggedInGW = localStorage.getItem("isLoggedInGetränkewart");
    const storedLoggedInCB = localStorage.getItem("isLoggedInCB");

    if (storedLoggedInGW && storedLoggedInCB) {
      cleanupSession();
      setIsLoggedInGetränkewart(false);
      setIsLoggedInCB(false);
    } else {
      if (storedLoggedInGW) {
        setIsLoggedInGetränkewart(true);
      }
      if (dataCB) {
        setIsLoggedInCB(true);
      }
    }

    const timeoutId = setTimeout(cleanupSession, 24 * 60 * 60 * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const login = () => {
    localStorage.setItem("isLoggedInGetränkewart", "true");
    setIsLoggedInGetränkewart(true);
    logoutCB();
  };
  const loginCB = () => {
    localStorage.setItem("isLoggedInCB", "true");

    setIsLoggedInCB(true);
    logout();
  };

  const logout = () => {
    localStorage.removeItem("isLoggedInGetränkewart");
    setIsLoggedInGetränkewart(false);
    alert("Your loged out as GW");
  };
  const logoutCB = () => {
    localStorage.removeItem("isLoggedInCB");
    localStorage.removeItem("userCBData");
    setIsLoggedInCB(false);
    setDataCB(null);
    alert("You logged out as CB");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedInGetränkewart,
        isLoggedInCB,
        login,
        logout,
        loginCB,
        logoutCB,
        dataCB,
        setDataCB,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
