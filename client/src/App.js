
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
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
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/contracts" element={<ContractListPage />} />
          <Route path="/contract-form" element={<FormContracts />} />
          <Route path="/paybill" element={<PayBill />} />
          <Route path="/info" element={<InfoManagement />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
