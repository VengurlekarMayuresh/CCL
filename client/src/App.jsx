import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/admin-layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/shopping-layout";
import PageNotFound from "./pages/not-found/PageNotFound";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckoutPage from "./pages/shopping-view/checkoutpage";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListings from "./pages/shopping-view/listings";
import CheckAuth from "./components/common/check-auth";
import UnAuthPage from "./pages/un-auth-page/UnAuthPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "@/store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PayPalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchPage from "./pages/shopping-view/search";
import PaypalPayment from "./pages/shopping-view/paypal-payment";
import { Toaster } from "sonner";
import { FirebaseAuthProvider } from "@/components/common/FirebaseAuthProvider";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="h-[100vh] bg-black w-[600px]" />;
  return (
    
    <div className="flex flex-col overflow-hidden bg-white">
      <Toaster richColors/>
      <FirebaseAuthProvider>
        <Routes>
          <Route path="/" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><ShoppingLayout/></CheckAuth>}/>
        </Routes>
        {/*Auth Routes */}
        <Routes>
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          {/*Admin Routes */}
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          {/*Shopping Routes */}
          <Route
            path="/shop"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="checkout" element={<ShoppingCheckoutPage />} />
            <Route path="listings" element={<ShoppingListings />} />
            <Route path="paypal-return" element={<PayPalReturnPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchPage/>}/>
            <Route path="paypal-payment" element={<PaypalPayment />} />
          </Route>

          {/*Page Note Found */}
          <Route path="/unAuthPage" element={<UnAuthPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </FirebaseAuthProvider>
    </div>
  );
}

export default App;
