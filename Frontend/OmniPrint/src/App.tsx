import './App.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import HomePage from '@/pages/HomePage';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ContactPage from '@/pages/ContactPage';
import ProductPage from '@/pages/ProductPage';
import RootLayout from '@/RootLayout';
import CategoryPage from '@/pages/CategoryPage';
import AdminAddProductPage from '@/pages/AdminAddProductPage';
import AdminRoute from '@/components/AdminRoute';
import AdminProductsListPage from '@/pages/AdminProductsListPage';
import AdminEditProductPage from '@/pages/AdminEditProductPage';
import VendorRoute from '@/components/VendorRoute';
import VendorDashboardPage from '@/pages/VendorDashboardPage';
import VendorOnboardingPage from '@/pages/VendorOnboardingPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import CheckoutPage from '@/pages/CheckoutPage';
import VendorAddProductPage from '@/pages/VendorAddProductPage';
import VendorEditProductPage from '@/pages/VendorEditProductPage';
import ClientOrdersPage from './pages/ClientOrdersPage';

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
        element: <LoginPage />
      },
      {
        path: "signup",
        element: <SignupPage />
      },
      {
        path: "contact",
        element: <ContactPage />
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
            path: "admin/products",
            element: <AdminProductsListPage />
          },
          {
            path: "admin/products/add",
            element: < AdminAddProductPage />
          },
          {
            path: "admin/products/edit/:id", // <-- NEW ROUTE
            element: <AdminEditProductPage />
          }
        ]
      },
      {
        element: <VendorRoute />, // This intercepts all routes inside 'children'
        children: [
          {
            path: "vendor/onboarding",
            element: <VendorOnboardingPage />
          },
          {
            path: "vendor/dashboard",
            element: <VendorDashboardPage />
          },
          {
            path: "vendor/catalog/add",
            element: <VendorAddProductPage />
          },
          {
            path: "vendor/catalog/edit/:productId", // <-- NEW ROUTE
            element: <VendorEditProductPage />
          },
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "checkout",
            element: <CheckoutPage />
          },
          {
            path: "orders", // <-- NEW ROUTE
            element: <ClientOrdersPage />
          }
        ]
      },

      {
        path: "*",
        element: <NotFound />
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
