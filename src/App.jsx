import { BrowserRouter } from "react-router-dom"
import Index from "./common/routes/Index"
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { ContextProvider } from "./common/helper/Context";

function App() {

  return (
    <>
      <PrimeReactProvider>
        {/* <BrowserRouter>
          <ContextProvider>
            <Index />
          </ContextProvider>
        </BrowserRouter> */}
        <BrowserRouter basename="/admin">
          <ContextProvider>
            <Index />
          </ContextProvider>
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  )
}

export default App