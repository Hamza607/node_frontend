import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Router from "./components/router/Router";

function App() {
  return (
    <>
      <Header />
      <div className="min-h-screen">

      <Router />
      </div>
      <Footer />
    </>
  );
}

export default App;
