package com.course.onlineShop.service;

import com.course.onlineShop.document.Order.DeliveryContacts;
import com.course.onlineShop.document.Order.Order;
import com.course.onlineShop.document.Order.OrderProduct;
import com.course.onlineShop.document.Order.OrderStatus;
import com.course.onlineShop.document.Product;
import com.course.onlineShop.document.User;
import com.course.onlineShop.exception.BadRequestException;
import com.course.onlineShop.exception.ResourceNotFoundException;
import com.course.onlineShop.payload.PagedResponse;
import com.course.onlineShop.payload.orderPayload.OrderProductItem;
import com.course.onlineShop.payload.orderPayload.OrderRequest;
import com.course.onlineShop.payload.orderPayload.OrderResponse;
import com.course.onlineShop.payload.orderPayload.OrderStatusRequest;
import com.course.onlineShop.repository.OrderProductRepository;
import com.course.onlineShop.repository.OrderRepository;
import com.course.onlineShop.repository.ProductRepository;
import com.course.onlineShop.repository.UserRepository;
import com.course.onlineShop.security.UserPrincipal;
import com.course.onlineShop.util.AppConstants;
import com.course.onlineShop.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private OrderRepository orderRepository;

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public PagedResponse<OrderResponse> getAllOrders(UserPrincipal currentUser,int page, int size){
        validatePageNumberAndSize(page,size);

        Pageable pageable = PageRequest.of(page,size, Sort.Direction.DESC,"createdAt");
        Page<Order> orders = orderRepository.findAll(pageable);

        if(orders.getNumberOfElements() == 0){
            return new PagedResponse<>(Collections.emptyList(),orders.getNumber(),
                    orders.getSize(),orders.getTotalElements(),orders.getTotalPages(),orders.isLast());
        }

        List<OrderResponse> orderResponses = orders.map(order ->{
            return ModelMapper.mapOrderToOrderResponse(order);
        }).getContent();

        return new PagedResponse<>(orderResponses,orders.getNumber(),
                orders.getSize(),orders.getTotalElements(),orders.getTotalPages(),orders.isLast());
    }

    public PagedResponse<OrderResponse> getCurrentUserOrders(UserPrincipal currentUser,int page, int size){
        validatePageNumberAndSize(page,size);

        Pageable pageable = PageRequest.of(page,size, Sort.Direction.DESC,"createdAt");
        Query query = new Query();
        query.addCriteria(Criteria.where("orderee.id").is(currentUser.getId()));
        User user = userRepository.findById(currentUser.getId()).orElseThrow(
                () -> new ResourceNotFoundException("User","Id",currentUser)
        );
        Page<Order> orders = orderRepository.findByOrderee(user,pageable);

        if(orders.getNumberOfElements() == 0){
            return new PagedResponse<>(Collections.emptyList(),orders.getNumber(),
                    orders.getSize(),orders.getTotalElements(),orders.getTotalPages(),orders.isLast());
        }

        List<OrderResponse> orderResponses = orders.map(order ->{
            return ModelMapper.mapOrderToOrderResponse(order);
        }).getContent();

        return new PagedResponse<>(orderResponses,orders.getNumber(),
                orders.getSize(),orders.getTotalElements(),orders.getTotalPages(),orders.isLast());
    }

    public Order createOrder(OrderRequest orderRequest, UserPrincipal currentUser){
        Order order = new Order();
        order.setStatus(OrderStatus.STATUS_NEW);
        order.setDeliveryContacts(new DeliveryContacts(orderRequest.getDeliveryContacts().getAddress(),
                orderRequest.getDeliveryContacts().getPhoneNumber()));
        User orderee = userRepository.findByUsername(currentUser.getUsername()).orElseThrow(
                () -> new ResourceNotFoundException("User","Id",currentUser.getId())
        );
        order.setOrderee(orderee);

        float totalPrice = 0;
        List<OrderProduct> orderProdList= new ArrayList<OrderProduct>();
        for(OrderProductItem orderProdRequest: orderRequest.getOrderProducts()){
            Product tmpProduct = productRepository.findById(orderProdRequest.getId()).orElseThrow(
                    () -> new ResourceNotFoundException("Product","Id",orderProdRequest.getId())
            );
            totalPrice += Float.parseFloat(tmpProduct.getPrice());
            orderProdList.add(new OrderProduct(tmpProduct.getName(),tmpProduct.getDescription(),
                    tmpProduct.getPrice(),orderProdRequest.getCount(),orderProdRequest.getId()));
        }
        order.setOrderProducts(orderProdList);
        order.setTotalPrice(Float.toString(totalPrice));
        orderProductRepository.saveAll(order.getOrderProducts());
        return orderRepository.save(order);
    }


    public OrderResponse getOrderById(String orderId){
        System.out.println("orderId");
        Order order = orderRepository.findById(orderId).orElseThrow(
                () ->new ResourceNotFoundException("Order","Id",orderId)
        );

        OrderResponse orderResponse = ModelMapper.mapOrderToOrderResponse(order);

        return orderResponse;
    }

    public OrderResponse updateOrderStatus(OrderStatusRequest orderStatusRequest){
        Order order = orderRepository.findById(orderStatusRequest.getOrderId()).orElseThrow(
                () -> new ResourceNotFoundException("Order","orderId",orderStatusRequest.getOrderId())
        );
        order.setStatus(OrderStatus.valueOf(orderStatusRequest.getNewStatus()));
        Order newOrder = orderRepository.save(order);
        return ModelMapper.mapOrderToOrderResponse(newOrder);
    }


    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }
}
