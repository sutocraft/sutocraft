#98691D

shafaabidautomation.bd@gmail.com

Shafa@2026



# 🔒 SutoCraft E-Commerce

## FINAL LOCKED MASTER ROADMAP

এই roadmap-টাই এখন থেকে আমাদের **master roadmap**।
একটা step **complete + tested + PASS** না হওয়া পর্যন্ত পরের step শুরু হবে না।

---

# 0. GLOBAL PROJECT RULES 🔒

* [ ] **Database/Supabase আগে, তারপর code**
* [ ] Existing working feature নষ্ট করা যাবে না
* [ ] অন্য section untouched থাকবে, dependency না থাকলে
* [ ] একসাথে একটাই feature/step
* [ ] প্রতিটি feature বাস্তবে test করতে হবে
* [ ] Test result user-এর কাছ থেকে নিতে হবে
* [ ] Result অনুযায়ী fix/update/add করতে হবে
* [ ] Fix হলে আবার retest করতে হবে
* [ ] PASS না হওয়া পর্যন্ত next step নয়
* [ ] Start → Finish পর্যন্ত complete flow test করতে হবে
* [ ] অনুমান করে কোনো feature PASS ধরা যাবে না

### 🎨 Theme Rule

**প্রতিটি নতুন feature শুরু থেকেই theme-aware হবে।**

* [ ] Hardcoded theme/primary/gold color নয়
* [ ] Theme variables ব্যবহার
* [ ] Theme-dependent background theme variable
* [ ] Theme-dependent border theme variable
* [ ] Theme-dependent button/accent/hover/focus color theme variable
* [ ] Theme color-এর light/tint/alpha variation theme system থেকে
* [ ] Neutral colors প্রয়োজন অনুযায়ী neutral থাকবে
* [ ] Feature শেষে Color/Theme Audit
* [ ] Theme change করে actual test

---

# 1. SUPABASE EXISTING DATABASE AUDIT

প্রথমে existing database পুরো check:

* [ ] `profiles`
* [x] `cart_items` working
* [ ] `orders`
* [ ] `order_items`
* [ ] `order_status_history`
* [ ] `order_notes`
* [ ] Payment tables
* [ ] Shipping tables
* [ ] Customer address
* [ ] Notifications
* [ ] Existing RLS
* [ ] Existing policies
* [ ] Triggers
* [ ] Functions
* [ ] Relationships

### Rule

`cart_items` existing working system **অকারণে change করা যাবে না**।

---

# 2. CUSTOMER AUTHENTICATION

Customer authentication শুধু customer activity-এর জন্য:

* [ ] Register
* [ ] Login
* [ ] Logout
* [ ] Session
* [ ] Forgot password
* [ ] Reset password
* [ ] Customer profile
* [ ] Phone
* [ ] Email
* [ ] Address

Customer auth ব্যবহার করবে:

* Cart
* Buy Now
* Order
* Query
* Get Quotation
* Customer Dashboard

### Admin

* [ ] Admin authentication আলাদা
* [ ] Admin workplace আলাদা
* [ ] Customer auth দিয়ে Admin Panel access নয়

---

# 3. CART SYSTEM

Existing:

* [x] `cart_items` save
* [x] Cart Drawer
* [x] Existing cart functionality

Required:

* [ ] `user_id`
* [ ] Customer phone reference/info
* [ ] Product ID
* [ ] Quantity
* [ ] Existing relationship verify

### Cart Checkout

```text
Cart
 ↓
Order successfully created
 ↓
Order Items created
 ↓
Cart Items deleted
```

### Buy Now

```text
Buy Now
 ↓
Checkout
 ↓
Order
```

Buy Now-এর জন্য unrelated cart items delete হবে না।

---

# 4. ORDER DATABASE

## Orders

* [ ] Internal ID
* [ ] Unique Order ID
* [ ] Customer ID
* [ ] Customer name snapshot
* [ ] Customer phone snapshot
* [ ] Customer email snapshot
* [ ] Shipping address snapshot
* [ ] Subtotal
* [ ] Discount
* [ ] Delivery charge
* [ ] Grand total
* [ ] Payment status
* [ ] Order status
* [ ] Estimated delivery date
* [ ] Cancel reason
* [ ] Created at
* [ ] Updated at

## Order Items

* [ ] Order ID
* [ ] Product ID
* [ ] Product name snapshot
* [ ] SKU
* [ ] Quantity
* [ ] Unit price snapshot
* [ ] Discount
* [ ] Line total

## Status History

* [ ] Order ID
* [ ] Status
* [ ] Changed by
* [ ] Date/time
* [ ] Note

## Order Notes

* [ ] Note
* [ ] Author
* [ ] Date/time

---

# 5. PAYMENT SYSTEM

## Payment Methods

* [ ] Cash on Delivery
* [ ] bKash
* [ ] Nagad
* [ ] Bank Transfer
* [ ] Future payment method ready

## Payment Status

```text
Pending
Submitted
Approved
Rejected
Refunded
```

## Payment Data

