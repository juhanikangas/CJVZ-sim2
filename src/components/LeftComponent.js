import { useSelector } from "react-redux";
import Login from "./Login";
import Menu from "./Menu";

const LeftComponent = () => {
  const authenticated = useSelector(
    (state) => state?.authReducer?.isAuthenticated
  );
  return !authenticated ? <Login /> : <Menu />;
};

export default LeftComponent;
