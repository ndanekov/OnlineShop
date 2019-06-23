import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser,deleteProduct } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import OrderDetails from '../order/OrderDetails';
import NewProduct from '../product/NewProduct';
import ProductList from '../product/ProductList';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';
import Cart from '../Cart/Cart';
import ProductDetails from '../product/ProductDetails';
import { makeOrder } from '../util/APIUtils';
import OrderList from '../order/OrderList'

import { Layout, notification } from 'antd';
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      cart:{
        cartItems: [],
        totalPrice: 0
      }
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    this.handleSubmitOrder = this.handleSubmitOrder.bind(this);
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });    
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentWillMount(){
    if(localStorage.getItem('cartContent')){
      const cartcontainer = JSON.parse(localStorage.getItem('cartContent'))
      this.setState({
         cart: cartcontainer.cart
      })
    }
  }
  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem("cartContent");
    
    this.setState({
      currentUser: null,
      isAuthenticated: false,
      cart:{
        cartItems: [],
        totalPrice: 0
      }
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Online shop',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Online shop',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  handleAddToCart(event,product){
      this.setState(state =>{
        const cartList = state.cart.cartItems;
        let productAlreadyInCart = false;
        cartList.forEach(element => {
          if(product.id === element.id){
            productAlreadyInCart = true;
            element.count++;
          }
        });
        if(!productAlreadyInCart){
          cartList.push({...product,count:1})
        }
        const totalPrice = state.cart.totalPrice + Number(product.price)

        const payload = {
          cart: {
            cartItems: cartList,
            totalPrice: totalPrice
          }
        }
        this.updateLocalStorageCart(payload)
        return payload})
  }

  handleRemoveFromCart(event,product,index){
    this.setState(state =>{
      const cartList = state.cart.cartItems;
        let lastProductInCart = false;
        cartList.forEach(element => {
          if(product.id === element.id){
            if(element.count===1){
              lastProductInCart = true;
            }else{
              element.count--;
            }
          }
        });
        var finalList
        if(lastProductInCart){
          finalList =cartList.slice(0,index).concat(cartList.slice(index+1,cartList.length))
        }else{
          finalList = cartList
        }

        const totalPrice = state.cart.totalPrice - Number(product.price)

        const payload = {
          cart: {
            cartItems: finalList,
            totalPrice: totalPrice
          }
        }
        this.updateLocalStorageCart(payload)
        return payload
    })
    

  }

  

  handleSubmitOrder(event,address,phoneNumber){
    event.preventDefault();
    console.log(address)
    console.log(phoneNumber)
    var orderProducts=[]
    this.state.cart.cartItems.forEach(item=>{
      orderProducts.push({

        id: item.id,
        count: item.count
      })
    })
    const payload = {
      orderProducts: orderProducts,
      deliveryContacts: {
        address: address.text,
        phoneNumber: phoneNumber.text
      }
    }
    console.log(payload)
    makeOrder(payload)
    .then((response)=>{
      const clearCart= {
        cart:{
          cartItems: [],
          totalPrice: 0
        }
      }
      this.setState({
        ...clearCart
      })
      this.updateLocalStorageCart(clearCart)
      notification.success({
        message: 'Online shop',
        description: "Order Sent Successfully",
      });
    }).catch(error => {
      if(error.status === 404) {
          this.setState({
              notFound: true,
              isLoading: false
          });
      } else {
          this.setState({
              serverError: true,
              isLoading: false
          });
          notification.error({
            message: 'Online Shop',
            description: error.message || 'Sorry! Something went wrong. Please try again!'
        });    
      }
    }); 

  }

  updateLocalStorageCart(cart){
    console.log(cart)
    localStorage.setItem("cartContent",JSON.stringify(cart));
  }

  handleDeleteProduct(event,productId){
    if (window.confirm('Are you sure you wish to delete this item?')){
      console.log("deleting product")
      this.setState({
        isLoading: true
      });
      deleteProduct(productId)
      .then(response =>{
        notification.success({
          message: 'Online shop',
          description: "Product Deleted Successfully",
        });
        this.setState({
          isLoading: false
      });
        this.props.history.push("/")
      }).catch(error => {
        if(error.status === 404) {
            this.setState({
                notFound: true,
                isLoading: false
            });
        } else {
            this.setState({
                serverError: true,
                isLoading: false
            });
            notification.error({
              message: 'Online Shop',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });      
        }
      }); 
    }

  }
  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.isAuthenticated} cartIsEmpty={(this.state.cart.cartItems.length===0)?true:false}
            currentUser={this.state.currentUser} 
            onLogout={this.handleLogout} />

          <Content className="app-content">
            <div className="container">
              <Switch>
              <Route exact path="/" 
                  render={(props) => <ProductList isAuthenticated={this.state.isAuthenticated} 
                      currentUser={this.state.currentUser} handleLogout={this.handleLogout} 
                      handleAddToCart={this.handleAddToCart} handleDeleteProduct={this.handleDeleteProduct}
                      {...props} />}>
                </Route>

                <Route exact path="/orders" 
                  render={(props) => <OrderList isAuthenticated={this.state.isAuthenticated} 
                      currentUser={this.state.currentUser} handleLogout={this.handleLogout} 
                      type='ALL_ORDERS' {...props} />}>
                </Route>

                <Route path="/orders/:orderId" 
                  render={(props) => <OrderDetails currentUser={this.state.currentUser} 
                   {...props}  />}/>

                <PrivateRoute authenticated={this.state.isAuthenticated} 
                  path="/myorders" component={OrderList} isUserOrders={true}
                  handleLogout={this.handleLogout} type='CURRENT_USER_ORDERS'
                  currentUser={this.state.currentUser} ></PrivateRoute>

                <Route path="/cart" 
                  render={(props)=> <Cart cartContent={this.state.cart} 
                  handleRemoveFromCart={this.handleRemoveFromCart} 
                  handleSubmitOrder={this.handleSubmitOrder}></Cart>}>
                </Route>

                <Route path="/login" 
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>

                 
                <PrivateRoute authenticated={this.state.isAuthenticated} 
                  path="/products/edit/:productId" component={NewProduct} 
                  handleLogout={this.handleLogout}></PrivateRoute>

                <Route path="/products/:productId" 
                  render={(props) => <ProductDetails currentUser={this.state.currentUser} 
                  handleAddToCart={this.handleAddToCart} {...props}  handleDeleteProduct={this.handleDeleteProduct}
                  isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser}/>}/>

                <Route path="/users/:username" 
                  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/product/new" component={NewProduct} handleLogout={this.handleLogout}></PrivateRoute>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default withRouter(App);