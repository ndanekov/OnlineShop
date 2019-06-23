package com.course.onlineShop.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.course.onlineShop.document.Order.DeliveryContacts;
import com.course.onlineShop.document.Order.Order;
import com.course.onlineShop.document.Order.OrderProduct;
import com.course.onlineShop.document.Order.OrderStatus;
import com.course.onlineShop.document.Product;
import com.course.onlineShop.document.Role;
import com.course.onlineShop.document.RoleName;
import com.course.onlineShop.document.User;
import com.course.onlineShop.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackageClasses = UserRepository.class)
@Configuration
public class MongoDBConfig {

    @Bean
    CommandLineRunner commandLineRunner( OrderProductRepository orderProductRepository,
                                         OrderRepository orderRepository,UserRepository userRepository,
                                         ProductRepository productRepository){
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {


                //order creation
                /*Optional<User> orderee = userRepository.findByUsername("administrator");
                if(orderee.isPresent()){
                    Optional<Product> product = productRepository.findById("5d0a452b0685386141cad915");
                    if(product.isPresent()){
                        Order order = new Order();
                        order.setDeliveryContacts(new DeliveryContacts("somewhere","856743593"));
                        order.setOrderee(orderee.get());
                        order.setStatus(OrderStatus.STATUS_NEW);
                        Product tmp = product.get();
                        OrderProduct op = new OrderProduct(tmp.getName(),
                                tmp.getDescription(),tmp.getPrice(),2);
                        List<OrderProduct> oplist = new ArrayList<>();
                        oplist.add(op);
                        order.setOrderProducts(oplist);
                        orderProductRepository.saveAll(order.getOrderProducts());
                        System.out.println("saving first order");
                        try{
                            orderRepository.save(order);

                        }catch(Exception e){
                            System.out.println(e.getMessage());
                            System.out.println(e.getCause());
                        }



                    }

                }*/

            }
        };
    }
}
