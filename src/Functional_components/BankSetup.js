import { Button } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from 'react-plaid-link';
import {  useNavigate } from "react-router";
import api from '../Api/Api';

export default function BankSetup(){

  const [token, setToken] = useState('')
  const isOAuthRedirect = window.location.href.includes('?oauth_state_id=');

  const navigate = useNavigate();

  
  useEffect(() => {
      // validate token if error navigate back to index

      if(sessionStorage.getItem('token') === null){
          navigate('/')
      }

      if (isOAuthRedirect) {
        setToken(sessionStorage.getItem('link_token'));
        return;
      }

      api.post('/user/validate/token')
          .then(() => {
               // Make request to get token
              const linkTokenRequest = async () => {
                try{
                    const response = await api.post('/plaid/linkToken');
                    let { link_token } = response.data;
            
                    setToken(link_token)

                    // store link_token temporarily in case of OAuth redirect
                    sessionStorage.setItem('link_token', link_token);
            
                }catch (error) {
                  console.log(error)
                }
              }
              linkTokenRequest();
          })
          .catch(() => {
              sessionStorage.clear();
              window.location.reload();
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
          console.log('token exchange')
          console.log(response.data);
          navigate('/account');
      }catch (error) {
        console.log(error)
      }
    }
    publicTokenRequest();
  },[navigate]);


  const config = {
    // token must be the same token used for the first initialization of Link
    token,
    onSuccess,
  };


  if (isOAuthRedirect) {
    // receivedRedirectUri must include the query params
    config.receivedRedirectUri = window.location.href;
  }


  const { open, ready } = usePlaidLink(config);

  const displayButton  = () => {
    if(!isOAuthRedirect){
      return(
        <div>
          <h2> Setup Account</h2>
          <p> Please connect to a bank to setup your account.</p>
          <Button onClick={() => open()} disabled={!ready}>
            Connect to bank
          </Button>
        </div>
      );  
    } else{
      return(
        <div>
          <h2> Setup Account</h2>
          <p> Almost done, select button to finish setting up your account.</p>
          <Button onClick={() => open()} disabled={!ready}>
            Authorize accounts
          </Button>
        </div>
      );  
    }
  }


  return(
    displayButton()
  );  
}