import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import ContractListPage from "./pages/ContractListPage";
import FormContracts from "./pages/FormContracts";
import PayBill from "./pages/PayBill";
import InfoManagement from "./pages/InfoManagement";
import MyContracts from "./pages/MyContracts";
import PaymentHistory from "./pages/PaymentHistory";
import PayBillRenter from "./pages/PayBillRenter";
import ListRoom from "./pages/ListRoom";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const user = useSelector(state => state.user?.user);

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <Navigate to="/admin" /> : <HomePage />}
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/info" element={
            <ProtectedRoute>
              <InfoManagement />
            </ProtectedRoute>
          } />

          {/* Host routes */}
          <Route path="/create-listing" element={
            <ProtectedRoute allowedRoles={['host']}>
              <CreateListing />
            </ProtectedRoute>
          } />
          <Route path="/contracts" element={
            <ProtectedRoute allowedRoles={['host']}>
              <ContractListPage />
            </ProtectedRoute>
          } />
          <Route path="/edit-listing/:postId" element={
            <ProtectedRoute allowedRoles={['host']}>
              <CreateListing />
            </ProtectedRoute>
          } />
          <Route path="/paybill" element={
            <ProtectedRoute allowedRoles={['host']}>
              <PayBill />
            </ProtectedRoute>
          } />
          <Route path="/list-room" element={
            <ProtectedRoute allowedRoles={['host', 'renter']}>
              <ListRoom />
            </ProtectedRoute>
          } />

          {/* Renter routes */}
          <Route path="/my-contracts" element={
            <ProtectedRoute allowedRoles={['renter']}>
              <MyContracts />
            </ProtectedRoute>
          } />
          <Route path="/my-payments" element={
            <ProtectedRoute allowedRoles={['renter']}>
              <PaymentHistory />
            </ProtectedRoute>
          } />
          <Route path="/paybill-renter" element={
            <ProtectedRoute allowedRoles={['renter']}>
              <PayBillRenter />
            </ProtectedRoute>
          } />

          {/* Public property routes */}
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/contract-form" element={<FormContracts />} />
          <Route path="/paybill" element={<PayBill />} />
          <Route path="/info" element={<InfoManagement />} />
          <Route path="/my-contracts" element={<MyContracts />} />
          <Route path="/my-payments" element={<PaymentHistory />} />
          <Route path="/paybill-renter" element={<PayBillRenter />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
