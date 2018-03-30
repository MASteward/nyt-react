import React from "react";
import { Link } from "react-router-dom";

const Nav = () =>
  <nav className="navbar navbar-inverse navbar-top">
    <div className="container-fluid">
      <div className="navbar-header">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">
            New York Times
          </Link>
        </div>
        <ul className="nav navbar-nav">
          <li className={
            window.location.pathname === "/" || window.location.pathname === "/articles" ? "active" : "" }>
            <Link to="/">Articles</Link>
          </li>
          <li className={window.pathname === "/saved" ? "active" : ""}>
            <Link to="/saved">Saved Articles</Link>
          </li>
        </ul>
        {/* <a href="/" className="navbar-brand">
          Headlines
        </a> */}
      </div>
    </div>
  </nav>;

export default Nav;
