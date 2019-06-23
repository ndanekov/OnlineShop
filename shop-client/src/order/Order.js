import React, { Component } from 'react';
import '../product/Product.css';
import { Link } from 'react-router-dom';
import { Row, Col, Select } from 'antd';

const { Option } = Select;
class Order extends Component{
    constructor(props){
        super(props);
        
    }

    render(){
        let status;
        if(this.props.order.status==='STATUS_NEW'){
            status = 'NEW'
        } else if(this.props.order.status==='STATUS_DONE'){
            status = 'DONE'
        } else{
            status = 'PROCESSING'
        }
        return(
                <div >
                
                    <Row gutter={16}>
                    <Link to={`/orders/${this.props.order.id}`} >
                        <Col span={6}>
                            <h3>{this.props.order.id}</h3>
                        </Col >
                        <Col span={6}>
                            <h3>{this.props.order.orderee.name}</h3>
                        </Col>
                        <Col span={6}>
                            <h3>{this.props.order.totalprice} BGN</h3>
                        </Col>
                        <Col span={6}>
                            <h3>{this.props.order.createdAt}</h3>
                        </Col>
                        </Link>
                        <Col span={6}>
                        {(this.props.currentUser.roles.indexOf("ROLE_ADMIN") !== -1)?(
                            <Select value={{key:this.props.order.status}} style={{ width: 120 }} labelInValue
                            onChange={(e) =>this.props.handleChangeOrderStatus(e,this.props.order,
                                this.props.orderIndex)} >
                            <Option value="STATUS_NEW" style={{backgroundColor: "red"}}>New</Option>   
                            <Option value="STATUS_PROCESSING" 
                                style={{backgroundColor: "yellow"}} >Processing</Option>   
                            <Option value="STATUS_DONE" style={{backgroundColor: "green"}}>Done</Option>   
                        </Select>
                        ):(
                            <span>{status}</span>
                        )}
                            
                        </Col>
                    </Row>

                <br/>
            
            </div>
        )
        

    }
}

export default Order;