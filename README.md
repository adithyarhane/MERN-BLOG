# 📝 LiwotoBlogs

**LiwotoBlogs** is a modern, full-stack blogging platform built with the **MERN stack**.
It allows users to write, publish, update, and manage blogs with secure authentication, image uploads, and a clean, responsive UI.

This project is designed with **real-world production practices** including protected routes, role-based actions, cloud image storage, and proper API security.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- User registration and login
- Email verification with OTP
- Forgot & reset password flow
- Secure JWT-based authentication (cookies)
- Protected routes for authenticated users

### ✍️ Blog Management

- Create blog with cover image
- Save as draft or publish
- Edit and update blogs
- Delete blogs (author-only)
- Like and save blogs
- View own blogs & saved blogs

### 🖼 Image Upload

- Image upload using **Multer**
- Cloud storage via **Cloudinary**
- Preview image before upload
- Update cover image support

### 🎨 UI & UX

- Modern, minimal, aesthetic UI
- Fully responsive (mobile, tablet, desktop)
- Custom favicon & dynamic page titles
- Skeleton loaders and smooth transitions

### 🔒 Security & Best Practices

- Protected API routes
- Ownership checks for update/delete
- Form validation (frontend & backend)
- Clean error handling
- Loading state management

---

## 🛠 Tech Stack

### Frontend

- React
- React Router
- Context API
- Axios
- Tailwind CSS
- Lucide Icons
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

---

## 📂 Project Structure

```
liwotoblogs/
│
├── frontend/               # React frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── utils/
│   └── App.jsx
│
├── backend/               # Node + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the **server** directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

---

## ▶️ Getting Started

### 1️⃣ Clone the repository

```
git clone https://github.com/adithyarhane/liwotoBlogs.git
cd liwotoblogs
```

### 2️⃣ Install dependencies

**Backend**

```
cd backend
npm install
npm run start
```

**Frontend**

```
cd frontend
npm install
npm run dev
```

---

## 🔗 API Highlights

| Method | Route                     | Description       |
| ------ | ------------------------- | ----------------- |
| POST   | /auth/register            | Register user     |
| POST   | /auth/login               | Login user        |
| GET    | /auth/is-auth             | Check auth status |
| POST   | /blog/create-blog         | Create blog       |
| PATCH  | /blog/update-blog/:blogId | Update blog       |
| DELETE | /blog/delete-blog/:blogId | Delete blog       |
| GET    | /blog/my-blogs            | Get user blogs    |
| POST   | /blog/like/:blogId        | Like blog         |
| POST   | /blog/save/:blogId        | Save blog         |

---

## 📌 Key Learnings

- Implementing secure authentication flows
- Handling multipart FormData with images
- Managing global auth state correctly
- Building protected routes in React
- Designing scalable backend APIs
- Writing clean, meaningful commit messages

---

## 🌱 Future Improvements

- Comment system
- Rich text editor
- Admin dashboard
- Search & filter blogs
- Pagination & infinite scroll
- SEO optimizations

---

## 👨‍💻 Author

**Aditya Rhane**
Full-stack MERN Developer
Focused on building clean, scalable, real-world applications.

---

## ⭐️ If you like this project

Give it a ⭐️ on GitHub — it helps a lot!
