import React, { Component } from 'react';
import Product from '../product/Product'
import {Button,Form,Input} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import 'react-phone-number-input/style.css'
import PhoneInput  from 'react-phone-number-input'
import {isValidPhoneNumber } from 'react-phone-number-input'

const { TextArea } = Input


class Cart extends Component{

    constructor(props){
        super(props);
        this.state = {
            phoneNumber:{
                text:''
            },
            address:{
                text:''
            }
        }

        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);

    }


    validateAddress = (address) => {
        if(address.length === 0){
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter shpping address!'
            }
        }else{
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleAddressChange(event){
        const value = event.target.value;
        this.setState({
            address:{
                text:value,
                ...this.validateAddress(value)
            }
        })
    }

    validatePhone= (phone) => {
        if(!isValidPhoneNumber(phone)){
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter valid contact phone!'
            }
        }else{
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handlePhoneChange(phone){
        console.log(phone)
        this.setState({
            phoneNumber:{
                text:phone,
                ...this.validatePhone(phone)
            }
        })
    }


    isFormInvalid(){

        if(this.state.address.validateStatus !== 'success'){
            return true;
        }
        if(this.state.phoneNumber.validateStatus !=='success'){
            return true;
        }else{
            return false;
        }
    }
                                        /*<TextArea
                                        placeholder="Enter contact phone number"
                                        style = {{fontSize:'16px'}}
                                        autosize = {{minRows:3,maxRows:6}}
                                        name = "phoneNumber"
                                        value = {this.state.phoneNumber.text}
                                        onChange = {this.handlePhoneChange}/>*/

    render(){
        console.log(this.state)
        const productViews = [];
        this.props.cartContent.cartItems.forEach((cartItem,cartItemIndex) =>{

            productViews.push(
            <div key={cartItemIndex}>
                <Product
                    key={cartItem.id}
                    product={cartItem}
                    handleAddToCart={this.props.handleRemoveFromCart}
                ></Product>
                <h3>Amount x{cartItem.count}</h3>
                <Button type="primary" onClick={(e)=>this.props.handleRemoveFromCart(e,cartItem,cartItemIndex)}>Remove</Button>
            </div>
                )
        });



        return(
            
            <div className="products-container">
                {
                    this.props.cartContent.cartItems.length === 0 ?(
                        <div className="no-products-found">
                            <span>Cart is empty</span>
                        </div>
                    ) : (
                        <div>
                            {productViews}
                            <h3 align="center">Your total is: {this.props.cartContent.totalPrice} BGN</h3>
                            <Form onSubmit={(e)=>this.props.handleSubmitOrder(e,this.state.address,this.state.phoneNumber)}>
                                <FormItem className="product-form-row"
                                    help={this.state.address.errorMsg}>
                                    <TextArea
                                        placeholder="Enter delivery address"
                                        style = {{fontSize:'16px'}}
                                        autosize = {{minRows:3,maxRows:6}}
                                        name = "address"
                                        value = {this.state.address.text}
                                        onChange = {this.handleAddressChange}/>
                                </FormItem>
                                <FormItem className="product-form-row"
                                    help={this.state.phoneNumber.errorMsg} >
                                     <PhoneInput
                                        placeholder="Enter phone number"
                                        value={ this.state.phone}
                                        onChange={ phone => this.handlePhoneChange(phone)} />
                                </FormItem>
                                <FormItem className="product-form-row">
                                    <Button type="primary" 
                                    htmlType="submit" 
                                    size="large" 
                                    disabled={this.isFormInvalid()}
                                    className="create-product-form-button">Submit Order</Button>
                                </FormItem>
                            </Form>
                        </div>
                    )
                }
                
            </div>
        )
        
    }
}
export default Cart;