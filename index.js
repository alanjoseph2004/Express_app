const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'development.env')
});

const { Pool , Client} = require('pg');

const pool = new Pool({
    user: process.env.USER,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
});

(async () => {
    const client = await pool.connect();
    try{
        const {rows} = await client.query('SELECT current_user');
        const current_user = rows[0]['current_user']
        console.log(current_user);
    } catch(err){
        console.error(err);
    }finally{
        client.release();
    }
})();

(async () => {
    const client = await pool.connect();
    try {
        
        await client.query('CREATE DATABASE E_Commerce');
        //Chance of error here



        console.log('Databases created successfully');
    } catch (err) {
        console.error('Error creating databases:', err);
    } finally {
        client.release();
    }
})();


(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users(
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);

        console.log('Table "users" created successfully');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        client.release();
    }
})();

(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_info(
                user_id SERIAL,
                name VARCHAR(100),
                phone_number VARCHAR(15),
                address TEXT,
                pincode INT,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        `);

        console.log('Table "user_info" created successfully');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        client.release();
    }
})();


(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                product_id SERIAL PRIMARY KEY,
                product_name VARCHAR(100),
                product_desc VARCHAR(255),
                items_left INT,
                product_image VARCHAR(255),
                product_price NUMERIC(10, 2),
                rating NUMERIC(3, 1),
                category VARCHAR(50)
            )
        `);

        console.log('Table "products" created successfully');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        client.release();
    }
})();

(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS cart(
                user_id SERIAL,
                product_id SERIAL,
                quantity INT,
                user_image VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(user_id),
                FOREIGN KEY (product_id) REFERENCES products(product_id)
            )
        `);

        console.log('Table "cart" created successfully');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        client.release();
    }
})();


(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                order_id SERIAL PRIMARY KEY,
                user_id SERIAL,
                product_id SERIAL,
                product_name VARCHAR(100),
                quantity INT,
                payment_method VARCHAR(50),
                FOREIGN KEY (user_id) REFERENCES users(user_id),
                FOREIGN KEY (product_id) REFERENCES products(product_id)
            )
        `);

        console.log('Table "orders" created successfully');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        client.release();
    }
})();

