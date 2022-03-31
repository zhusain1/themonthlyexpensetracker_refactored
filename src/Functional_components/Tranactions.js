import { React, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {  useNavigate } from "react-router";
import api from '../Api/Api';
import {Box, Skeleton, Link } from '@mui/material';
import ItemWrapper from './ItemWrapper';

export default function Transactions(){

    const navigate = useNavigate();

    let { accountId } = useParams();

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const [transactions, setTransactions] = useState([])

    const [allTransactions, setAllTransactions] = useState([])

    const [accountName, setAccountName] = useState("")

    const [accountBalance, setAccountbalance] = useState("")

    const [incomeSpending, setIncomeSpending] = useState("")

    const [incomeGained, setIncomeGained] = useState("")


    var date = new Date();

    const [selectedMonth, setSelectedMonth] = useState(months[date.getMonth()])

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', 
    });

    useEffect(() => {
        // get account_id, if invalid redirect 
        if(accountId === null ){
            sessionStorage.clear();
            navigate('/')
        }

        // validate token if error navigate back to index
        if(sessionStorage.getItem('token') === null){
            navigate('/')
            window.location.reload();
        }

        async function getData () {
            const request = {
                account_id: accountId
            }
            
            try{
                const response = await api.post('/plaid/account/transactions', request);
                setAllTransactions(response.data.transactions)
                setTransactions(response.data.transactions)
                setAccountName(response.data.accountResponse.name)
                setAccountbalance(response.data.accountResponse.balance);
            } catch(error){

                if(error.response.status === 400){
                    navigate('/account');
                } else{
                    sessionStorage.clear();
                    navigate('/')
                }
            }
        }
        getData();

    },[accountId]);

    const loadingTransactions = () => {
        if(!transactions.length){
            return(
              <Box textAlign={'center'}>
                  <Skeleton animation="wave" />
                  <Skeleton animation="wave" />
                  <Skeleton animation="wave" />
              </Box>
            );
        } else{
          return(
            <div>
               {transactions.map((transaction, index) =>
                <div key={index}>
                    <ItemWrapper children={transaction}/>
                </div>
                )}
            </div>
          );
        }
    }

    const getMonth = (date) => {
        const splitItems = date.split("-");
        console.log(splitItems);
        return parseInt(splitItems[1]) - 1;
    }

    const filterByMonth = (month) => {
        setSelectedMonth(month)

        setTransactions(allTransactions)

        var filteredList = allTransactions.filter(transaction => 
            getMonth(transaction.date) === months.indexOf(month)    
        )

        console.log(filteredList);

        const initial = 0

        var spent = filteredList.filter(transaction => transaction.amount < 0).reduce((a, b) => a + b.amount, initial);

        var gained = filteredList.filter(transaction => transaction.amount >= 0).reduce((a, b) => a + b.amount, initial);

        setTransactions(filteredList);

        setIncomeSpending(spent);

        setIncomeGained(gained);
    }

    const getMonths = () => {
        var date = new Date()
        var month =  date.getMonth()
        
        let currentMonths = []

        for(var i = 0; i < month + 1; i++){
            currentMonths.push( months[i] )
        }

        return(
            <div>
                {currentMonths.map((month, index) =>
                    <Link key={index} sx={{ 'paddingLeft': '12px'}} onClick={ () => filterByMonth(months[index])}>
                        {month}
                    </Link>
                )}
            </div>
        );
    }


    return(
        <div>
            <h2> {accountName} </h2>
            <p>
                <b> Balance: </b> { formatter.format(accountBalance)}
            </p>
            <p>
                <b> Total Monthly Spent: </b> { formatter.format(incomeSpending)}
            </p>
            <p>
                <b> Total Monthly Gained: </b> { formatter.format(incomeGained)}
            </p>
            <Link href={`/account`} textAlign="left"> 
                Back to accounts
            </Link>
            <br/>
            <br/>
            <small> {  getMonths() } </small>
            {loadingTransactions()}
        </div>
    );
}