* [ ] Payment method
* [ ] Transaction ID
* [ ] Amount
* [ ] Status
* [ ] Submitted time
* [ ] Approval/rejection time
* [ ] Admin note

---

# 6. SHIPPING & DELIVERY

* [ ] Shipping address
* [ ] Shipping zone
* [ ] Shipping method
* [ ] Delivery charge
* [ ] Free delivery rule
* [ ] Estimated delivery date
* [ ] Delivery status

---

# 7. CHECKOUT

দুই entry point:

```text
Cart Drawer
    ↓
Checkout

Buy Now
    ↓
Checkout
```

### Logged Out

```text
Cart / Buy Now
      ↓
Login/Register
      ↓
Original intent preserved
      ↓
Checkout
```

### Logged In

```text
Cart / Buy Now
      ↓
Checkout
```

---

# 8. CHECKOUT PAGE

* [ ] Customer information
* [ ] Shipping address
* [ ] Product list
* [ ] Quantity
* [ ] Subtotal
* [ ] Discount
* [ ] Delivery charge
* [ ] Grand total
* [ ] Estimated delivery
* [ ] Payment method
* [ ] Payment instruction
* [ ] Transaction ID
* [ ] Place Order

---

# 9. PLACE ORDER ENGINE

```text
Checkout
 ↓
Customer validation
 ↓
Product validation
 ↓
Price validation
 ↓
Stock validation
 ↓
Calculate total
 ↓
Create Order
 ↓
Create Order Items
 ↓
Create Payment
 ↓
Create Status History
 ↓
Cart checkout হলে Cart Items delete
 ↓
Order Success
```

### Important

* [ ] Atomic/transaction-safe
* [ ] Duplicate order prevention
* [ ] Server-side total validation
* [ ] Price snapshot
* [ ] Cart cleanup
* [ ] Unique Order ID

---

# 10. STOCK

* [ ] Stock validation
* [ ] Stock reservation/deduction
* [ ] Overselling prevention
* [ ] Cancellation হলে stock release
* [ ] Payment rejection handling

---

# 11. ORDER STATUS

### Normal

```text
Order Placed
 ↓
Payment Submitted
 ↓
Payment Approved
 ↓
Confirmed
 ↓
Processing
 ↓
Shipped
 ↓
Delivered
```

### Cancellation

```text
Order
 ↓
Cancelled
 ↓
Cancellation Reason
```

**Payment Status এবং Order Status আলাদা থাকবে।**

---

# 12. CUSTOMER PANEL

## My Orders

* [ ] Order list
* [ ] Order ID
* [ ] Date
* [ ] Total
* [ ] Payment status
* [ ] Order status

## Order Details

* [ ] Products
* [ ] Quantity
* [ ] Price
* [ ] Shipping address
* [ ] Payment method
* [ ] Transaction ID
* [ ] Estimated delivery
* [ ] Current status
* [ ] Status timeline
* [ ] Cancel reason
* [ ] Invoice

---

# 13. ADMIN ORDER PANEL

## Admin View

* [ ] All orders
* [ ] Customer
* [ ] Phone
* [ ] Email
* [ ] Products
* [ ] Quantity
* [ ] Total
* [ ] Payment method
* [ ] Transaction ID
* [ ] Payment status
* [ ] Shipping address
* [ ] Estimated delivery
* [ ] Order status

## Admin Actions

* [ ] Approve payment
* [ ] Reject payment
* [ ] Confirm order
* [ ] Processing
* [ ] Shipped
* [ ] Delivered
* [ ] Cancel
* [ ] Cancellation reason
* [ ] Update estimated delivery
* [ ] Add order note

---

# 14. CANCELLATION

* [ ] Customer cancellation where allowed
* [ ] Admin cancellation
* [ ] Required cancellation reason
* [ ] Cancelled by
* [ ] Cancellation date/time
* [ ] Customer Panel status
* [ ] Admin Panel status
* [ ] Stock release

---

# 15. INVOICE

* [ ] Invoice ID
* [ ] Order ID
* [ ] Company information
* [ ] Customer information
* [ ] Products
* [ ] Quantity
* [ ] Unit price
* [ ] Subtotal
* [ ] Discount
* [ ] Delivery charge
* [ ] Grand total
* [ ] Payment method
* [ ] Payment status
* [ ] Invoice date

### Customer

* [ ] View
* [ ] Print
* [ ] Download

### Admin

* [ ] View
* [ ] Print
* [ ] Download

---

# 16. WHATSAPP

## Customer → Admin

* [ ] New order notification
* [ ] Order ID
* [ ] Customer
* [ ] Phone
* [ ] Products
* [ ] Total
* [ ] Payment method
* [ ] TXN ID

## Admin → Customer

* [ ] Order confirmation
* [ ] Payment approved
* [ ] Payment rejected
* [ ] Processing
* [ ] Shipped
* [ ] Delivered
* [ ] Cancelled
* [ ] Cancel reason
* [ ] Delivery update

---

# 17. DISCOUNT / COUPON READY

* [ ] Coupon structure
* [ ] Discount type
* [ ] Discount amount
* [ ] Coupon validation
* [ ] Order discount snapshot

