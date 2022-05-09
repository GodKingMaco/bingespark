import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Layout";
import reportWebVitals from "./reportWebVitals";
import { RestfulProvider, RestfulReactProviderProps } from "restful-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { ChakraProvider } from "@chakra-ui/react";
import "antd/dist/antd.css";
import { AuthWrapper } from "./utils/Components/AuthWrapper";
import Films from "./routes/Films";
import Home from "./routes/Home";
import { Login } from "./routes/Login";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

export interface IAppContext {
  title: {
    title: string;
    setTitle: (title: string) => void;
  };
  auth: LoginResponse;
  setAuth: (auth: LoginResponse) => void;
}

export const AppContext = createContext<IAppContext>({
  title: {
    title: "Home",
    setTitle: (title: string) => ({}),
  },
  auth: {
    token: "",
    user: {
      user_email: "",
      user_forename: "",
      user_id: 0,
      user_password: "",
      user_surname: "",
      user_username: "",
    },
  },
  setAuth: (auth: LoginResponse) => ({}),
});

export const RestfulApp = () => {
  const [appTitle, setAppTitle] = useState("Home");
  const [userState, setUserState] = useState<LoginResponse>({
    token: "",
    user: {
      user_email: "",
      user_forename: "",
      user_id: 0,
      user_password: "",
      user_surname: "",
      user_username: "",
    },
  });
  const value: IAppContext = {
    title: {
      title: appTitle,
      setTitle: setAppTitle,
    },
    auth: userState,
    setAuth: setUserState,
  };

  const checkSessionStorage = () => {
    const session_id = localStorage.getItem("session_id");
    const session_data = localStorage.getItem("session_data");

    if (!!session_id && !!session_data) {
      setUserState({ token: session_id, user: JSON.parse(session_data) });
    }
  };

  const requestOptions = useMemo(() => {
    return {
      headers: { Authorization: "Bearer:" + userState.token },
    };
  }, [userState]);

  useEffect(() => {
    checkSessionStorage();
    window.addEventListener("storage", checkSessionStorage);
    return () => {
      window.removeEventListener("storage", checkSessionStorage);
    };
  }, []);

  return (
    <BrowserRouter>
      <RestfulProvider
        // base="https://cobrien38.webhosting6.eeecs.qub.ac.uk/index.php"
        base="http://localhost:3000/api"
        requestOptions={requestOptions}
      >
        <ChakraProvider>
          <AppContext.Provider value={value}>
            <Layout>
              <AuthWrapper>
                <Routes>
                  <Route path="/index.html" element={<Films />} />
                  <Route path="films" element={<Films />} />
                  <Route path="login" element={<Login />} />
                </Routes>
              </AuthWrapper>
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
