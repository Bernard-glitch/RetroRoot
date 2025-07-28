import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./SignUp";
import Home from "./Home";
import ProtectedRoute from "./component/ProtectedRoute";
import VehiclePage from "./pages/VehiclePage";
import ElectronicsPage from "./pages/ElectronicsPage";
import ClothingsPage from "./pages/ClothingsPage";
import CollectiblesPage from "./pages/Collectibles";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/vehicles"
                    element={
                        <ProtectedRoute>
                            <VehiclePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/electronics"
                    element={
                        <ProtectedRoute>
                            <ElectronicsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/clothings"
                    element={
                        <ProtectedRoute>
                            <ClothingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/collectibles"
                    element={
                        <ProtectedRoute>
                            <CollectiblesPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
