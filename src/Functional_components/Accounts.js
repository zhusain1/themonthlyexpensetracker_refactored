import { React, useEffect, useState } from 'react';
import {  useNavigate } from "react-router";
import api from '../Api/Api';
import { List, ListItem, ListItemText, Link, Divider, Stack, Box, Skeleton, Typography } from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';


export default function Accounts() {

  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', 
  }); 
  
  useEffect(() => {
      // validate token if error navigate back to index
      if(sessionStorage.getItem('token') === null){
          navigate('/')
      }

      api.post('/plaid/account/balances')
          .then((response) => {
            setAccounts(response.data);
          })
          .catch(() => {
              sessionStorage.clear();
              navigate('/')
              window.location.reload();
          })
  },[navigate]);

  const accountInfo = (account) => {
      return (
        <div>
            <Link href={`/transaction/${account.accountId}`}> 
                <div>
                    <Stack direction="row">
                        <AccountBalanceOutlinedIcon sx={{margin: '20px'}}/>
                        <h4> {account.name} </h4>    
                    </Stack>
                </div>
            </Link>
            <div style={{
                marginLeft: '20px',
            }}>
                <Typography variant='subtitle1' align="left" fontWeight="550" sx={{ color: '#595959'}}>
                    {formatter.format(account.balance)} 
                </Typography>
                <Typography variant='subtitle1' align="left" fontWeight="550" sx={{ color: '#595959'}}>
                    {account.type}
                </Typography>
            </div>
        </div>
      );
  }

  const loadingAccounts = () => {
      if(!accounts.length){
          return(
            <Box textAlign={'center'}>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
            </Box>
          );
      } else{
        return displayAccounts();
      }
  }

  const displayAccounts = () => {
      return(
        <List aria-label="accounts">
            {accounts.map((account) =>
                <div key={account.accountId}>
                    <ListItem>
                        <ListItemText>
                            {accountInfo(account)}
                        </ListItemText>
                    </ListItem>
                    <Divider />
                </div>
            )}
        </List>
      );
  }

    return (
        <div>
            <h2
                style={{
                    'marginBottom': '-20px'
                }}
            > 
                Linked Accounts 
            </h2>
            {loadingAccounts()}
        </div>
        
    );
}