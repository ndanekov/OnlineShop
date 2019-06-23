package com.course.onlineShop.service;

import com.course.onlineShop.document.ImageFile;
import com.course.onlineShop.document.Product;
import com.course.onlineShop.document.User;
import com.course.onlineShop.exception.AppException;
import com.course.onlineShop.exception.BadRequestException;
import com.course.onlineShop.exception.ResourceNotFoundException;
import com.course.onlineShop.payload.PagedResponse;
import com.course.onlineShop.payload.ProductRequest;
import com.course.onlineShop.payload.ProductResponse;
import com.course.onlineShop.repository.ImageFileRepository;
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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class ProductService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageFileRepository imageFileRepository;


    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public PagedResponse<ProductResponse> getAllProducts(int page,int size){
        validatePageNumberAndSize(page,size);

        Pageable pageable = PageRequest.of(page,size, Sort.Direction.DESC,"createdAt");
        Page<Product> products = productRepository.findAll(pageable);

        if(products.getNumberOfElements() == 0){
            return new PagedResponse<>(Collections.emptyList(),products.getNumber(),
                    products.getSize(),products.getTotalElements(),products.getTotalPages(),products.isLast());
        }

        Map<String, User> creatorMap = getProductCreatorMap(products.getContent());

        List<ProductResponse> productResponses = products.map(product -> {
            return ModelMapper.mapProductToProductResponse(product,
                    creatorMap.get(product.getCreatedBy()));
        }).getContent();

        return new PagedResponse<>(productResponses,products.getNumber(),
                products.getSize(),products.getTotalElements(),products.getTotalPages(),products.isLast());

    }

    public PagedResponse<ProductResponse> getProductsCreatedBy(String username, UserPrincipal currentUser, int page,int size){
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User","username",username));

        Pageable pageable = PageRequest.of(page,size,Sort.Direction.DESC,"createdAt");
        Page<Product> products = productRepository.findByCreatedBy(user.getId(),pageable);

        if(products.getNumberOfElements() == 0){
            return new PagedResponse<>(Collections.emptyList(),products.getNumber(),
                    products.getSize(),products.getTotalElements(),products.getTotalPages(),products.isLast());
        }

        List<ProductResponse> productResponses = products.map(product -> {
            return ModelMapper.mapProductToProductResponse(product,user);
                }).getContent();

        return new PagedResponse<>(productResponses,products.getNumber(),
                products.getSize(), products.getTotalElements(),products.getTotalPages(),products.isLast());

    }

    public Product createProduct(ProductRequest productRequest,MultipartFile[] images){
        Product product = new Product();

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(Float.toString(productRequest.getPrice()));
        List<ImageFile> imageList = new ArrayList<>();
        for (MultipartFile image : images) {
            try {
                imageList.add(new ImageFile(image.getOriginalFilename(), image.getContentType(), image.getBytes()));
            } catch (IOException e) {
                e.printStackTrace();
                throw new AppException("Failed to convert images");
            }
        }
        product.setImages(imageList);

        imageFileRepository.saveAll(product.getImages());
        return productRepository.save(product);
    }

    public Product editProduct(ProductRequest productRequest,MultipartFile[] images,String productId){
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product","Id",productId)
        );

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(Float.toString(productRequest.getPrice()));
        List<ImageFile> imageList = new ArrayList<>();
        for (MultipartFile image : images) {
            try {
                imageList.add(new ImageFile(image.getOriginalFilename(), image.getContentType(), image.getBytes()));
            } catch (IOException e) {
                e.printStackTrace();
                throw new AppException("Failed to convert images");
            }
        }
        product.setImages(imageList);

        imageFileRepository.saveAll(product.getImages());
        return productRepository.save(product);

    }

    public void deleteProduct(String productId){
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product","Id",productId)
        );

        productRepository.deleteById(productId);
    }

    public ProductResponse getProductById(String productId,UserPrincipal currentUser){
        Product product = productRepository.findById(productId.toString()).orElseThrow(
                () -> new ResourceNotFoundException("Product","Id",productId)
        );
        User creator = userRepository.findById(product.getCreatedBy()).orElseThrow(
                ()-> new ResourceNotFoundException("User","Id",product.getCreatedBy()));
        ProductResponse productResponse = ModelMapper.mapProductToProductResponse(product,creator);

        return productResponse;
    }


    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    Map<String, User> getProductCreatorMap(List<Product> products) {
        // Get Poll Creator details of the given list of polls
        List<String> creatorIds = products.stream()
                .map(product -> product.getCreatedBy())
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<String, User> creatorMap = creators.stream()
                .collect(Collectors.toMap(user -> user.getId(), Function.identity()));

        return creatorMap;
    }
}
