import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuctionList from "./pages/AuctionList";
import AuctionDetail from "./pages/AuctionDetail";

export default function App() {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuctionList />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
      </Routes>
    </BrowserRouter>
  );
}