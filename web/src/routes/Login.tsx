import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useGet } from "restful-react";
import { AppContext } from "..";

export const Login = (props: {}) => {
  const appContext = useContext(AppContext);
  const {
    title: { setTitle },
    auth,
    setAuth,
  } = appContext;

  const [loginState, setLoginState] = useState({
    username: "",
    password: "",
  });
  const [registerState, setRegisterState] = useState({
    username: "",
    password: "",
    passwordRepeat: "",
    forename: "",
    surname: "",
  });
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState<OutputMessage>({
    status: "info",
    title: "",
    message: "",
  });
  const [showPassLogin, setShowPassLogin] = useState(false);
  const [showPassRegister, setShowPassRegister] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const loginParams = useMemo(
    () => ({
      username: loginState.username,
      password: loginState.password,
    }),
    [loginState]
  );
  const {
    data: loginResponse,
    loading: loginLoading,
    refetch: login,
  } = useGet<LoginResponse>({
    path: "user/login",
    lazy: true,
    queryParams: loginParams,
  });

  const registerParams = useMemo(
    () => ({
      username: registerState.username,
      password: registerState.password,
      forename: registerState.forename,
      surname: registerState.surname,
    }),
    [registerState]
  );
  const {
    data: registerResponse,
    loading: registerLoading,
    refetch: register,
  } = useGet<number>({
    path: "user/add",
    lazy: true,
    queryParams: registerParams,
  });

  useEffect(() => {
    setTitle("Login");
  }, []);

  useEffect(() => {
    if (loginLoading || loginResponse == null) return;
    if (!!loginResponse) {
      setOutput({
        status: "success",
        title: "Logged In",
        message: "Successfully Logged In",
      });
      setShowOutput(true);
      setAuth(loginResponse);
      localStorage.setItem("session_id", loginResponse.token);
      localStorage.setItem("session_data", JSON.stringify(loginResponse.user));
    } else {
      setOutput({
        status: "error",
        title: "Login Failed",
        message: "Incorrect username or password",
      });
      setShowOutput(true);
    }
  }, [loginLoading, loginResponse]);

  useEffect(() => {
    if (registerLoading || registerResponse == null) return;
    if (!!registerResponse) {
      setOutput({
        status: "success",
        title: "Registered",
        message: "Successfully Registered",
      });
      setShowOutput(true);
      setIsRegister(false);
    } else {
      setOutput({
        status: "error",
        title: "Registration Failed",
        message: "Failed to register new user",
      });
      setShowOutput(true);
    }
  }, [registerLoading, registerResponse]);

  const handleLogin = () => {
    login();
  };

  const handleRegister = () => {
    register();
  };

  const handleLogout = () => {
    setAuth({ token: "", user: {} as User });
    localStorage.removeItem("session_id");
    localStorage.removeItem("session_data");
  };

  const RenderOutput = (props: { output: OutputMessage }): JSX.Element => {
    return showOutput ? (
      <Alert
        status={output.status}
        onClick={() => setShowOutput(false)}
        marginBottom={5}
      >
        <AlertIcon />
        <AlertTitle>{output.title}</AlertTitle>
        <AlertDescription>{output.message}</AlertDescription>
      </Alert>
    ) : (
      <></>
    );
  };

  const renderLogout = () => {
    return (
      <Center>
        <Button size="lg" onClick={() => handleLogout()}>
          Logout
        </Button>
      </Center>
    );
  };

  return (
    <Center>
      <Box w="30%" marginTop={10}>
        <>
          <RenderOutput output={output} />
          {isRegister ? (
            <RegisterForm
              handle={() => handleRegister()}
              setState={setRegisterState}
              showPass={showPassRegister}
              setShowPass={setShowPassRegister}
            />
          ) : !auth.token && !isRegister ? (
            <LoginForm
              handleLogin={() => handleLogin()}
              setLoginState={setLoginState}
              showPassLogin={showPassLogin}
              setShowPassLogin={setShowPassLogin}
              setIsRegister={setIsRegister}
            />
          ) : (
            renderLogout()
          )}
        </>
      </Box>
    </Center>
  );
};

