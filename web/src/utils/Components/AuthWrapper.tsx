import { propNames } from "@chakra-ui/react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../..";

export const AuthWrapper = (props: { children: any }) => {
  const { auth } = useContext(AppContext);
  const authPaths = ["/admin"];

  const path = useLocation().pathname;
  const isAuthed = () => {
    const requireAuth = authPaths.includes(path);
    if (requireAuth) {
      if (!!auth.token) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  return isAuthed() ? <>{props.children}</> : <p>Not Authorised</p>;
};
