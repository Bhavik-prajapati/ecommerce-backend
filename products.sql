INSERT INTO products 
(name, description, price, stock, image_url, category_id, created_at, updated_at, average_rating, rating_count)
VALUES
('iPhone 14', 'Apple smartphone with A15 Bionic chip', 70.00, 50, 'https://iplanet.one/cdn/shop/files/iPhone_14_Starlight_PDP_Image_Position-1A__WWEN_d53da00d-03ea-40db-8c13-08227bfb5e3a.jpg?v=1691142551&width=823', 1, NOW(), NOW(), 3.00, 3),
('Samsung TV', '55 inch 4K UHD Smart TV', 25.00, 30, 'https://amstradworld.com/wp-content/uploads/2023/12/Amstrad-AM65UWGTA-WebOS-TV_front.jpg', 1, NOW(), NOW(), 0.00, 0),
('Men T-Shirt', 'Cotton T-shirt', 50.00, 200, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg', 2, NOW(), NOW(), 0.00, 0),
('Harry Potter', 'Fantasy novel by J.K. Rowling', 150.00, 100, 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg', 3, NOW(), NOW(), 0.00, 0),
('Iphone 15', 'sony tv 64 inch', 1000.00, 10, 'https://carefone.in/cdn/shop/files/purple-1_39c8c5b3-3f83-4da9-acd9-adb4dc40c341.jpg?v=1710227367', 1, NOW(), NOW(), 0.00, 0),
('steal Bottles', 'milton water bottle 5 liter', 100.00, 100, 'https://kitchenmart.co.in/cdn/shop/files/ancy_750_ml_-_brown_1024_pxl_-_website.jpg?v=1683042538&width=900', 4, NOW(), NOW(), 0.00, 0),
('Adidas Hoodie', 'Comfortable cotton hoodie for men', 75.00, 150, 'https://m.media-amazon.com/images/I/91u3UZrB8rL._UY1100_.jpg', 2, NOW(), NOW(), 0.00, 0),
('Logitech MX Master 3', 'Advanced wireless mouse with ergonomic design', 99.00, 60, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQep_mjQCAKqfaVO0BPE330E1KHOKkp_vt8rA&s', 1, NOW(), NOW(), 0.00, 0),
('Levi’s Jeans', 'Slim fit stretchable denim jeans', 65.00, 120, 'https://levi.in/cdn/shop/files/531cf0bed572f358f641b65ea0fb01f5_360x.jpg?v=1745227507', 2, NOW(), NOW(), 4.20, 10),
('Kindle Paperwhite', 'E-reader with adjustable warm light', 130.00, 40, 'https://media.wired.com/photos/618076ef6fe08d62522d94c7/master/pass/Gear-Kindle-Paperwhite-top.jpg', 3, NOW(), NOW(), 0.00, 0),
('Prestige Cooker', '5 liter aluminum pressure cooker', 55.00, 90, 'https://shop.ttkprestige.com/media/catalog/product/5/0/5069-10753-P-IMG1.jpg', 4, NOW(), NOW(), 0.00, 0),
('Canon EOS 90D', 'Professional DSLR camera with 32.5MP sensor', 1200.00, 15, 'https://m.media-amazon.com/images/I/71QC8GLlTCL.jpg', 1, NOW(), NOW(), 0.00, 0),
('Puma Sports Cap', 'Adjustable unisex running cap', 25.00, 200, 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/022356/01/fnd/IND/fmt/png/teamLIGA-Contrast-Visor-Football-Cap', 2, NOW(), NOW(), 0.00, 0),
('Cuisinart Blender', 'High power kitchen blender 700W', 80.00, 70, 'https://m.media-amazon.com/images/I/615EdzmgQWL._UF894,1000_QL80_.jpg', 4, NOW(), NOW(), 0.00, 0),
('The Alchemist', 'Inspirational novel by Paulo Coelho', 90.00, 110, 'https://m.media-amazon.com/images/I/617lxveUjYL.jpg', 3, NOW(), NOW(), 0.00, 0),
('Beats Earbuds', 'Wireless noise-cancelling earbuds', 180.00, 75, 'https://zebronics.com/cdn/shop/products/ZEB-BUDS-30-pic11.jpg?v=1679052543&width=1200', 1, NOW(), NOW(), 0.00, 0);


-- /////////////
INSERT INTO users 
(id, name, email, password, role, created_at, updated_at)
VALUES
(1, 'nidhi', 'nidhi@mail.com', '$2b$10$l8zr/miUA0bblvTn9.2Ll.7v66Lo009LitCMQa59WHPjkOdd3kcwO', 'customer', '2025-08-24 17:59:48.27219', '2025-08-24 17:59:48.27219');
