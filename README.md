# 🔐 React-Django JWT Cookie Auth

A full-stack authentication system using **React + Vite** on the frontend and **Django + Django REST Framework** on the backend. It securely manages user authentication using **JWTs (JSON Web Tokens)** stored in **HttpOnly cookies**, offering a safe and production-ready solution to modern Single Page Applications (SPAs).

---

## ✨ Features

✅ User Registration and Login  
✅ JWT Access and Refresh Token Issuance  
✅ JWT stored in **HttpOnly** and **Secure** cookies (not accessible via JavaScript)  
✅ CSRF Protection  
✅ Token Blacklisting on Logout  
✅ Protected API calls using Axios  
✅ Route Protection with React Router  
✅ CORS Configured for Cross-Origin Authentication  
✅ Location & Analytics APIs for user tracking

---

## 📁 Project Structure


```text
react-django-jwt-cookie-auth/
│
├── backend/                           # Django Backend
│   ├── analytics/                     # App for user analytics and extended views
│   │   ├── __init__.py                # Marks this as a Python package
│   │   ├── admin.py                   # Admin interface registration
│   │   ├── apps.py                    # App configuration
│   │   ├── models.py                  # Models (optional for analytics data)
│   │   ├── urls.py                    # URL routes specific to analytics
│   │   ├── views.py                   # Views for user analytics logic
│   │   └── tests.py                   # Unit tests for analytics
│   │
│   ├── accounts/                      # Custom user authentication app
│   │   ├── __init__.py
│   │   ├── admin.py                   # Register user model with admin
│   │   ├── apps.py
│   │   ├── models.py                  # Custom User, Country, State, City
│   │   ├── serializers.py             # DRF serializers
│   │   ├── authentication.py          # JWT Cookie Auth class
│   │   ├── views.py                   # Auth endpoints: login, register, logout
│   │   ├── urls.py                    # Auth-related routes
│   │   ├── tests.py
│   │   ├── fixtures/
│   │   │   └── countries_states_cities.json   # Static data for locations
│   │   └── management/
│   │       └── commands/
│   │           ├── __init__.py
│   │           └── export_countries.py        # Command to import location data
│   │
│   ├── backend/                       # Django project core settings
│   │   ├── __init__.py
│   │   ├── asgi.py                    # ASGI server entry
│   │   ├── settings.py                # Project settings (JWT, CORS, etc.)
│   │   ├── urls.py                    # Root URLConf
│   │   └── wsgi.py                    # WSGI server entry
│   │
│   ├── db.sqlite3                     # SQLite DB (for development)
│   ├── manage.py                      # CLI for Django project
│   ├── requirements.txt               # Python dependencies
│   └── .gitignore                     # Git ignore file for backend
│
├── frontend/                          # React Frontend (Vite + Tailwind)
│   ├── public/
│   │   └── index.html                 # Root HTML served by Vite
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── HttpClient.jsx         # Axios instance with CSRF + cookies
│   │   ├── apiCalls/
│   │   │   ├── AuthApi.jsx            # Auth APIs
│   │   │   ├── CardApis.jsx           # Dashboard/stat APIs
│   │   │   ├── GeoApi.jsx             # Geo-location APIs
│   │   │   └── User.jsx               # User-related APIs
│   │   ├── assets/                    # Static assets (icons, images)
│   │   ├── components/
│   │   │   ├── basic/
│   │   │   │   ├── CommonNavbar.jsx   # Generic navbar
│   │   │   │   ├── Navbar.jsx         # App-specific navbar
│   │   │   │   └── Title.jsx          # Title header component
│   │   │   └── card/
│   │   │       └── CountCard.jsx      # Card to show stats/counts
│   │   ├── contents/
│   │   │   └── BASE_URL.js            # API base URL config
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state provider
│   │   ├── hooks/
│   │   │   └── useDarkMode.js         # Dark mode toggle hook
│   │   ├── layout/
│   │   │   └── CommonLayout.jsx       # Layout wrapper for pages
│   │   ├── pages/                     # All routed views
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── common/
│   │   │   │   ├── About.jsx
│   │   │   │   └── Contact.jsx
│   │   │   ├── home/
│   │   │   │   └── Home.jsx
│   │   │   ├── profile/
│   │   │   │   └── Profile.jsx
│   │   │   └── user/
│   │   │       ├── TopLocations.jsx   # Shows top geo-locations
│   │   │       └── Users.jsx          # List of users
│   │   ├── routeManagement/
│   │   │   ├── ProtectedRoute.jsx     # Wrapper for protected routes
│   │   │   └── PublicRoute.jsx        # Wrapper for public-only routes
│   │   ├── App.jsx                    # Main app shell
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Global + Tailwind styles
│   │
│   ├── index.html                     # Main HTML (duplicate for root)
│   ├── .gitignore                     # Git ignore file for frontend
│   ├── eslint.config.js              # Linting rules
│   ├── package.json                  # NPM packages
│   ├── package-lock.json             # Locked package versions
│   ├── tailwind.config.js            # TailwindCSS config
│   └── vite.config.js                # Vite settings
│
├── README.md                          # Project documentation
└── .gitignore                         # Root-level Git ignore file
```


---

## ⚙️ Technologies Used

**Frontend**:
- React + Vite
- Axios with CSRF handling
- React Router DOM
- Tailwind CSS v4

**Backend**:
- Django 5.x
- Django REST Framework
- SimpleJWT for JWT management
- CORS Headers + CSRF protection

---

## 🛡️ Security Highlights

- Tokens stored in **HttpOnly, Secure cookies**
- Automatic CSRF token handling with Axios
- Refresh token rotation and blacklist mechanism
- Route-based auth protection on both frontend & backend

---

## 🚀 Setup Instructions

### 1️⃣ Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
````

### 2️⃣ Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Base URLs

* **Frontend Dev**: `http://localhost:5173`
* **Backend API**: `http://localhost:8000`

---

## 📌 Notes

* Ensure you **serve your backend with HTTPS** and proper cookie flags in production.
* Use **environment variables** to separate development and production configs.

---

## 🙌 Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b my-feature`.
3. Commit your changes: `git commit -m "Added feature"`.
4. Push to the branch: `git push origin my-feature`.
5. Open a Pull Request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🧠 Credits

Built with ❤️ by Anfique Hussain.
Inspired by best practices for full-stack authentication in modern web apps.

