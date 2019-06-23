package com.course.onlineShop.controller;

import com.course.onlineShop.document.Product;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @GetMapping
    public PagedResponse<ProductResponse> getProducts(
                                                      @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                      @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size){
        return productService.getAllProducts(page,size);
    }

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> createProduct(@Valid @RequestPart("product") ProductRequest productRequest,
                                           @RequestPart("images") MultipartFile[] images){
        Product product = productService.createProduct(productRequest,images);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{productId}")
                .buildAndExpand(product.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true,"Product Created Successfully"));
    }

    @PostMapping("/edit/{productId}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> update(@Valid @RequestPart("product") ProductRequest productRequest,
                                        @RequestPart("images") MultipartFile[] images,
                                        @PathVariable(value = "productId") String productId){
        Product product = productService.editProduct(productRequest,images,productId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{productId}")
                .buildAndExpand(product.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true,"Product Updated Successfully"));
    }

    @GetMapping("/{productId}")
    public ProductResponse getProductById(@CurrentUser UserPrincipal currentUser,
                                          @PathVariable(value = "productId") String productId){
        return productService.getProductById(productId,currentUser);
    }

    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/delete/{productId}")
    public ResponseEntity<?> deleteProduct(@CurrentUser UserPrincipal currentUser,
                                          @PathVariable(value = "productId") String productId){
        System.out.println("Heeeeey");
         productService.deleteProduct(productId);

        return ResponseEntity.ok()
                .body(new ApiResponse(true,"Product Deleted Successfully"));
    }
}
