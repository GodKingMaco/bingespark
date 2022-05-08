import React, { useContext, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { AppContext } from ".";
import { Center, Heading, Text } from "@chakra-ui/react";

const App = ({ children }: any) => {
  const {
    title: { title },
  } = useContext(AppContext);
  return (
    <div className="App">
      <header className="App-header">
        <Center>
          <Heading color={"white"}>Bingespark - {title}</Heading>
        </Center>
      </header>
      <main className="App-content">{children}</main>
      <footer className="App-footer">
        <Center>
          <Heading fontSize={20} padding={5} color={"white"}>
            Bingespark
          </Heading>
        </Center>
      </footer>
    </div>
  );
};

export default App;
