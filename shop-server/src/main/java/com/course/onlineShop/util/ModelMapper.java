package com.course.onlineShop.util;

import com.course.onlineShop.document.Order.Order;
import com.course.onlineShop.document.Product;
import com.course.onlineShop.document.User;
import com.course.onlineShop.exception.BadRequestException;
import com.course.onlineShop.payload.ImageFileContainer;
import com.course.onlineShop.payload.ProductResponse;
import com.course.onlineShop.payload.UserSummary;
import com.course.onlineShop.payload.orderPayload.DeliveryContacts;
import com.course.onlineShop.payload.orderPayload.OrderProductResponse;
import com.course.onlineShop.payload.orderPayload.OrderResponse;

import java.util.ArrayList;
import java.util.List;

public class ModelMapper {
    public static ProductResponse mapProductToProductResponse(Product product, User creator){
        ProductResponse productResponse = new ProductResponse();
        try{

            productResponse.setId(product.getId());
            productResponse.setName(product.getName());
            productResponse.setDescription(product.getDescription());
            productResponse.setCreationDateTime(product.getCreatedAt());
            productResponse.setPrice(Float.parseFloat(product.getPrice()));
            List<ImageFileContainer> imageList = new ArrayList<ImageFileContainer>();
            product.getImages().forEach(image ->{
                imageList.add(new ImageFileContainer(image.getFileName(),image.getFileType(),image.getData()));
            });
            productResponse.setImages(imageList);
            UserSummary creatorSummery = new UserSummary(creator.getId()
                    ,creator.getUsername(),creator.getName());
            productResponse.setCreatedBy(creatorSummery);

        }catch (Exception e){
            throw new BadRequestException("failed to create response",e);
        }



        return productResponse;
    }

    public static OrderResponse mapOrderToOrderResponse(Order order){
        OrderResponse orderResponse = new OrderResponse();
        try{
            orderResponse.setId(order.getId());
            orderResponse.setStatus(order.getStatus().toString());
            orderResponse.setTotalprice(Float.parseFloat(order.getTotalPrice()));

            User orderee = order.getOrderee();
            orderResponse.setOrderee(new UserSummary(orderee.getId(),orderee.getUsername(),orderee.getName()));

            DeliveryContacts deliveryContacts = new DeliveryContacts();
            deliveryContacts.setAddress(order.getDeliveryContacts().getAddress());
            deliveryContacts.setPhoneNumber(order.getDeliveryContacts().getPhoneNumber());
            orderResponse.setDeliveryContacts(deliveryContacts);


            List<OrderProductResponse> orderProdItems = new ArrayList<OrderProductResponse>();

            order.getOrderProducts().forEach(product ->{
                orderProdItems.add(new OrderProductResponse(product.getId(),
                        product.getCount(),product.getOriginalId(), product.getName()));
            });
            orderResponse.setOrderProducts(orderProdItems);
            orderResponse.setCreationTime(order.getCreatedAt());
        }catch (Exception e){
            throw new BadRequestException("failed to create response",e);
        }


        return orderResponse;
    }
}
