import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { RootLayout } from "./components/layout/root-layout";
import { AuthProvider } from "./components/providers/auth-provider";
import { Login } from "./components/auth/login";
import { Signup } from "./components/auth/signup";
import { ResetPassword } from "./components/auth/reset-password";
import { UpdatePassword } from "./components/auth/update-password";
import { NotFound } from "./components/not-found";
import { AdminRoute } from "./components/auth/admin-route";
import { AdminDashboard } from "./components/admin/dashboard";

const ListingsPage = lazy(() => import("./components/listings"));
const ListingDetailsPage = lazy(
  () => import("./components/listings/listing-details-page"),
);

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }
      >
        <RootLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailsPage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && routes && useRoutes(routes)}
        </RootLayout>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
