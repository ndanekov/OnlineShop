import React, { Component } from 'react';
import {getCurrentUserOrders,getAllOrders,updateOrderStatus} from "../util/APIUtils"
import Order from './Order';
import { Button, Icon } from 'antd';
import LoadingIndicator  from '../common/LoadingIndicator';
import { ITEM_LIST_SIZE } from '../constants';
import './OrderList.css'

class OrderList extends Component{
    constructor(props){
        super(props);
        this.state ={
            orders: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
        }
        this.handleChangeOrderStatus = this.handleChangeOrderStatus.bind(this);
    }

    loadOrderList(page = 0, size = ITEM_LIST_SIZE){
        let promise;
        if(this.props.type ==='CURRENT_USER_ORDERS'){
            promise = getCurrentUserOrders(this.props.username,page,size);
        } else {
            promise = getAllOrders(page,size);
        }
        console.log("promise set")
        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        return promise.then(response =>{
            const orders = this.state.orders.slice()

            this.setState({
                orders: orders.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })

        }).catch(error =>{
            this.setState({
                isLoading: false
            })
        });
    }

    componentDidMount() {
        this.loadOrderList()

    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                orders: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false,
            });    
            this.loadOrderList();
        }
    }

    handleLoadMore() {
        this.loadOrderList(this.state.page + 1);
    }


    handleChangeOrderStatus(value,order,orderIndex){
        const data = {
            orderId: order.id,
            newStatus: value.key
        }
        updateOrderStatus(data)
        .then(response =>{
            var orders = this.state.orders;
            orders[orderIndex] = response;
            this.setState({
                orders: orders
            })
        }).catch(error => {
            this.setState({
                serverError: true,
                isLoading: false
            });    
        })
    }
    render(){
        const orderViews = [];
        this.state.orders.forEach((order,orderIndex) =>{
            orderViews.push(
                <div key={order.id} className="order-content">
                    <Order 
                        order={order}
                        handleChangeOrderStatus={this.handleChangeOrderStatus}
                        orderIndex={orderIndex} currentUser={this.props.currentUser}
                    ></Order>
                </div>

            )

        })

        return(
            <div className="orders-container">
                {orderViews}
                {
                    !this.state.isLoading && this.state.orders.length ===0 ?(
                        <div className="no-products-found">
                            <span>No Orders Found.</span>
                        </div>
                    ):null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-products">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus"/> Load more
                            </Button>
                        </div>
                    ): null
                }
                 {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        )
    }
}

export default OrderList;