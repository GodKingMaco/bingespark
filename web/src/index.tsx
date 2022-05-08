import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Layout";
import reportWebVitals from "./reportWebVitals";
import { RestfulProvider, RestfulReactProviderProps } from "restful-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Films from "./routes/films";
import Home from "./routes/home";
import Layout from "./Layout";
import { ChakraProvider } from "@chakra-ui/react";
import "antd/dist/antd.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

export interface IAppContext {
  title: {
    title: string;
    setTitle: (title: string) => void;
  };
  user: {
    user: User;
    setUser: (user: User) => void;
  };
}

export const AppContext = createContext<IAppContext>({
  title: {
    title: "Home",
    setTitle: (title: string) => ({}),
  },
  user: {
    user: {
      id: 0,
      authenticated: false,
      token: "",
    },
    setUser: (user: User) => ({}),
  },
});

export const RestfulApp = () => {
  // const [appContext, setAppContext] = useState({ metadata: { pageName: 'Home' } })
  const [appTitle, setAppTitle] = useState("Home");
  const [userState, setUserState] = useState<User>({
    id: 0,
    authenticated: false,
    token: "no token",
  });
  const value: IAppContext = {
    title: {
      title: appTitle,
      setTitle: setAppTitle,
    },
    user: {
      user: userState,
      setUser: setUserState,
    },
  };
  return (
    <BrowserRouter>
      <RestfulProvider base="http://localhost:3000/api">
        <ChakraProvider>
          <AppContext.Provider value={value}>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="films" element={<Films />} />
              </Routes>
            </Layout>
          </AppContext.Provider>
        </ChakraProvider>
      </RestfulProvider>
    </BrowserRouter>
  );
};

root.render(<RestfulApp />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
