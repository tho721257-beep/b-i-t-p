document.addEventListener('DOMContentLoaded', function() {

    // Cập nhật danh sách sản phẩm
    const products = [
        // Đã sửa ảnh món Vanilla Latte ở dòng dưới đây:
        { id: 1, name: "Vanilla Latte", price: 25, rating: 4.9, image: "img_product.png", type: "popular", isHot: true, isCold: true },
        { id: 2, name: "Espresso", price: 15, rating: 5.0, image: "espresso.png", type: "popular", isHot: true, isCold: true },
        { id: 3, name: "Hazelnut Latte", price: 30, rating: 4.9, image: "a2.png", type: "popular", isHot: true, isCold: true },
        { id: 4, name: "Sandwich", price: 12, rating: 4.5, image: "a4.png", type: "menu", isHot: true, isCold: false },
        { id: 5, name: "Hot Milk", price: 29, rating: 4.8, image: "a5.png", type: "menu", isHot: true, isCold: false },
        { id: 6, name: "Coffee Ice Cream", price: 222, rating: 4.9, image: "a6.png", type: "menu", isHot: false, isCold: true },
        { id: 7, name: "Cappuccino", price: 32, rating: 4.7, image: "a7.png", type: "menu", isHot: true, isCold: true },
        { id: 8, name: "Moccacino", price: 22, rating: 4.6, image: "a8.png", type: "menu", isHot: true, isCold: true },
        { id: 9, name: "Waffle Ice Cream", price: 120, rating: 5.0, image: "a9.png", type: "menu", isHot: false, isCold: true }
    ];

    let cart = []; 

    window.addToCart = function(id) {
        const product = products.find(p => p.id === id);
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCartCount();
        showToast('Đã thêm ' + product.name + ' vào giỏ!');
    };

    function updateCartCount() {
        const badge = document.getElementById('cart-badge');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            badge.style.display = 'block';
            badge.innerText = totalItems;
        } else {
            badge.style.display = 'none';
        }
    }

    const openCartBtn = document.getElementById('openCartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    openCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        renderCart();
        cartModal.style.display = 'flex';
    });

    function renderCart() {
        cartContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-center text-muted">Giỏ hàng trống trơn!</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                cartContainer.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h5>${item.name}</h5>
                            <p>${item.price} K x ${item.quantity} = <strong>${itemTotal} K</strong></p>
                        </div>
                        <button class="btn-remove-item" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
            });
        }
        cartTotalPrice.innerText = total + " K";
    }

    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartCount();
        renderCart(); 
    };


    window.closeCartModal = function() {
        cartModal.style.display = 'none';
    };

    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) closeCartModal();
    });

    window.checkout = function() {
        if (cart.length === 0) {
            showToast("Giỏ hàng đang trống bạn ơi!", "error");
        } else {
            showToast("Thanh toán thành công! Cảm ơn bạn ❤️");
            cart = []; 
            updateCartCount();
            closeCartModal();
        }
    };

    // Hàm xử lý sự kiện click vào tag Hot/Cold
    window.toggleTag = function(element) {
        // Xóa class active ở các tag anh em (cùng cha)
        const siblings = element.parentElement.children;
        for(let sib of siblings) {
            if(sib !== element) sib.classList.remove('active');
        }
        // Toggle class active cho phần tử được click
        element.classList.toggle('active');
    }

    function renderProducts(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        data.forEach(product => {
            let tagsHtml = '';
            // Thêm onclick="toggleTag(this)" vào các span
            if (product.isHot) tagsHtml += `<span class="tag tag-hot" onclick="toggleTag(this)">Hot</span>`;
            if (product.isCold) tagsHtml += `<span class="tag tag-cold" onclick="toggleTag(this)">Cold</span>`;

            const productHtml = `
                <div class="col-lg-4 col-md-6">
                    <div class="coffee-card">
                        <div class="card-image-wrapper">
                            <span class="rating-badge"><i class="bi bi-star-fill text-warning"></i> ${product.rating}</span>
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="card-content">
                            <h3>${product.name}</h3>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="price">${product.price} K</span>
                                <button class="btn-add-cart" onclick="addToCart(${product.id})"><i class="bi bi-cart-plus"></i></button>
                            </div>
                            <div class="tags mt-3">${tagsHtml}</div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productHtml;
        });
    }


    renderProducts(products.filter(p => p.type === 'popular'), 'popular-container');
    renderProducts(products.filter(p => p.type === 'menu'), 'menu-container');

    const searchForm = document.querySelector('form[role="search"]');
    const searchInput = document.getElementById('searchInput');
    const searchModal = document.getElementById('searchModal');
    const modalResults = document.getElementById('modal-results-container');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchText = searchInput.value.toLowerCase().trim();
            if (!searchText) return;
            const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchText));
            modalResults.innerHTML = '';
            if (filteredProducts.length > 0) {
                renderProducts(filteredProducts, 'modal-results-container');
            } else {
                modalResults.innerHTML = `<div class="text-center py-5"><i class="bi bi-emoji-frown" style="font-size: 4rem; color: var(--coffee-text);"></i><h4 class="mt-3" style="color: var(--coffee-dark);">Shop chưa cập nhập món này ạ!!!</h4></div>`;
            }
            searchModal.style.display = 'flex';
        });
    }
    window.closeSearchModal = function() { document.getElementById('searchModal').style.display = 'none'; };
    searchModal.addEventListener('click', function(e) { if (e.target === searchModal) closeSearchModal(); });

});

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {

        setTimeout(() => {
            preloader.style.opacity = '0'; 
            
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    }
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.classList.add('toast-message');
    
    let icon = 'bi-check-circle-fill'; 
    if (type === 'error') icon = 'bi-exclamation-circle-fill'; 
    
    toast.innerHTML = `
        <i class="bi ${icon}"></i>
        <span class="fw-bold">${message}</span>
    `;

    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}


let isLoggedIn = false;

let currentUser = {
    name: "Guest",
    avatar: "https://via.placeholder.com/40/5C3D2E/FFF?text=U" 
};


const sampleUser = { username: "admin", password: "123", name: "Admin" };

const loginModal = document.getElementById('loginModal');
const btnLogin = document.getElementById('btnLogin');

const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');

function openLoginModal() {
    if (isLoggedIn) {
        handleLogout();
    } else {
        loginContainer.style.display = 'block';
        signupContainer.style.display = 'none';
        loginModal.style.display = 'flex';
    }
}

function closeLoginModal() {
    loginModal.style.display = 'none';
}

loginModal.addEventListener('click', function(e) {
    if (e.target === loginModal) closeLoginModal();
});

window.toggleAuthMode = function() {
    if (loginContainer.style.display === 'none') {
      
        loginContainer.style.display = 'block';
        signupContainer.style.display = 'none';
    } else {
 
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    }
};


window.handleLogin = function(e) {
    e.preventDefault();
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;

    if (userIn === sampleUser.username && passIn === sampleUser.password) {
        loginSuccess(sampleUser.name);
    } else {
        showToast("Sai tài khoản hoặc mật khẩu!", "error");
    }
};


window.handleSignup = function(e) {
    e.preventDefault();
    const regName = document.getElementById('reg-username').value;
    

    showToast("Đăng ký thành công! Đang đăng nhập...");
    

    setTimeout(() => {
        loginSuccess(regName);
    }, 1000);
};


window.socialLogin = function(provider) {
    
    showToast(`Đang kết nối với ${provider}...`);
    
    setTimeout(() => {
        
        const fakeName = `${provider} User`;
        loginSuccess(fakeName);
    }, 1500);
};

function loginSuccess(name) {
    isLoggedIn = true;
    currentUser.name = name;
    
    showToast(`Chào mừng trở lại, ${name}!`);
    closeLoginModal();
    updateNavbarUser();
}

function handleLogout() {
    if(confirm("Bạn có chắc muốn đăng xuất?")) {
        isLoggedIn = false;
        currentUser.name = "Guest";
        showToast("Đã đăng xuất thành công.");
        
        btnLogin.innerHTML = 'Login';
        
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

function updateNavbarUser() {
    btnLogin.innerHTML = `<i class="bi bi-person-circle me-2"></i> ${currentUser.name}`;
}