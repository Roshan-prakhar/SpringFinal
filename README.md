# 🛒 Walmart Clone – Full-Stack E-commerce Web Application

![GitHub repo size](https://img.shields.io/github/repo-size/Roshan-prakhar/Walmart-Clone)
![GitHub stars](https://img.shields.io/github/stars/Roshan-prakhar/Walmart-Clone?style=social)
![GitHub forks](https://img.shields.io/github/forks/Roshan-prakhar/Walmart-Clone?style=social)
![License](https://img.shields.io/github/license/Roshan-prakhar/Walmart-Clone)

A **full-stack e-commerce platform** inspired by Walmart 🛒.  
Built with **Spring Boot (Java) + React.js + H2 Database + Docker**, featuring smart compare, cart, checkout, order history, and **AI-powered price trends**.

This project replicates the **look, feel, and functionality** of a real-world e-commerce site while being lightweight and customizable for learning and development.

---

## ✨ Key Features

### 🏬 Shopping Experience
- Product listing with dynamic categories (Laptops, Fashion, Electronics, etc.)  
- Product detail page with description, images, and price trends  
- Category filters & search functionality  

### 🛒 Cart & Checkout
- Add to Cart (single-unit control, no duplicate bugs)  
- Update/remove items from cart  
- Checkout popup + Order confirmation  
- Order history page  

### 💡 Smart Features
- **Smarty Compare:** AI-assisted product comparison  
- **Price Trend Graph:** Backend generates price history + AI summary  

### 🎨 UI/UX
- Walmart-style clean, responsive design  
- Tailwind + ShadCN UI components  
- Mobile-friendly grid layout  
- Pixel-perfect category buttons & hero banner  

---

## 🏗️ Architecture

- **Frontend:** React.js (Home, Product, Cart, Checkout, Order History)  
- **Backend:** Spring Boot REST APIs (Products, Cart, Checkout, AI Integration)  
- **Database:** H2 (in-memory) with Spring Data JPA  
- **Server:** Tomcat (embedded)  
- **Containerization:** Docker (for deployment)  
- **AI Integration:** Spring AI (OpenAI API)  

```mermaid
flowchart TD
  User[User Interface] --> |React.js| Frontend[Frontend App]
  Frontend --> |REST API| Backend[Spring Boot Backend]
  Backend --> |Fetch & Store| DB[(Postgreql Database)]
  Backend --> |AI Query| AI[Spring AI - OpenAI]
