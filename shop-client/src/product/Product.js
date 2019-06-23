import React, { Component } from 'react';
import './Product.css';
import { Link } from 'react-router-dom';


class Product extends Component{
    constructor(props){
        super(props);
        
    }
    render(){
        
        return(
            <div className="product-content">
                <div className="product-header">
                    <div className="product-creator-info">
                        <Link className="creator-link" to={`/products/${this.props.product.id}`}>
                            
                            <div className="product-image-frame">
                            
                                <img className="product-image"
                                    src={`data:${this.props.product.images[0].fileType};base64,${this.props.product.images[0].data}`} ></img>
                            </div>
                            
                        </Link>
                    </div>
                    <div className="product-name">
                        {this.props.product.name}
                    </div>
                    
                </div>
                <div className="product-price">
                        {this.props.product.price} BGN
                </div>
                
            </div>
        )
    }
}

export default Product;