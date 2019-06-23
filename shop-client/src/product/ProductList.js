import React, { Component } from 'react';
import { getAllProducts, getUserCreatedProducts } from '../util/APIUtils';
import Product from './Product';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon } from 'antd';
import { ITEM_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './ProductList.css';
import SFBar from '../FilterAndSearchBar/SFBar';


class ProductList extends Component{
    constructor(props){
        super(props);
        this.state = {
            products: [],
            filteredProducts: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            sort: {key:'',lable:'Select'}
        };
        this.loadProductList = this.loadProductList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleChangeSort = this.handleChangeSort.bind(this);
        this.handleSerchChange = this.handleSerchChange.bind(this);
    }

    loadProductList(page = 0, size = ITEM_LIST_SIZE){
        let promise;
        if(this.props.username){
            if(this.props.type ==='USER_CREATED_PRODUCTS'){
                promise = getUserCreatedProducts(this.props.username,page,size);
            } else {
                promise = getAllProducts(page,size);
            }
        } else{
            promise = getAllProducts(page,size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        return promise
        .then(response => {
            const products = this.state.products.slice();
            
            this.setState({
                products: products.concat(response.content),
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
        this.loadProductList().then(res =>{
            const prods = this.state.products
            this.setState({
                filteredProducts: prods
            })
        })

    }


    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                products: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });    
            this.loadProductList();
        }
    }

    handleLoadMore() {
        this.loadProductList(this.state.page + 1);
    }

    handleChangeSort(value){

        this.setState({sort: value})
        this.sortProducts()
    }
    sortProducts(){
        this.setState(state=>{
            if(state.sort.key!==''){
                state.products.sort((a,b)=>(state.sort.key==="lowest")?(a.price >b.price?1:-1):(a.price <b.price?1:-1))
            }

            return {filteredProducts: state.products}
        })
    }

    handleSerchChange(event){
        const searchPattern = event.target.value;
        const products = this.foundProducts(searchPattern);
        this.setState({
            filteredProducts: products
        });

    }

    foundProducts(searchPattern){
        return this.state.products.filter((product) => product.name.includes(searchPattern));
    }

    render(){
        const productViews = [];
        this.state.filteredProducts.forEach((product,productIndex) =>{

            productViews.push(
                <div key={product.id}>
                    <Product
                        product={product}/>
                        { (this.props.isAuthenticated ) ?
                        (
                            <div>
                                <Button className="operation-Button" type="primary" onClick={(e)=>this.props.handleAddToCart(e,product)}>Add to cart</Button>
                                {(this.props.currentUser.roles.indexOf("ROLE_MODERATOR") !== -1) ?(
                                    
                                    <Button type="primary" className="operation-Button"
                                        onClick={(e) => this.props.history.push("/products/edit/"+product.id)}
                                        >Edit product</Button>

                                ):null}
                                {(this.props.currentUser.roles.indexOf("ROLE_ADMIN") !== -1) ?(
                                    <Button type="primary" className="operation-Button"
                                         onClick={(e) =>  
                                            this.props.handleDeleteProduct(e,product.id)}
                                    >Delete</Button>
                                ):null}
                            </div>

                        ):null}
                    
                </div>
                )
        });
        return(
            <div className="products-container">
                <SFBar count={this.state.products.length} sort={this.state.sort} 
                    handleChangeSort={this.handleChangeSort} 
                    handleSerchChange={this.handleSerchChange}></SFBar>
                {productViews}
                {
                    !this.state.isLoading && this.state.products.length === 0 ?(
                        <div className="no-products-found">
                            <span>No Products Found.</span>
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
        );
    }
}

export default withRouter(ProductList);