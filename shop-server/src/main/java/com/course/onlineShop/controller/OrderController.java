package com.course.onlineShop.controller;

import com.course.onlineShop.document.Order.Order;
import com.course.onlineShop.payload.ApiResponse;
import com.course.onlineShop.payload.PagedResponse;
import com.course.onlineShop.payload.ProductResponse;
import com.course.onlineShop.payload.orderPayload.OrderRequest;
import com.course.onlineShop.payload.orderPayload.OrderResponse;
import com.course.onlineShop.payload.orderPayload.OrderStatusRequest;
import com.course.onlineShop.security.CurrentUser;
import com.course.onlineShop.security.UserPrincipal;
import com.course.onlineShop.service.OrderService;
import com.course.onlineShop.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public PagedResponse<OrderResponse> getOrders(@CurrentUser UserPrincipal currentUser,
                                                    @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                    @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size){
        return orderService.getAllOrders(currentUser,page,size);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('USER')")
    public PagedResponse<OrderResponse> getCurrentUserOrders(@CurrentUser UserPrincipal currentUser,
                                                  @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                  @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size){
        return orderService.getCurrentUserOrders(currentUser,page,size);
    }

    @GetMapping("/byId/{orderId}")
    @PreAuthorize("hasRole('USER')")
    public OrderResponse getOrderById(@CurrentUser UserPrincipal currentUser,
                                      @PathVariable(value = "orderId") String orderId){
        return orderService.getOrderById(orderId);
    }

    @PostMapping("/updateStatus")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponse setOrderStatus(@CurrentUser UserPrincipal currentUser,
                                        @RequestBody OrderStatusRequest orderStatus){

        return orderService.updateOrderStatus(orderStatus);
    }
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createOrder(@CurrentUser UserPrincipal currentUser,
                                         @RequestBody OrderRequest orderRequest){

        Order order = orderService.createOrder(orderRequest,currentUser);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{orderId}")
                .buildAndExpand(order.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true,"Order Created Successfully"));
    }
}
