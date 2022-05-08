import React, { useContext, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { AppContext } from ".";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const App = ({ children }: any) => {
  const {
    title: { title },
    auth,
  } = useContext(AppContext);

  const MenuControl = () => {
    const loggedIn = !!auth.token;
    const items = [
      <Link to={"/films"}>
        <MenuItem>Films</MenuItem>
      </Link>,
      <Link to={"/login"}>
        <MenuItem>{loggedIn ? "Logout" : "Login"}</MenuItem>
      </Link>,
    ];

    return (
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} fontSize={"sm"}>
          Menu
        </MenuButton>
        <MenuList>{items.map((x) => x)}</MenuList>
      </Menu>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <Flex direction={"row"} w={"100%"} alignItems="center" paddingRight={2}>
          <Box flexGrow={1} alignSelf={"flex-start"}>
            <Heading color={"white"}>Bingespark - {title}</Heading>
          </Box>
          <Box alignSelf={"flex-end"} paddingRight={5}>
            <Heading color={"white"} justifySelf={"flex-end"}>
              {auth.token
                ? auth.user.user_forename + " " + auth.user.user_surname
                : "Logged Out"}
            </Heading>
          </Box>
          <MenuControl />
        </Flex>
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