const LoginForm: React.FC<{
  handleLogin: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => any;
  setLoginState: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => any;
  showPassLogin: boolean;
  setShowPassLogin: (value: boolean) => void;
  setIsRegister: (value: boolean) => void;
}> = (props) => {
  const {
    handleLogin,
    setLoginState,
    showPassLogin,
    setShowPassLogin,
    setIsRegister,
  } = props;
  return (
    <>
      <Formik
        key="login"
        initialValues={{
          loginUsername: "",
          loginPassword: "",
        }}
        onSubmit={(values, actions) => {
          handleLogin({
            username: values.loginUsername,
            password: values.loginPassword,
          });
        }}
        validateOnChange={true}
        validate={(values) => {
          setLoginState({
            username: values.loginUsername,
            password: values.loginPassword,
          });
          console.log(values);
        }}
      >
        {(props) => (
          <>
            <Field name="loginUsername">
              {({ field, form }: { field: any; form: any }) => (
                <Input
                  size={"md"}
                  placeholder="Enter email address"
                  {...field}
                />
              )}
            </Field>
            <Field name="loginPassword">
              {({ field, form }: { field: any; form: any }) => (
                <>
                  <InputGroup size="md" marginTop={5}>
                    <Input
                      pr="4.5rem"
                      size={"md"}
                      type={showPassLogin ? "text" : "password"}
                      placeholder="Enter password"
                      {...field}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassLogin(!showPassLogin)}
                      >
                        {showPassLogin ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </>
              )}
            </Field>
            <Flex direction={"row-reverse"}>
              <Button
                marginTop={5}
                alignSelf={"flex-end"}
                type="submit"
                onClick={() => props.submitForm()}
              >
                Login
              </Button>
            </Flex>
            <Link onClick={() => setIsRegister(true)}>
              New User? Click here to sign-up.
            </Link>
          </>
        )}
      </Formik>
    </>
  );
};

const RegisterForm: React.FC<{
  handle: ({
    username,
    password,
    passwordRepeat,
    forename,
    surname,
  }: {
    username: string;
    password: string;
    passwordRepeat: string;
    forename: string;
    surname: string;
  }) => any;
  setState: ({
    username,
    password,
    passwordRepeat,
    forename,
    surname,
  }: {
    username: string;
    password: string;
    passwordRepeat: string;
    forename: string;
    surname: string;
  }) => any;
  showPass: boolean;
  setShowPass: (value: boolean) => void;
}> = (props) => {
  const { handle, setState, showPass, setShowPass } = props;
  return (
    <>
      <Formik
        key="login"
        initialValues={{
          registerUsername: "",
          registerPassword: "",
          registerPasswordRepeat: "",
          registerForename: "",
          registerSurname: "",
        }}
        onSubmit={(values, actions) => {
          if (values.registerPassword === values.registerPasswordRepeat) {
            handle({
              username: values.registerUsername,
              password: values.registerPassword,
              passwordRepeat: values.registerPasswordRepeat,
              forename: values.registerForename,
              surname: values.registerSurname,
            });
          }
        }}
        validateOnChange={true}
        validate={(values) => {
          setState({
            username: values.registerUsername,
            password: values.registerPassword,
            passwordRepeat: values.registerPasswordRepeat,
            forename: values.registerForename,
            surname: values.registerSurname,
          });
          console.log(values);
        }}
      >
        {(props) => (
          <>
            <Field name="registerUsername">
              {({ field, form }: { field: any; form: any }) => (
                <Input
                  size={"md"}
                  placeholder="Enter email address"
                  {...field}
                />
              )}
            </Field>
            <Field name="registerForename">
              {({ field }: { field: any }) => (
                <Input
                  size={"md"}
                  placeholder="Enter forename"
                  {...field}
                  marginTop={3}
                />
              )}
            </Field>
            <Field name="registerSurname">
              {({ field }: { field: any }) => (
                <Input
                  size={"md"}
                  placeholder="Enter surname"
                  {...field}
                  marginTop={3}
                />
              )}
            </Field>
            <hr style={{ marginTop: "5%" }} />
            <Field name="registerPassword">
              {({ field, form }: { field: any; form: any }) => (
                <>
                  <InputGroup size="md" marginTop={5}>
                    <Input
                      pr="4.5rem"
                      size={"md"}
                      type={showPass ? "text" : "password"}
                      placeholder="Enter password"
                      {...field}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPass(!showPass)}
                      >
                        {showPass ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </>
              )}
            </Field>
            <Field name="registerPasswordRepeat">
              {({ field }: { field: any }) => (
                <Input
                  pr="4.5rem"
                  size={"md"}
                  marginTop={3}
                  type={"password"}
                  placeholder="Re-Enter password"
                  {...field}
                />
              )}
            </Field>

            <Flex direction={"row-reverse"}>
              <Button
                marginTop={5}
                alignSelf={"flex-end"}
                type="submit"
                onClick={() => props.submitForm()}
              >
                Register
              </Button>
            </Flex>
          </>
        )}
      </Formik>
    </>
  );
};
