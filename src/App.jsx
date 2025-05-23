import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Router from "./components/router/Router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <div className="min-h-screen">
        <Router />
      </div>
      <Footer />
    </>
  );
}

export default App;
