 import './App.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import  HomePage from '@/pages/HomePage';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ContactPage from '@/pages/ContactPage';
import ProductPage from '@/pages/ProductPage';
import RootLayout from '@/RootLayout';
import CategoryPage from '@/pages/CategoryPage';
import AdminAddProductPage from './pages/AdminAddProductPage';
import AdminRoute from './components/AdminRoute';


const queryClient = new QueryClient();



const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    
    children: [
      {
        index: true, // This makes HomePage the default component at "/"
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage/>
      },
      {
        path: "signup",
        element: <SignupPage/>
      },
      {
        path: "contact",
        element: <ContactPage/>
      },
      {
        path: "product/:slug",
        element: <ProductPage />
      },
        {
        path: "category/:slug",
        element: <CategoryPage />
      },
      {
        element: <AdminRoute />, // This intercepts all routes inside 'children'
        children: [
          {
            path: "admin/products/add",
            element: < AdminAddProductPage />
          }
        ]
      },
      {
        path: "*",
        element: <NotFound/>
      }
    ]
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App
