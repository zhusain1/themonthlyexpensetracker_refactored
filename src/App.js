import React, { useEffect, useState } from 'react'
import Navigationbar from './Functional_components/Navigationbar';
import MainCard from './Functional_components/MainCard'
import Header from './Functional_components/Header';
import Login from './Functional_components/Login';
import BankSetup from './Functional_components/BankSetup';
import Accounts from './Functional_components/Accounts';
import Transactions from './Functional_components/Tranactions';
import { globalTheme } from './Global/GlobalTheme';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

function App() { 

  const [allowsRoutes, setAllowRoutes] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if(sessionStorage.getItem('token') !== null){
      setAllowRoutes(true)
    }
  },[allowsRoutes, location])

  const getRoutes = () => {
    if(allowsRoutes){
      return(
        <div>
          <Navigationbar/>
          <Header/>
          <Routes>
            <Route path="/setup" element={<BankSetup />} />
            <Route path="/account" element={<Accounts />} />
            <Route path="/transaction/:accountId" element={<Transactions />} />
            <Route path="*" element={<Accounts to="/account" />} />
          </Routes>
        </div>
      );
    } else{
        return (
          <div>
            <Header/>
            <Routes>
              <Route index element={ <Login/> } />
              <Route path="*" element={<Login to="/" />} />
            </Routes>
          </div>
        )
    }
  }

  return (
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      <div className="App">
        <MainCard>
          {getRoutes()} 
        </MainCard>
      </div>
    </ThemeProvider>
  );
}

export default App;