---

# 18. REFUND READY

* [ ] Refund status
* [ ] Refund amount
* [ ] Refund reason
* [ ] Refund date
* [ ] Refund transaction reference

---

# 19. SECURITY

### Customer

* [ ] Own cart only
* [ ] Own order only
* [ ] Own invoice only
* [ ] Own information only
* [ ] Cannot approve payment
* [ ] Cannot access Admin Panel
* [ ] Cannot manipulate total

### Admin

* [ ] Admin-only order management
* [ ] Payment approval protected
* [ ] Status management protected
* [ ] Customer information access

### Supabase

* [ ] RLS
* [ ] Policies
* [ ] Foreign keys
* [ ] Server-side validation

---

# 20. REAL USER TESTING

## Test 1: Logged Out Add to Cart

আমি বলব:

> Login করবেন না → Product খুলুন → Add to Cart দিন → Result বলুন।

তারপর result অনুযায়ী fix/retest।

---

## Test 2: Logged Out Buy Now

> Login ছাড়া Buy Now দিন → কোথায় গেলেন বলুন।

---

## Test 3: Register

> Register করুন → Result বলুন।

Check:

* Account
* Profile
* Phone
* Email
* Session

---

## Test 4: Login

> Logout → Login করুন → Result বলুন।

---

## Test 5: Logged-in Add to Cart

> Product → Add to Cart → Cart Drawer check করুন।

---

## Test 6: Logged-in Buy Now

> Buy Now দিন → Product/quantity/price check করুন।

---

## Test 7: Cart → Checkout

> Cart খুলুন → Checkout দিন।

Check:

* Customer
* Address
* Product
* Quantity
* Subtotal
* Delivery
* Total
* Estimated delivery
* Payment

---

## Test 8: Place Order

> Payment information দিন → Place Order করুন।

তারপর Supabase check:

* `orders`
* `order_items`
* `payments`
* `transactions`
* `order_status_history`
* `cart_items`

---

## Test 9: Cart Cleanup

> Order successful হওয়ার পরে Cart Drawer খুলুন।

Expected:

**Ordered items আর থাকবে না।**

---

## Test 10: Admin Order

> Admin Panel → Orders → নতুন order খুলুন।

Check:

* Customer
* Phone
* Products
* Total
* Payment
* TXN ID

---

## Test 11: Payment Approval

> Admin → Payment verify → Approve করুন।

তারপর Customer Panel check।

---

## Test 12: Order Status

এক এক করে বাস্তবে test:

```text
Confirmed
 ↓
Processing
 ↓
Shipped
 ↓
Delivered
```

প্রতিটি status-এর result দিতে হবে।

---

## Test 13: Cancellation

> Test order cancel করুন → reason দিন।

Check:

* Admin
* Customer
* Status
* Reason
* Stock

---

## Test 14: Invoice

> Customer Panel → Order → Invoice খুলুন।

Check:

* Order ID
* Customer
* Products
* Price
* Total
* Payment
* Date

তারপর Print/Download test।

---

## Test 15: WhatsApp

প্রতিটি গুরুত্বপূর্ণ event-এর message বাস্তবে check:

* New Order
* Payment Approved
* Payment Rejected
* Processing
* Shipped
* Delivered
* Cancelled

---

## Test 16: Security

* Customer A → Customer B-এর order দেখতে পারবে না
* অন্য customer's invoice access করতে পারবে না
* Payment approve করতে পারবে না
* Admin Panel access করতে পারবে না
* Direct URL দিয়েও unauthorized data পাওয়া যাবে না

---

## Test 17: Responsive

* [ ] Desktop
* [ ] Tablet
* [ ] Mobile
* [ ] Cart
* [ ] Checkout
* [ ] Customer Panel
* [ ] Admin Panel
* [ ] Invoice

---

# 21. EVERY NEW FEATURE TEST RULE

Checkout-এর পরেও **প্রতিটি নতুন feature-এর জন্য একই নিয়ম**:

```text
Feature Start
     ↓
Existing Code Check
     ↓
Database Check
     ↓
Implement
     ↓
Theme Audit
     ↓
Responsive Check
     ↓
User Test
     ↓
User Result
     ↓
Fix
     ↓
Retest
     ↓
PASS
     ↓
Next Feature
```

---

# 🔒 FINAL LOCK

**SutoCraft-এর জন্য এখন এই rules + roadmap final এবং locked।**

### আমরা কখনো:

❌ এক feature শেষ না করে অন্য feature-এ যাব না
❌ test ছাড়া DONE বলব না
❌ existing working section অকারণে touch করব না
❌ theme color hardcode করে নতুন feature বানাব না
❌ database না বুঝে Checkout code শুরু করব না
❌ user test result ছাড়া আন্দাজ করে fix করব না

### আমরা করব:

**Supabase → Database → Security → Code → Theme Audit → User Test → Result → Fix → Retest → PASS → Next**

এবং **শেষ পর্যন্ত Start-to-Finish পুরো Customer ↔ Admin flow বাস্তবে test করে তারপরই final DONE** ধরা হবে। 🔒
