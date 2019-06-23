package com.course.onlineShop.controller;

import com.course.onlineShop.document.Role;
import com.course.onlineShop.document.User;
import com.course.onlineShop.exception.ResourceNotFoundException;
import com.course.onlineShop.payload.*;
import com.course.onlineShop.repository.ProductRepository;
import com.course.onlineShop.repository.UserRepository;
import com.course.onlineShop.security.CurrentUser;
import com.course.onlineShop.security.UserPrincipal;
import com.course.onlineShop.service.ProductService;
import com.course.onlineShop.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserInformation getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        List<String> roles = new ArrayList<String>();
        currentUser.getAuthorities().forEach(authority->{
            roles.add(authority.getAuthority());
        });
        UserInformation userInformation = new UserInformation(currentUser.getId(),
                currentUser.getUsername(), currentUser.getName() ,roles);
        return userInformation;
    }

    @GetMapping("/users/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/{username}")
    @PreAuthorize("hasRole('USER')")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User","username",username));

        long productCount = productRepository.countByCreatedBy(user.getId());

        UserProfile userProfile = new UserProfile(user.getId(),user.getUsername(),user.getName()
                ,user.getCreatedAt(),productCount);

        return userProfile;
    }

    @GetMapping("/users/{username}/products")
    public PagedResponse<ProductResponse> getProductsCreatedBy(@PathVariable(value = "username") String username,
                                                               @CurrentUser UserPrincipal currentUser,
                                                               @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                               @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size){
        return productService.getProductsCreatedBy(username,currentUser,page,size);
    }


}
