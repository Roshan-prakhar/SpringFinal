// src/components/Footer.js
import React from "react";

const Footer = () => (
    <footer style={styles.footer}>
        <div style={styles.container}>
            <div style={styles.brand}>
                <img src="/logo.png" alt="Walmart‑style Logo" style={styles.logo} />
                <span style={styles.name}>Walmart</span>
            </div>
            <div style={styles.links}>
                <a href="#" style={styles.link}>About</a>
                <a href="#" style={styles.link}>Privacy Policy</a>
                <a href="#" style={styles.link}>Terms & Conditions</a>
                <a href="#" style={styles.link}>Contact Us</a>
            </div>
            <div style={styles.copy}>
                © {new Date().getFullYear()} Walmart. All rights reserved.
            </div>
        </div>
    </footer>
);

const styles = {
    footer: {
        backgroundColor: "#0071ce", // Walmart‑blue
        color: "#ffffff",
        padding: "1.5rem 0",
        boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1rem",
        textAlign: "center",
    },
    brand: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1rem",
    },
    logo: {
        height: "30px",
        marginRight: "0.5rem",
    },
    name: {
        fontSize: "1.25rem",
        fontWeight: 600,
    },
    links: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1rem",
    },
    link: {
        color: "#ffffff",
        textDecoration: "none",
        fontSize: "0.95rem",
    },
    copy: {
        fontSize: "0.85rem",
        opacity: 0.8,
    },
};

export default Footer;
