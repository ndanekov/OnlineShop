import React, { Component } from 'react';
import { Row, Col, Select,Input } from 'antd';


const { Option } = Select;
class SFBar extends Component{
    render(){
        return(
            <div>
                <Row gutter={16}>
                    <Col span={8} >
                        <h3>{this.props.count} currently loaded</h3>
                    </Col>
                    <Col span={8} >
                        <label>
                            <h3>Order by</h3>
                            <Select value={this.props.sort} style={{ width: 120 }} labelInValue
                                onChange={this.props.handleChangeSort} defaultValue={{key:'lowest'}}>
                                <Option value="">Select</Option>   
                                <Option value="lowest">Lowest to highest</Option>   
                                <Option value="highest">Highest to lowest</Option>   
                            </Select>
                        </label>
                    </Col>
                    <Col span={8} >
                        <Input placeholder="Search bar" onChange={this.props.handleSerchChange}></Input>
                    </Col>
                </Row>
                <br></br>
            </div>
            
            
        )
    }
}

export default SFBar;