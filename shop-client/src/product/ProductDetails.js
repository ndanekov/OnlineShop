import React, { Component } from 'react';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import './Product.css';
import { getProductById } from '../util/APIUtils';
import { Avatar, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import LoadingIndicator  from '../common/LoadingIndicator';

class ProductDetails extends Component{

    constructor(props){
        super(props);
        this.state = {
            product: null,
            isLoading: true
        }
        this.loadProduct = this.loadProduct.bind(this);
    }

    loadProduct(productId){

        this.setState({
            isLoading: true
        });

        getProductById(productId)
        .then(response =>{
            this.setState({
                product: response,
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
        const productId = this.props.match.params.productId;
        this.loadProduct(productId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.productId !== nextProps.match.params.productId) {
            this.loadUserProfile(nextProps.match.params.productId);
        }        
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
        
        const imageViews = [];
        this.state.product.images.forEach((image,imageIndex)=>{

            imageViews.push(
                <img className="product-image" key={imageIndex}
                    src={`data:${image.fileType};base64,${image.data}`} ></img>
            )
        })
        return(
            
            <div className="product-content">
                <div className="product-header">
                    <div className="product-creator-info">
                        <Link className="creator-link" to={`/users/${this.state.product.createdBy.username}`}>
                            <Avatar className="product-creator-avatar"
                                style={{backgroundColor:getAvatarColor(this.state.product.createdBy.name)}}>
                                {this.state.product.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="product-creator-name">
                                {this.state.product.createdBy.name}
                            </span>
                            <span className="product-creator-username">
                                @{this.state.product.createdBy.username}
                            </span>
                            <span className="product-creation-date">
                                {formatDateTime(this.state.product.creationDateTime)}
                            </span>
                            
                        </Link>
                        <div className="product-image-frame">
                            
                            {imageViews}
                        </div>
                    </div>
                    <div className="product-name">
                        {this.state.product.name}
                    </div>
                    <div className="product-price">
                        {this.state.product.price} BGN
                    </div>

                </div>
                <div>
                    {this.state.product.description}
                </div>
                <div>
                    { (this.props.isAuthenticated ) ?
                        (
                            <div>
                                <Button className="operation-Button" type="primary" onClick={(e)=>this.props.handleAddToCart(e,this.state.product)}>Add to cart</Button>
                                {(this.props.currentUser.roles.indexOf("ROLE_MODERATOR") !== -1) ?(
                                    
                                    <Button type="primary" className="operation-Button"
                                        onClick={(e) => this.props.history.push("/products/edit/"+this.state.product.id)}
                                        >Edit product</Button>

                                ):null}
                                {(this.props.currentUser.roles.indexOf("ROLE_ADMIN") !== -1) ?(
                                    <Button type="primary" className="operation-Button"
                                         onClick={(e) =>  
                                            this.props.handleDeleteProduct(e,this.state.product.id)}
                                    >Delete</Button>
                                ):null}
                            </div>

                        ):null}
                </div>
            </div>
        )
    }
}

export default ProductDetails;