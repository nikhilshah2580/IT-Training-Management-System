import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./components/auth/AuthInitializer";
import WhatsAppButton from "./components/common/WhatsAppButton";

const App = () => {
  return (
    <>
      <AuthInitializer />
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
      <WhatsAppButton />
    </>
  );
};

export default App;
