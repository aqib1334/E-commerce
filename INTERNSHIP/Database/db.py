import sqlite3

# 1. Database connection (products.db file ban jayegi)
conn = sqlite3.connect("products.db")
cursor = conn.cursor()

# 2. Table create
cursor.execute("""
CREATE TABLE IF NOT EXISTS Products (
    ID TEXT PRIMARY KEY,
    PRODUCT_NAME TEXT NOT NULL,
    PRICE INTEGER NOT NULL,
    CATEGORY TEXT NOT NULL,
    REVIEW_PERSON TEXT NOT NULL,
    RATE INTEGER NOT NULL,
    COMMENT TEXT,
    DESCRIPTION TEXT
)
""")

# 3. Data insert
products = [
    ('p1', 'Smartphone', 50000, 'Electronics', 'Alice', 5, 'Nice', 'Latest smartphone with advanced features and long battery life.'),
    ('p2', 'Smart Watch', 30000, 'Electronics', 'Bob', 4, 'amazing product', 'Track your fitness, receive notifications, and manage calls directly from your wrist.'),
    ('p3', 'Casual T-Shirt', 3500, 'Clothing', 'Charlie', 5, 'Nice', 'Comfortable 100% cotton t-shirt for everyday wear. Available in multiple colors and sizes'),
    ('p4', 'Denim jeans', 8500, 'Clothing', 'Diana', 4, 'good', 'Classic fit denim jeans, durable and stylish for any occasion'),
    ('p5', 'Coffee Maker', 12000, 'Home & Good', 'Eve', 5, 'amazing product', 'Brew perfect coffee every morning with this easy-to-use coffee maker.'),
    # ⚠️ Yahan tum baaki p6 se p96 tak ka data same tarah list me add kar sakte ho
]

cursor.executemany("""
INSERT OR IGNORE INTO Products 
(ID, PRODUCT_NAME, PRICE, CATEGORY, REVIEW_PERSON, RATE, COMMENT, DESCRIPTION) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", products)

# 4. Save & close
conn.commit()
conn.close()

print("✅ products.db file ban gayi aur data insert ho gaya!")
