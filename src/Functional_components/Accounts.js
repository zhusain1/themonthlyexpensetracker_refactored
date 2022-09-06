import { React, useEffect, useState } from 'react';
import {  useNavigate } from "react-router";
import api from '../Api/Api';
import { List, ListItem, ListItemText, Link, Divider, Stack, Box, Skeleton, Typography } from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import img from '../Images/account.png'
import MainContainer from './MainContainer';


export default function Accounts() {

  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);

  const [networth, setNetWorth] = useState("");

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
            const initial = 0;
            var total = response.data.reduce((a, b) => a + b.balance, initial);
            setNetWorth(total)
          })
          .catch(() => {
              sessionStorage.clear();
              window.location.reload();
              navigate('/')
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
                    <Divider />
                    <ListItem>
                        <ListItemText>
                            {accountInfo(account)}
                        </ListItemText>
                    </ListItem>
                </div>
            )}
        </List>
      );
  }

    return (
        <div>
            <MainContainer>
            <div className="Header">
                    <img src={img}  alt="logo" width={250} 
                    style={{
                        paddingBottom: '10px',
                        paddingTop: '20px',
                        paddingLeft: '25px',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',    
                    }}/>
                    <h2
                        style={{
                            'marginBottom': '-20px'
                        }}
                    > 
                        Linked Accounts 
                    </h2>
                    <h3>
                        Net Worth: {formatter.format(networth)}
                    </h3>
                {loadingAccounts()}
            </div>
            </MainContainer>
        </div>
        
    );
}