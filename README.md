📦 Product Management Dashboard

A simple product management dashboard built with Vue 3, Vite, Pinia, and Vue Router.

This project lets users:

View a list of products

Create (add) new products

View detailed product information

Delete products

Manage authentication (basic mock auth)

The UI is styled with TailwindCSS, and all product data is handled through a small API service wrapper.

🚀 Tech Stack
Technology	Purpose
Vue 3 (Composition API)	Frontend framework
Vite	Fast development build tool
Pinia	State management
Vue Router	Page routing
TailwindCSS	Styling
Axios	API calls

⚙️ Setup & Installation

Follow these steps to run the project locally.

1. Clone the repository
git clone <your-repository-url>
cd product-management

2. Install dependencies
npm install

3. Start development server
npm run dev


Vite will start a local server, usually at:

👉 http://localhost:5173

4. Optional: Build for production
npm run build

5. Preview production build
npm run preview

🔧 Environment Variables / Configuration

Currently, the project uses no .env file, but the API service (src/services/api.js) is structured to easily support environment-based URLs.

If needed, create .env and add:

VITE_API_URL=https://your-api-url.com


Then inside api.js:

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://dummyjson.com",
});

🏗️ How the Project Works
Routing

All pages are registered in:

src/router/index.js

Includes:

/login

/products

/products/new

/products/:id

State Management (Pinia)

Main stores:

stores/products.js

Handles:

Fetching all products

Fetching one product

Creating a product

Deleting a product

stores/auth.js

Very basic mock authentication using local state.

stores/categories.js

Simple list of product categories.

📚 Key Project Assumptions

✔ This is a frontend-only project. No real backend required.
✔ Product data comes from an API wrapper (services/api.js).
✔ Authentication is minimal (mock-based or local).
✔ Reviews in ProductView.vue use mock data (can later be replaced by backend).
✔ TailwindCSS is used for styling components quickly.
✔ The project does not include user roles or permissions.

💡 Features Added
✔ Product listing
✔ Product creation
✔ Product detail page
✔ Product deletion with confirmation modal
✔ Loading state (spinner)
✔ Customer reviews (mock)
✔ Responsive layout
🛠️ Running Into Issues?

If you face errors during npm install:

rm -rf node_modules
rm package-lock.json
npm install


If Vite won't start, try:

npm cache clean --force

📜 License

This project is open for personal or educational use. You may modify it freely.

🙌 Contributing

Feel free to submit pull requests or request new features.