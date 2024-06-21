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
  const [isLoggedInCB, setIsLoggedInCB] = React.useState<boolean>(
    localStorage.getItem("isLoggedInCB") === "true"
  );
  const [dataCB, setDataCB] = React.useState<any>();

  const cleanupSession = () => {
    localStorage.removeItem("isLoggedInGetränkewart");
    localStorage.removeItem("isLoggedInCB");
  };

  React.useEffect(() => {
    // const storedLoggedInGW =
    //   localStorage.getItem("isLoggedInGetränkewart") === "true";
    // if (storedLoggedInGW) {
    //   setIsLoggedInGetränkewart(true);
    // }
    // const storedLoggedInCB = localStorage.getItem("isLoggedInCB") === "true";
    // if (storedLoggedInCB) {
    //   setIsLoggedInGetränkewart(true);
    // }
    const timeoutId = setTimeout(cleanupSession, 24 * 60 * 60 * 1000);
    // Add event listener for beforeunload to clean up session
    // window.addEventListener("beforeunload", cleanupSession);
    return () => {
      clearTimeout(timeoutId);
      // window.removeEventListener("beforeunload", cleanupSession);
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
    // cleanupSession();

    localStorage.removeItem("isLoggedInGetränkewart");
    // alert("Your loged out");

    setIsLoggedInGetränkewart(false);
  };
  const logoutCB = () => {
    localStorage.removeItem("isLoggedInCB");
    // alert("Your loged out");
    // cleanupSession();

    setIsLoggedInCB(false);
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
