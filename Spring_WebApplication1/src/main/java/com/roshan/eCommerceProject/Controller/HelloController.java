package com.roshan.eCommerceProject.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/home")
    public String greet(HttpServletRequest request) {
        return "Welcome to Telusko";
    }
}

