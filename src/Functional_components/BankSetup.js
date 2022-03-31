import { Button } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from 'react-plaid-link';
import {  useNavigate } from "react-router";
import api from '../Api/Api';

export default function BankSetup(){

  const [token, setToken] = useState('')

  const navigate = useNavigate();

  
  useEffect(() => {
      // validate token if error navigate back to index

      if(sessionStorage.getItem('token') === null){
          navigate('/')
      }

      api.post('/user/validate/token')
          .then(() => {
               // Make request to get token
              const linkTokenRequest = async () => {
                try{
                    const response = await api.post('/plaid/linkToken');
                    let { link_token } = response.data;
            
                    setToken(link_token)
            
                }catch (error) {
                  console.log(error)
                }
              }
              linkTokenRequest();
          })
          .catch(() => {
              sessionStorage.clear();
              navigate('/')
          })
  },[navigate]);

  //TODO: Implement public token exchange
  const onSuccess = useCallback((publicToken, metadata) => {
    
    const { institution } = metadata

    // Make request to get token
    const request = {
      publicToken: publicToken,
      institution: institution.name
    }

    const publicTokenRequest = async () => {
      try{
          const response = await api.post('/plaid/exchange', request);
          console.log(response.data);
          navigate('/account');
      }catch (error) {
        console.log(error)
      }
    }
    publicTokenRequest();
  },[navigate]);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return(
    <div>
      <h2> Setup Account</h2>
      <p> Please connect to a bank to setup your account.</p>
      <Button onClick={() => open()} disabled={!ready}>
        Connect to bank
      </Button>
    </div>
  );  
}