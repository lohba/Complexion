import Footer from "./components/Footer";
import Greeter from "./components/Greeter";
import { GreeterProvider } from "./context/GreeterContext";
import { WalletProvider } from "./context/WalletContext";
import NavBar from "./components/Navbar/NavBar";
import Core from "./components/Core/Core";

function App() {
  return (
    <div className="main">
      <WalletProvider>
        <div className="container">
          <NavBar />

          <Core/>
          <Footer />
        </div>
      </WalletProvider>
    </div>
  );
}

export default App;
