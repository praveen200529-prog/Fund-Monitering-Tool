// auth.js - Authentication & Access Control Utility

class AuthManager {
    constructor() {
        this.session = null;
        this.init();
    }

    // Initialize authentication
    init() {
        this.session = this.getSession();
        if (!this.session) {
            this.redirectToLogin();
        }
    }

    // Get current session
    getSession() {
        const sessionData = sessionStorage.getItem('userSession');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        return isLoggedIn === 'true' && this.session !== null;
    }

    // Get current user role
    getUserRole() {
        return this.session ? this.session.role : null;
    }

    // Get user full name
    getUserName() {
        return this.session ? this.session.fullName : 'Guest';
    }

    // Get user permissions
    getPermissions() {
        return this.session ? this.session.permissions : [];
    }

    // Check if user has specific permission
    hasPermission(permission) {
        const permissions = this.getPermissions();
        return permissions.includes(permission);
    }

    // Check if user can access a page
    canAccessPage(pageName) {
        if (!this.session) return false;
        const allowedPages = this.session.accessControl.allowedPages;
        return allowedPages.includes(pageName);
    }

    // Check if user can access a feature
    canAccessFeature(featureName) {
        if (!this.session) return false;
        const features = this.session.accessControl.features;
        return features[featureName] === true;
    }

    // Get access control for current user
    getAccessControl() {
        return this.session ? this.session.accessControl : null;
    }

    // Logout user
    logout() {
        sessionStorage.removeItem('userSession');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        this.redirectToLogin();
    }

    // Redirect to login page
    redirectToLogin() {
        if (window.location.pathname !== '/index.html' && 
            !window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }

    // Session timeout checker (30 minutes)
    checkSessionTimeout() {
        if (!this.session) return;
        
        const loginTime = new Date(this.session.loginTime);
        const currentTime = new Date();
        const diffMinutes = (currentTime - loginTime) / (1000 * 60);
        
        if (diffMinutes > 30) {
            alert('Session expired. Please login again.');
            this.logout();
        }
    }

    // Hide elements based on permissions
    applyAccessControl() {
        const elements = document.querySelectorAll('[data-permission]');
        
        elements.forEach(element => {
            const requiredPermission = element.getAttribute('data-permission');
            
            if (!this.hasPermission(requiredPermission)) {
                element.style.display = 'none';
            }
        });
    }

    // Hide features based on access control
    applyFeatureControl() {
        const features = document.querySelectorAll('[data-feature]');
        
        features.forEach(feature => {
            const featureName = feature.getAttribute('data-feature');
            
            if (!this.canAccessFeature(featureName)) {
                feature.style.display = 'none';
            }
        });
    }

    // Display user info in dashboard
    displayUserInfo(elementId) {
        const element = document.getElementById(elementId);
        if (element && this.session) {
            element.innerHTML = `
                <div class="user-info">
                    <span class="user-name">${this.session.fullName}</span>
                    <span class="user-role">${this.capitalizeRole(this.session.role)}</span>
                </div>
            `;
        }
    }

    // Capitalize role name
    capitalizeRole(role) {
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    // Check and enforce page access
    enforcePage(requiredPage) {
        if (!this.canAccessPage(requiredPage)) {
            alert('Access Denied: You do not have permission to access this page.');
            this.redirectToDashboard();
        }
    }

    // Redirect to appropriate dashboard
    redirectToDashboard() {
        if (this.session) {
            window.location.href = this.session.accessControl.dashboard;
        }
    }
}

// Initialize auth manager
const auth = new AuthManager();

// Check session timeout every 5 minutes
setInterval(() => {
    auth.checkSessionTimeout();
}, 5 * 60 * 1000);

// Apply access control on page load
window.addEventListener('DOMContentLoaded', () => {
    auth.applyAccessControl();
    auth.applyFeatureControl();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}