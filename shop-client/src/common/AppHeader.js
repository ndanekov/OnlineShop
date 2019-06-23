import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import shopIcon from '../shop.png';
import { Layout, Menu, Dropdown, Icon } from 'antd';

const Header = Layout.Header;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        
        let menuItems = [];
        let orders = []
        if(this.props.currentUser) {
          let newProduct 
          if(this.props.currentUser.roles.indexOf("ROLE_MODERATOR") !== -1){
            newProduct=[
              <Menu.Item key="/product/new">
                <Link to="/product/new">
                  <img src={shopIcon} alt="product" className="product-icon" />
                </Link>
              </Menu.Item>
            ]
          } 
          if(this.props.currentUser.roles.indexOf("ROLE_ADMIN") !== -1){
            orders =[
              <Menu.Item key="/orders/manage">
                <Link to="/orders">
                  <Icon type="bars" className="nav-icon" />
                </Link>
              </Menu.Item>
            ]
          }
          menuItems = [
            orders,
            <Menu.Item key="/myorders/" >
              <Link to="/myorders/">
                <Icon type="wallet" spin={!this.props.cartIsEmpty} className="nav-icon" />
              </Link>
            </Menu.Item>
            ,
            <Menu.Item key="/cart" >
              <Link to="/cart">
                <Icon type="shopping-cart" spin={!this.props.cartIsEmpty} className="nav-icon" />
              </Link>
            </Menu.Item>,
            <Menu.Item key="/">
              <Link to="/">
                <Icon type="home" className="nav-icon" />
              </Link>
            </Menu.Item>,
            newProduct
            ,
            <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu 
                  currentUser={this.props.currentUser} 
                  handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>,
            <Menu.Item key="/signup">
              <Link to="/signup">Signup</Link>
            </Menu.Item>                  
          ];
        }

        return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >
                <Link to="/">Online shop</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);