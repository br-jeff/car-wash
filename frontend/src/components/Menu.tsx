import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: center; 
  align-items: center;
  padding: 0 20px;
  background-color: #9580ff;
  margin-bottom: 10px;
  width: 100%; 
`;

const NavLink = styled(Link)`
  color: #fafafa;
  text-decoration: none;
  font-size: 16px;
  padding: 16px 10px;
  margin: 0 10px;

  &:hover {
    text-decoration: underline;
  }
`;

class Menu extends React.Component {
  render() {
    return (
      <div>
        <Nav className="menu">
          <NavLink to="/">Cadastro</NavLink>
          <NavLink to="/list">Lista</NavLink>
        </Nav>
      </div>
    );
  }
}

export default Menu;
