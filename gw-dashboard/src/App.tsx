import React from "react";
import { Flex } from "@chakra-ui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import AuthContext, { AuthContextType } from "./contexts/AuthContext";
import Navbar from "./components/navbar/navbar";
import { AnimatePresence, motion } from "framer-motion";
import Drinks from "./pages/drinks/drinks";
import HomeCB from "./pages/cbs/home/homeCB";
import NavbarCB from "./pages/cbs/navbar/navbarCB";

const App: React.FunctionComponent = () => {
  const location: Partial<Location> | string = useLocation();
  const authContext = React.useContext<AuthContextType | undefined>(
    AuthContext
  );
  console.log(authContext?.isLoggedInCB);
  console.log(authContext?.isLoggedInGetränkewart);
  return (
    <>
      {authContext?.isLoggedInGetränkewart && <Navbar />}
      {authContext?.isLoggedInCB && <NavbarCB />}
      <Flex flexDirection="column" w="100%" minH="600px" h="100vh">
        <AnimatePresence onExitComplete={() => window.scroll(0, 0)} mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/login"
              element={
                authContext?.isLoggedInGetränkewart ||
                authContext?.isLoggedInCB ? (
                  <Navigate
                    to={authContext?.isLoggedInCB ? "/home-cb" : "/home"}
                  />
                ) : (
                  <AnimateDev>
                    <Login />
                  </AnimateDev>
                )
              }
            />
            <Route
              path="/home"
              element={
                authContext?.isLoggedInGetränkewart ? (
                  <>
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
              path="/home-cb"
              element={
                authContext?.isLoggedInCB ? (
                  <>
                    <AnimateDev>
                      <HomeCB />
                    </AnimateDev>
                  </>
                ) : (
                  <Navigate to="login" />
                )
              }
            />
            <Route
              path="/drinks"
              element={
                authContext?.isLoggedInGetränkewart ? (
                  <>
                    <AnimateDev>
                      <Drinks />
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
                authContext?.isLoggedInGetränkewart ? (
                  <>
                    <Navigate to="home" />
                  </>
                ) : authContext?.isLoggedInCB ? (
                  <>
                    <Navigate to="home-cb" />
                  </>
                ) : (
                  <Navigate to="login" />
                )
              }
            />
          </Routes>
        </AnimatePresence>
      </Flex>
    </>
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

        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
};
