import React from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );
  React.useEffect(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (storedLoggedIn) {
      setIsLoggedIn(true);
    }
    const cleanupSession = () => {
      localStorage.removeItem("isLoggedIn");
    };
    // Add event listener for beforeunload to clean up session
    // window.addEventListener("beforeunload", cleanupSession);
    return () => {
      window.removeEventListener("beforeunload", cleanupSession);
    };
  }, []);

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    alert("Your loged out");

    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
