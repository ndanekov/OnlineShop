import React, { Component } from 'react';
import { getOrderById ,updateOrderStatus} from '../util/APIUtils';
import { Avatar, Row, Col, Select} from 'antd';
import { Link } from 'react-router-dom';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import LoadingIndicator  from '../common/LoadingIndicator';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import './OrderDetails.css'

const { Option } = Select;

class OrderDetails extends Component{
    constructor(props){
        super(props);
        this.state ={
            order: null,
            isLoading: true
        }
        this.loadOrder = this.loadOrder.bind(this)
    }

    loadOrder(orderId){
        this.setState({
            isLoading: true
        });
        console.log("getting order")
        getOrderById(orderId)
        .then(response =>{
            this.setState({
                order: response,
                isLoading: false
            })
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
            }
        }); 
    }


    componentDidMount() {
        const orderId = this.props.match.params.orderId;
        this.loadOrder(orderId);
        console.log(this.state)
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.orderId !== nextProps.match.params.orderId) {
            this.loadUserProfile(nextProps.match.params.orderId);
        }        
    }
    
    handleChangeOrderStatus(value){
        const data = {
            orderId: this.state.order.id,
            newStatus: value.key
        }
        updateOrderStatus(data)
        .then(response =>{

            this.setState({
                order: response
            })
        }).catch(error => {
            this.setState({
                serverError: true,
                isLoading: false
            });    
        })
    }

    render(){
        if(this.state.isLoading) {

            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        let status;
        if(this.state.order.status==='STATUS_NEW'){
            status = 'NEW'
        } else if(this.state.order.status==='STATUS_DONE'){
            status = 'DONE'
        } else{
            status = 'PROCESSING'
        }

        const products =[];
        this.state.order.orderProducts.forEach(element => {
            products.push(
                <div className="product-info">
                    <Link key={element.id}to={`/products/${element.originalId}`}>
                        <Row gutter={10}>
                            <Col span={8}>
                                <h3>{element.id}</h3>
                            </Col>
                            <Col span={8}>
                                <h3>{element.originalName}</h3>
                            </Col>
                            <Col span={8}>
                                <h3>Amount:{element.count}</h3>
                            </Col>
                        </Row>
                    </Link>
                </div>
            )
        });
        console.log(this.state.order)
        return(
            <div className="order-details-container">
                <div>
                    <div className="order-id">
                        <h4>Order Id:{this.state.order.id}</h4>
                    </div>

                    
                    <div className = "creator-info">
                        <Link to={`/users/${this.state.order.orderee.username}`}
                            className="">
                            <Avatar className=""
                                style={{backgroundColor:getAvatarColor(this.state.order.orderee.name)}}>
                                {this.state.order.orderee.name[0].toUpperCase()}
                            </Avatar>
                            <span className="product-creator-name">
                                {this.state.order.orderee.name}
                            </span>
                            <span className="product-creator-username">
                                @{this.state.order.orderee.username}
                            </span>
                            <span className="order-creation-time">
                                {formatDateTime(this.state.order.creationTime)}
                            </span>
                        </Link>

                    </div>
                    <div className="delivery-content">
                        <h3>Delivery contacts</h3>
                        <h3>Address: {this.state.order.deliveryContacts.address}</h3>
                        <h3>Contact phone:{this.state.order.deliveryContacts.phoneNumber}</h3>
                    </div>
                    {products}
                    <div className="price-content">
                        <h3>{this.state.order.totalprice}BGN</h3>
                    </div>
                    <div className="status-field">
                        {(this.props.currentUser.roles.indexOf("ROLE_ADMIN") !== -1)?(
                            <Select value={{key:this.state.order.status}} style={{ width: 120 }} labelInValue
                                onChange={(e)=>this.handleChangeOrderStatus(e)}>
                                <Option value="STATUS_NEW" style={{backgroundColor: "red"}}>New</Option>   
                                <Option value="STATUS_PROCESSING" 
                                    style={{backgroundColor: "yellow"}} >Processing</Option>   
                                <Option value="STATUS_DONE" style={{backgroundColor: "green"}}>Done</Option>   
                            </Select>
                            ):(
                                <span>{status}</span>
                        )}

                    </div>

                </div>

            </div>
        )
    }
}

export default OrderDetails;