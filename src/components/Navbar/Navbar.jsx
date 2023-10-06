import React from "react";
import "./Navbar.scss";
import DeleteIcon from "../../assets/delete-icon.svg";

const Navbar = ({
  title = "Title",
  isDelete = false,
  handleDelete = () => {},
}) => {
  return (
    <nav className="navbar">
      <div className="container">
        <h3>{title}</h3>
        {isDelete && (
          <img onClick={handleDelete} src={DeleteIcon} alt="delete" />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
