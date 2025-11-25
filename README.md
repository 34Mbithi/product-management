# **Product Management Dashboard**

A simple product management dashboard built with Vue 3, Vite, Pinia, and Vue Router.

**This project lets users:**

View a list of products

Create (add) new products

View detailed product information

Delete products

Manage authentication (basic mock auth)

Product listing with search


The UI is styled with TailwindCSS, and all product data is handled through a small API service wrapper.


 **Features**
 
 
 **Authentication**

Login using DummyJSON API

Token stored in Pinia + persisted using localStorage

Route protection (unauthenticated users cannot access product pages)


**Product Management**

Fetch all products

Search products by title

Optional category filtering

Product detail page

Add new product

Delete product (with confirmation modal)


**UI/UX**

TailwindCSS styling

Responsive, clean layout

Accent color: #000080

Hover states, spacing, rounded corners



# **Tech Stack**
| Technology                  | Purpose                   |
| --------------------------- | ------------------------- |
| Vue 3 (Composition API) | Frontend framework        |
| Vite                    | Development & build tool  |
| Pinia                   | State management          |
| Vue Router              | Navigation & route guards |
| TailwindCSS             | Styling                   |
| Axios                   | API calls                 |
| DummyJSON API           | Auth & product data       |


**Deliverable project Structure**

src/

├── assets/

├── components/

├── pages/

│   ├── Login.vue

│   ├── ProductsList.vue

│   ├── ProductNew.vue

│   └── ProductView.vue

├── router/

│   └── index.js

├── services/

│   └── api.js

├── stores/

│   ├── auth.js

│   ├── categories.js

│   └── products.js

├── App.vue

├── main.js

└── style.css



**⚙️ Setup & Installation**

Follow these steps to run the project locally.


1. **Clone the repository**

```bash
git clone <https://github.com/34Mbithi/product-management.git>
cd product-management
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

Vite will start a local server, usually at:


👉 http://localhost:5173

4. **Optional: Build for production**

```bash
npm run build
```

5. **Preview production build**

```bash
npm run preview
```

**🔧 Environment Variables / Configuration**

Currently, the project works without a .env file. but the API service (src/services/api.js) is structured to easily support environment-based URLs.

Used in src/services/api.js:

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://dummyjson.com",
}); 


***Routing Overview**
| Route           | Page             | Description            |
| --------------- | ---------------- | ---------------------- |
| `/login`        | Login.vue        | User authentication    |
| `/products`     | ProductsList.vue | Product table + search |
| `/products/new` | ProductNew.vue   | Add a new product      |
| `/products/:id` | ProductView.vue  | Product detail view    |


***Route guards ensure:**

Unauthenticated users → redirected to /login

Authenticated users cannot return to /login


***API Endpoints**

All endpoints use DummyJSON.

***🔐 Auth**

| Action | Method | Endpoint      |
| ------ | ------ | ------------- |
| Login  | POST   | `/auth/login` |

***🛒 Products**

| Action            | Method | Endpoint        |
| ----------------- | ------ | --------------- |
| Get all products  | GET    | `/products`     |
| Get product by ID | GET    | `/products/:id` |
| Add product       | POST   | `/products/add` |
| Delete product    | DELETE | `/products/:id` |



**How the Project Works**

***Routing**

All application routes are configured in:

src/router/index.js



***Application Routes include**

| Route           | Purpose                               |
| --------------- | ------------------------------------- |
| `/login`        | User authentication page              |
| `/products`     | Product listing with search & filters |
| `/products/new` | Add new product form                  |
| `/products/:id` | View full product details             |



***State Management (Pinia)**

The project uses Pinia for centralized state management.

Each store handles a specific part of the app logic and data.

***stores/products.js***
Responsible for all product-related operations, including:

Fetching all products

Fetching a product by ID

Creating (adding) a new product

Deleting a product

Managing loading & error states

Merging API products with locally stored products


***stores/auth.js***

Handles user authentication and session state.

Includes:

Logging in

Storing token & user data

Restoring session on page reload

Logging out

Adding the token to axios requests

***stores/categories.js***

A lightweight store that manages the list of product categories.
Includes:

Fetching categories from the API

Loading/error handling


**Key Project Assumptions**

***Architecture Assumptions***
✔ This is a frontend-only project. No real backend required.
✔ Only necessary endpoints from DummyJSON are used.
✔ Authentication is minimal (mock-based or local).
✔ Reviews in ProductView.vue use mock data (can later be replaced by backend).
✔ TailwindCSS is used for styling components quickly.
✔ The project does not include user roles or permissions.



***Authentication Assumptions***

The DummyJSON /auth/login endpoint is used for authentication.

Token and user data are stored in localStorage for persistence.

Token is attached via axios headers:

```bash
api.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

No session expiration or refresh tokens are included (API limitation).

No role-based permissions.

***Product Data Assumptions***

DummyJSON does not persist add/delete actions — therefore:

    ✔Newly created products are stored locally in the Pinia store.
    ✔localStorage is used to maintain product state across page reloads.

Product merging logic combines:

API products + locally created products

***UI & UX Assumptions***
TailwindCSS is used for all styling.

Primary accent color: #000080.

Layout closely follows provided mockups.

Product reviews displayed in ProductView.vue are mock data placeholders.


*** Features Added**

This project successfully delivers all major requirements from the technical test.

| Feature                                 | Status                               |
| --------------------------------------- | ------------------------------------ |
| User login & token handling             | ✔                                    |
| Protected routes                        | ✔                                    |
| Persisted authentication (localStorage) | ✔                                    |
| Product listing                         | ✔                                    |
| Product search                          | ✔                                    |
| Product filtering (categories)          | ✔                                    |
| Add product                             | ✔ (local persistence)                |
| View product details                    | ✔                                    |
| Delete product                          | ✔ (local + API attempt)              |
| Loading states                          | ✔                                    |
| Error handling                          | ✔                                    |
| Mock reviews                            | ✔                                    |
| Responsive design                       | ✔                                    |
| Update product                          | ❌ (not required, can be added later) |
| Real backend persistence                | ❌ (DummyJSON limitation)             |




🛠 ***Troubleshooting**
If you face errors during npm install:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```


***Vite development server not starting**

```bash
npm cache clean --force
```

***Tailwind or hot reload not updating***

```bash
npm run dev
```
 ***License**
 
This project is open for personal or educational use. You may modify it freely.

***Contributing**

Contributions are welcome!
Feel free to submit pull requests or request new features.