(async () => {
    // Insert values into the 'users' table
    async function insertIntoUsers() {
        const client = await pool.connect();
        try {
            await client.query(`
                INSERT INTO users (username, email, password)
                VALUES
                    ('ProgJane', 'ProgJane@example.com', 'password1'),
                    ('BusinessMindMike', 'BusinessMindMike@email.com', 'password2'),
                    ('CreativeSoulSophia', 'CreativeSoulSophia@domain.com', 'password3'),
                    ('TechEnthusiast23', 'TechEnthusiast23@email.com', 'password4'),
                    ('Fashionista2024', 'Fashionista2024@domain.com', 'password5') ON CONFLICT (username) DO NOTHING
            `);
            console.log('Values inserted into "users" table successfully');
        } catch (err) {
            console.error('Error inserting values into "users" table:', err);
            if (err.code === '23505') {
                console.error('Duplicate username error:', err.detail);

            }
        } finally {
            client.release();
        }
    }

    // Insert values into the 'user_info' table
    async function insertIntoUserInfo() {
        const client = await pool.connect();
        try {
            await client.query(`




            INSERT INTO user_info (user_id, name, phone_number, address, pincode)
            VALUES
                (1, 'Jane  Doe', '+919876543210', '123, Sunshine Colony, Delhi', 110001),
                (2, 'Mike Smith', '+918765432109', '456, Lake View Apartments, Mumbai', 400001),
                (3, 'Sophia Johnson', '+917654321098', '789, Green Gardens, Bangalore', 560001),
                (4, 'John Brown ', '+916543210987', '101, River Side Villa, Kolkata', 700001),
                (5, 'Alice Mathew', '+915432109876', '202, Hill View Towers, Chennai', 600001);
            
            `);
            console.log('Values inserted into "user_info" table successfully');
        } catch (err) {
            console.error('Error inserting values into "user_info" table:', err);
        } finally {
            client.release();
        }
    }

    async function insertIntoProducts() {
        const client = await pool.connect();
        try {
            await client.query(`
                INSERT INTO products (product_name, product_desc, items_left, product_image, product_price, rating, category)
                VALUES
                    ('Midi Dress', 'One Piece Midi Dress for Women', 10, 'https://i.ibb.co/PW7jdrV/71-Fn-Jpw5-J2-L-AC-UL480-FMwebp-QL65.jpg', 1299.99, 4, 'Fashion'),
                    ('Textured Shirt', 'Casual Shirt for Men', 14, 'https://i.ibb.co/PMn6Grj/813-UIVx-LD3-L-AC-UL480-FMwebp-QL65.jpg', 299.99, 4, 'Fashion'),
                    ('Floral Shirt', 'Tropical Leaf Printed Rayon Shirt for Men', 15, 'https://i.ibb.co/0Ct9Lt5/51-Llx5f-Il-L-AC-UL480-FMwebp-QL65.jpg', 499.99, 5, 'Fashion'),
                    ('Midi Dress', 'One Piece Midi Dress for Women', 5, 'https://i.ibb.co/302V8H1/61-Zfw-Tfyum-L-AC-UL480-FMwebp-QL65.jpg', 899.99, 4, 'Fashion'),
                    ('T-Shirt', 'Men Polo T-Shirt', 30, 'https://i.ibb.co/pwsSbWH/71-CNb-Cv2f-WL-AC-UL480-FMwebp-QL65-1.jpg', 799.99, 3, 'Fashion'),
    
                    ('Smartphone', 'realme narzo N53', 17, 'https://i.ibb.co/WGLnB2z/71-DSxf-Kzk-JL-AC-UY327-FMwebp-QL65.jpg', 8299.99, 4, 'Tech'),
                    ('Smartphone', 'Redmi 13C 5G', 14, 'https://i.ibb.co/BrRTkvH/71scm-Ed-SC2-L-AC-UY327-FMwebp-QL65.jpg', 12999.99, 4, 'Tech'),
                    ('Headphones', 'boAt Rockerz 450R', 23, 'https://i.ibb.co/9gZzhWv/61-Wj-Zrbnq-ML-AC-UY327-FMwebp-QL65.jpg', 499.99, 3, 'Tech'),
                    ('Bluetooth Speaker', 'boAt Stone 650', 2, 'https://i.ibb.co/54zrJrB/71r-Y4-KQ5-Et-L-AC-UY327-FMwebp-QL65.jpg', 1399.99, 5, 'Tech'),
                    ('Laptop', 'Lenovo V15', 36, 'https://i.ibb.co/myDx440/31u-LEZHh-MDL-AC-UY327-FMwebp-QL65.jpg', 12799.99, 2, 'Tech'),
    
                    ('Dopamine Detox', 'Productive Series', 47, 'https://i.ibb.co/rMfB4nC/71-Q0-U-8lx-JS-AC-UY327-FMwebp-QL65.jpg', 299.99, 4, 'Books'),
                    ('Rich Dad Poor Dad', 'Financial Wisdom', 84, 'https://i.ibb.co/56MkzND/51-WRq3x0w-WL-AC-UY327-FMwebp-QL65.jpg', 189.99, 5, 'Books'),
                    ('My Inventions', 'AutoBiography', 77, 'https://i.ibb.co/cr36NWH/71p-GZBof-MGL-AC-UY327-FMwebp-QL65.jpg', 199.99, 4, 'Books'),
                    ('Crime and Punishment', 'Fiction', 95, 'https://i.ibb.co/VHM0MTf/81b-AXZAp-GL-AC-UY327-FMwebp-QL65.jpg', 399.99, 5, 'Books'),
                    ('Atomic Habits', 'Self Help', 66, 'https://i.ibb.co/rQvW874/81-IL8-Dy4vm-L-AC-UY327-FMwebp-QL65.jpg', 353.99, 2, 'Books'),
    
                    ('Travel Bag', 'Lino Large Duffel Bag', 17, 'https://i.ibb.co/wsM1xPw/81hr-Gd-WQKBL-AC-UL480-FMwebp-QL65.jpg', 1099.99, 4, 'Travel'),
                    ('Laptop Bag', 'Rinoto Messenger Bag', 114, 'https://i.ibb.co/wr3DQTx/712-EDugrh-HL-AC-UY327-FMwebp-QL65.jpg', 1389.99, 5, 'Travel'),
                    ('School Bag ', 'Standard Backpack', 12, 'https://i.ibb.co/Pt11CPX/71h-NHEi-If-YL-AC-UL480-FMwebp-QL65.jpg', 999.99, 4, 'Travel'),
                    ('Rucksack Bag', '75L Rucksack Bagpack', 65, 'https://i.ibb.co/6F3kpCK/91a-Z2-Hy5w-L-AC-UL480-FMwebp-QL65.jpg', 2369.99, 2, 'Travel'),
                    ('Sling Bag', '9 inch mini sling bag', 46, 'https://i.ibb.co/cJ33Whx/51xvd-W578-DL-AC-UL480-FMwebp-QL65.jpg', 559.99, 3, 'Travel'),
    
                    ('Dining Table', '4 Seater Dining Table Set', 19, 'https://i.ibb.co/F4P3Pz9/81-D4-HSNf-VZL-AC-UL480-FMwebp-QL65.jpg', 16099.99, 5, 'Furniture'),
                    ('Bookshelf', '6 Layer Wooden Bookshelf', 14, 'https://i.ibb.co/CJHqD0j/71-CSJON4-FZL-AC-UL480-FMwebp-QL65.jpg', 2589.99, 4, 'Furniture'),
                    ('Bean Bag ', '4XL Bean Bag Sofa', 52, 'https://i.ibb.co/jrcbwh4/51h-Aa-Twh-XL-AC-UL480-FMwebp-QL65.jpg', 1699.99, 3, 'Furniture'),
                    ('Hammock', 'Centre Cotton Swinging Hammock', 35, 'https://i.ibb.co/p0hZPSW/61n-Xb-Jlo-O3-L-AC-UL480-FMwebp-QL65.jpg', 1169.99, 2, 'Furniture'),
                    ('Coffee Table', 'Modern Coffee Table', 100, 'https://i.ibb.co/XtGTppb/81-On-Yp-MQab-L-AC-UL480-FMwebp-QL65.jpg', 3497.99, 3, 'Furniture')
            `);
            console.log('Values inserted into "products" table successfully');
        } catch (err) {
            console.error('Error inserting values into "products" table:', err);
        } finally {
            client.release();
        }
    }
    

    async function insertIntoCart() {
        const client = await pool.connect();
        try {
            await client.query(`
                INSERT INTO cart (user_id, product_id, quantity, user_image)
                VALUES
                    (1, 1, 2, 'https://i.ibb.co/PW7jdrV/71-Fn-Jpw5-J2-L-AC-UL480-FMwebp-QL65.jpg'),
                    (1, 3, 1, 'https://i.ibb.co/0Ct9Lt5/51-Llx5f-Il-L-AC-UL480-FMwebp-QL65.jpg'),
                    (1, 7, 3, 'https://i.ibb.co/BrRTkvH/71scm-Ed-SC2-L-AC-UY327-FMwebp-QL65.jpg'),
    
                    (2, 2, 1, 'https://i.ibb.co/PMn6Grj/813-UIVx-LD3-L-AC-UL480-FMwebp-QL65.jpg'),
                    (2, 4, 2, 'https://i.ibb.co/302V8H1/61-Zfw-Tfyum-L-AC-UL480-FMwebp-QL65.jpg'),
                    (2, 8, 1, 'https://i.ibb.co/9gZzhWv/61-Wj-Zrbnq-ML-AC-UY327-FMwebp-QL65.jpg'),
    
                    (3, 5, 1, 'https://i.ibb.co/pwsSbWH/71-CNb-Cv2f-WL-AC-UL480-FMwebp-QL65-1.jpg'),
                    (3, 9, 2, 'https://i.ibb.co/54zrJrB/71r-Y4-KQ5-Et-L-AC-UY327-FMwebp-QL65.jpg'),
                    (3, 13, 1, 'https://i.ibb.co/cr36NWH/71p-GZBof-MGL-AC-UY327-FMwebp-QL65.jpg'),
    
                    (4, 6, 3, 'https://i.ibb.co/WGLnB2z/71-DSxf-Kzk-JL-AC-UY327-FMwebp-QL65.jpg'),
                    (4, 10, 1, 'https://i.ibb.co/myDx440/31u-LEZHh-MDL-AC-UY327-FMwebp-QL65.jpg'),
                    (4, 14, 2, 'https://i.ibb.co/VHM0MTf/81b-AXZAp-GL-AC-UY327-FMwebp-QL65.jpg'),
    
                    (5, 11, 1, 'https://i.ibb.co/rMfB4nC/71-Q0-U-8lx-JS-AC-UY327-FMwebp-QL65.jpg'),
                    (5, 15, 2, 'https://i.ibb.co/rQvW874/81-IL8-Dy4vm-L-AC-UY327-FMwebp-QL65.jpg'),
                     (5, 19, 1, 'https://i.ibb.co/6F3kpCK/91a-Z2-Hy5w-L-AC-UL480-FMwebp-QL65.jpg')
            `);
    
            console.log('Values inserted into "cart" table successfully');
        } catch (err) {
            console.error('Error inserting values into "cart" table:', err);
        } finally {
            client.release();
        }
    }
    
    
    async function insertIntoOrders() {
    const client = await pool.connect();
    try {
        await client.query(`
            INSERT INTO orders (user_id, product_id, product_name, quantity, payment_method)
            VALUES
                (1, 1, 'Laptop', 2, 'Credit Card'),
                (1, 3, 'Floral Shirt', 1, 'Credit Card'),
                (1, 7, 'Smartphone', 3, 'Credit Card'),

                (2, 2, 'Textured Shirt', 1, 'PayPal'),
                (2, 4, 'Midi Dress', 2, 'PayPal'),
                (2, 8, 'Headphones', 1, 'PayPal'),

                (3, 5, 'T-Shirt', 1, 'Cash on Delivery'),
                (3, 9, 'Smartphone', 2, 'Cash on Delivery'),
                (3, 13, 'Dopamine Detox', 1, 'Cash on Delivery'),

                (4, 6, 'Smartphone', 3, 'Credit Card'),
                (4, 10, 'Laptop', 1, 'Credit Card'),
                (4, 14, 'Bookshelf', 2, 'Credit Card'),

                (5, 11, 'Travel Bag', 1, 'PayPal'),
                (5, 15, 'Dining Table', 2, 'PayPal'),
                (5, 19, 'Coffee Table', 1, 'PayPal')
        `);

        console.log('Values inserted into "orders" table successfully');
    } catch (err) {
        console.error('Error inserting values into "orders" table:', err);
    } finally {
        client.release();
    }
}

    // Call the async functions to insert values into the tables
    await insertIntoUsers();
    await insertIntoUserInfo();
    await insertIntoProducts();
    await insertIntoCart();
    await insertIntoOrders();

    // End the database connection pool
    await pool.end();
})();