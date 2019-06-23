//TO DO add uploading of a picture 
import React, { Component } from 'react';
import { createProduct ,editProduct} from '../util/APIUtils';
import {  PRODUCT_DESCRIPTION_MAX_LENGTH, PRODUCT_NAME_MAX_LENGTH } from '../constants';
import './NewProduct.css';  
import { Form, Input, Button, notification } from 'antd';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import LoadingIndicator  from '../common/LoadingIndicator';
import { getProductById } from '../util/APIUtils';


const FormItem = Form.Item;
const { TextArea } = Input;


class NewProduct extends Component{
    constructor(props){
        super(props);
        this.state = {
            name :{
                text:''
            },
            description:{
                text:''
            },
            price:{
                value: 1
            },
            images:{
                array:[]
            },
            isLoading: true
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFilesChange = this.handleFilesChange.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        var productData = new FormData();

        productData.append("product", new Blob([JSON.stringify({
            name : this.state.name.text,
            description : this.state.description.text,
            price: this.state.price.text
        })],{
            type: "application/json"
        }));
        for(var i = 0; i< this.state.images.array.length;i++){
            productData.append("images",this.state.images.array[i].data);
        }

        let promise;
        if(this.props.match.params.productId!==undefined){

            console.log("editing product")
            promise = editProduct(productData,this.props.match.params.productId)
        }else{
            promise = createProduct(productData)
        }
        promise
        .then(response =>{
            this.props.history.push("/");
        }).catch(error =>{
            if(error.status === 401){
                this.props.handleLogout('/login','error',
                'You have been logged out. Please login to create a product.');
            }else {
                notification.error({
                    message: 'Online Shop',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    validateName = (nameText)=>{
        if(nameText.length === 0){
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter product name!'
            }
        } else if (nameText.length > PRODUCT_NAME_MAX_LENGTH){
            return {
                validateStatus: 'error',
                errorMsg: `Name is too long (Maximum ${PRODUCT_NAME_MAX_LENGTH} allowed)`
            }
        } else{
            return{
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }
    handleNameChange(event){
        const value = event.target.value;
        this.setState({
            name:{
                text: value,
                ...this.validateName(value)
            }
        });
    }

    validateDescription = (descriptionText) =>{
        if(descriptionText.length === 0){
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter product description!'
            }
        } else if (descriptionText.length > PRODUCT_DESCRIPTION_MAX_LENGTH){
            return {
                validateStatus: 'error',
                errorMsg: `Description is is too long (Maximum ${PRODUCT_DESCRIPTION_MAX_LENGTH} allowed)`
            }
        } else{
            return{
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleDescriptionChange(event){
        const value = event.target.value;
        this.setState({
            description:{
                text: value,
                ...this.validateDescription(value)
            }
        });
    }

    validatePrice = (priceText) =>{
        if(isNaN(priceText)){
            return{
                validateStatus: 'error',
                errorMsg: 'Price is invalid, please enter a valid number!'
            }
        } else if (Number(priceText) === 0){
            return{
                validateStatus: 'error',
                errorMsg: 'Price cannot be zero!'
            }
        }else if(Number(priceText) < 0){
            return{
                validateStatus: 'error',
                errorMsg: 'The price cannot be negative, please enter a valid price!'
            }
        } else{
            return{
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }
    handlePriceChange(event){
        const value = event.target.value;
        this.setState({
            price : {
                text: value,
                ...this.validatePrice(value)
            }

        });
    }

    validateImageArray =(images) => {
        if(images.length === 0){
            return{
                validateStatus: "error",
                errorMsg: "You need to upload atleast one image."
            }
        } else if(images.length > 3){
            return{
                validateStatus: "error",
                errorMsg: "You cannot upload more than 3 images."
            }
        }else{
            return{
                validateStatus: "success",
                errorMsg: null
            }
        }
    }

    validateImage =(image) =>{
        if(image.size >16*1024*1024){
            return{
                validateStatus: "error",
                errorMsg: "This file is too big!"
            }
        }else{
            return{
                validateStatus: "success",
                errorMsg: null
            }
        }
    }

    handleFilesChange(event){
        const value = Array.from(event.target.files);
        const fileArray = value.map(file => {
            return {
                fileName: file.name,
                fileType: file.ContentType,
                data: file,
                ...this.validateImage(file)
            }
        })
        this.setState({
            images:{
                array: fileArray,
                ...this.validateImageArray(fileArray)
            }

        })

    }
    convertBase64ToFile(image) {
        const byteString = atob(image.data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
          ia[i] = byteString.charCodeAt(i);
        }
        const newBlob = new Blob([ab], {
          type: image.fileType,
        });
        return newBlob;
    };

    getImageArray(images){
        const imageArray = images.map(image =>{
            const file = this.convertBase64ToFile(image);
            return {
                fileName: file.name,
                fileType: file.ContentType,
                data: file,
                ...this.validateImage(file)
            }
        })
        return imageArray
    }

    componentDidMount(){
        if(this.props.match.params.productId!==undefined){
            this.setState({
                isLoading: true
            })
            const productId = this.props.match.params.productId;
            getProductById(productId)
            .then(response =>{

                const imageArray = this.getImageArray(response.images)
                this.setState({
                    name: {
                        text:response.name,
                        ...this.validateName(response.name)
                    },
                    description: {
                        text: response.description,
                        ...this.validateDescription(response.description)
                    },
                    images:{
                        array: imageArray,
                        ...this.validateImageArray(imageArray)
                    },
                    price: {
                        text:response.price,
                        ...this.validatePrice(response.price)
                    },
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
                    notification.error({
                        message: 'Online Shop',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });      
                }
            });
        }else{
            this.setState({
                isLoading: false
            })
        }
        
    }

    isFormInvalid(){
        
        if(this.state.name.validateStatus !== 'success'){
            return true;
        }
        if(this.state.description.validateStatus !== 'success'){
            return true;
        }
        if(this.state.price.validateStatus !== 'success'){
            return true;
        }
        if(this.state.images.validateStatus !== 'success'){

            return true;
        }
        /*this.state.images.array.forEach(image => {
            if(image.validateStatus !== 'success'){
                return true;
            }
        });*/
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
        
        const imagePreviews = [];
        this.state.images.array.forEach((image,imageIndex)=>{

            imagePreviews.push(
                <img className="product-image-preview"
                        src={ URL.createObjectURL(image.data)} key={imageIndex}></img>
            )

        })

        return (
            <div className="new-product-container">
                <h1 className="page-tetle">Create Product</h1>
                <div className="new-product-content">
                    <Form onSubmit={this.handleSubmit} className="create-product-form">
                        <FormItem validateStatus = {this.state.images.validateStatus}
                            help={this.state.images.errorMsg} className="product-form-row">
                                <input onChange={this.handleFilesChange} multiple type="file"></input>
                                {imagePreviews}
                        </FormItem>
                        <FormItem validateStatus={this.state.name.validateStatus}
                                help={this.state.name.errorMsg} className="product-form-row">
                            <TextArea
                                placeholder="Enter product name"
                                style = {{fontSize:'16px'}}
                                autosize = {{minRows:3,maxRows:6}}
                                name = "name"
                                value = {this.state.name.text}
                                onChange = {this.handleNameChange}/>
                        </FormItem>
                        <FormItem validateStatus={this.state.description.validateStatus}
                                help={this.state.description.errorMsg} className="product-form-row">
                            <TextArea
                                placeholder="Enter product description"
                                style = {{fontSize:'16px'}}
                                autosize = {{minRows:3,maxRows:6}}
                                name = "description"
                                value = {this.state.description.text}
                                onChange= {this.handleDescriptionChange}/>
                        </FormItem>
                        <FormItem validateStatus={this.state.price.validateStatus}
                                help={this.state.price.errorMsg} className="product-form-row">
                            <TextArea
                                placeholder="Enter product price"
                                style = {{fontSize:'16px'}}
                                autosize = {{minRows:3,maxRows:6}}
                                name = "price"
                                value = {this.state.price.text}
                                onChange = {this.handlePriceChange}/>
                        </FormItem>
                        <FormItem className="product-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-product-form-button">Submit Product</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
    
}

export default NewProduct;