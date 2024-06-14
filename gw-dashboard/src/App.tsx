import React from "react";
import { Flex } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // Navigate,
} from "react-router-dom";
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import AuthContext, {
  AuthContextType,
  AuthProvider,
} from "./contexts/AuthContext";
import FallbackUI from "./components/fallbackUI";
import Navbar from "./components/navbar/navbar";
import { AnimatePresence, motion } from "framer-motion";

const App: React.FunctionComponent = () => {
  const authContext = React.useContext<AuthContextType | undefined>(
    AuthContext
  );

  console.log(authContext);
  return (
    <Router>
      <Flex flexDirection="column" w="100%" minH="600px" h="100vh">
        <AnimatePresence onExitComplete={() => window.scroll(0, 0)} mode="wait">
          <Routes>
            <Route
              path="/login"
              element={
                <AnimateDev>
                  <Login />
                </AnimateDev>
              }
              // element={!isLoggedIn ? <Login /> : <Navigate to="/home" />}

              // element={!isLoggedIn ? <Login /> : <Navigate to="/home" />}
            />
            <Route
              path="/home"
              element={
                authContext?.isLoggedIn ? (
                  <>
                    <Navbar />
                    <AnimateDev>
                      <Home />
                    </AnimateDev>
                  </>
                ) : (
                  <Navigate to="login" />
                )
              }
            />
            <Route
              path="*"
              element={
                authContext?.isLoggedIn ? (
                  <>
                    <Navbar />
                    <AnimateDev>
                      <Home />
                    </AnimateDev>
                  </>
                ) : (
                  <Navigate to="login" />
                )
              }
            />
          </Routes>
        </AnimatePresence>
      </Flex>
    </Router>
  );
};

export default App;

export interface IChildren {
  children?: JSX.Element;
}
export const AnimateDev: React.FC<IChildren> = ({ children }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
