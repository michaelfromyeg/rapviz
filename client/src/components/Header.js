import header from "../assets/text-logo.png";
import logo from "../assets/logo.svg";

const Header = () => {
  return (
    <div className="header">
      <img src={logo} width="25%" className="App-logo" alt="logo" />
      <img src={header} width="25%" className="Header-text" alt="header" />
    </div>
  );
}

export default Header;
