package com.roshan.eCommerceProject.Controller;

import com.roshan.eCommerceProject.Model.OrderHistory;
import com.roshan.eCommerceProject.Repository.OrderHistoryRepository;
import com.roshan.eCommerceProject.Repository.ProductRepo;
import com.roshan.eCommerceProject.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import com.roshan.eCommerceProject.Model.Product;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepo  productRepo;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product.getId() > 0) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable int productId) {
        Product product = productService.getProductById(productId);
        if (product.getId() > 0) {
            return new ResponseEntity<>(product.getImageData(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public void updateStockAfterPurchase(int productId, int quantity) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        int updatedStock = product.getStockQuantity() - quantity;
        product.setStockQuantity(Math.max(updatedStock, 0));
        productRepo.save(product);
    }



    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart("product") Product product, @RequestPart("imageFile") MultipartFile image) {
        Product savedProduct = null;
        try {
            savedProduct = productService.addOrUpdateProduct(product, image);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }



    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestPart Product product, @RequestPart MultipartFile imageFile) {
        Product updatedProduct = null;
        try {
            updatedProduct = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/product/category")
    public ResponseEntity<List<Product>> getByCategory(@RequestParam String name) {
        List<Product> products = productService.getByCategory(name);
        return ResponseEntity.ok(products);
    }
    @Autowired
    private OrderHistoryRepository repository;

    @PostMapping
    public ResponseEntity<?> saveOrder(@RequestBody List<OrderHistory> orders) {
        return ResponseEntity.ok(repository.saveAll(orders));
    }

    @GetMapping
    public List<OrderHistory> getAllOrders() {
        return repository.findAllByOrderByOrderTimeDesc();
    }


    @GetMapping("/product/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("keyword") String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        System.out.println("searching with :" + keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/product/{id}/compare")
    public ResponseEntity<?> compareProduct(@PathVariable int id) {
        List<Product> products = productService.findComparables(id);
        return products.isEmpty()
                ? new ResponseEntity<>(HttpStatus.NOT_FOUND)
                : new ResponseEntity<>(products, HttpStatus.OK);
    }

}




