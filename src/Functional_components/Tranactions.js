import { React, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {  useNavigate } from "react-router";
import api from '../Api/Api';
import {Box, Skeleton, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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

    const [categoryBalance, setCategoryBalance] = useState("")

    const [categories, setCategories] = useState([])

    const [category, setCategory] = useState("")


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
            window.location.reload();
        }

        async function getData () {
            const request = {
                account_id: accountId
            }
            
            try{
                const response = await api.post('/plaid/account/transactions', request);
                if(typeof(response) === 'undefined'){
                    navigate('/account');
                }

                setAllTransactions(response.data.transactions)
                setTransactions(response.data.transactions)
                setAccountName(response.data.accountResponse.name)
                setAccountbalance(response.data.accountResponse.balance);

                var categoryArray = []

                response.data.transactions.forEach(
                    transaction => {
                        var category = transaction.category[transaction.category.length - 1];
                        if (!categoryArray.includes(category)) {
                            categoryArray.push(category)
                        }
                    }
                )
                setCategories(categoryArray)
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

    const handleSelectCategory = (event) => {
        setCategory(event.target.value)

        filterByCategory(event.target.value)
    };

    const filterByCategory = (category) => {

        var filteredList = allTransactions.filter(transaction => 
            transaction.category[transaction.category.length - 1] === category && 
            getMonth(transaction.date) === months.indexOf(selectedMonth) 
        )
    
        setTransactions(filteredList)

        const initial = 0

        var balance = filteredList.reduce((a, b) => a + b.amount, initial);

        setCategoryBalance(balance)

    };
    

    const getMonth = (date) => {
        const splitItems = date.split("-");
        return parseInt(splitItems[1]) - 1;
    }

    const filterByMonth = (month, index) => {

        setSelectedMonth(month)

        setCategory('')

        setCategoryBalance('')

        var filteredList = allTransactions.filter(transaction => 
            getMonth(transaction.date) === months.indexOf(month)    
        )

        //TODO: change categories based on filtered list

        var categoryArray = []

        filteredList.forEach(
            transaction => {
                var category = transaction.category[transaction.category.length - 1];
                if (!categoryArray.includes(category)) {
                    categoryArray.push(category)
                }
            }
        )
        setCategories(categoryArray)

        const initial = 0

        var spent = filteredList.filter(transaction => transaction.amount < 0).reduce((a, b) => a + b.amount, initial);

        var gained = filteredList.filter(transaction => transaction.amount >= 0).reduce((a, b) => a + b.amount, initial);

        setTransactions(filteredList);

        setIncomeSpending(spent);

        setIncomeGained(gained);
    }

    const getMonths = () => {
        var date = new Date()
        var month = date.getMonth()
        
        let currentMonths = []

        for(var i = 0; i < month + 1; i++){
            currentMonths.push( months[i] )
        }

        return(
            <div className='monthsContainer' style={{padding: '16px'}}>
                {currentMonths.map((month, index) =>
                    <Link key={index} className={"monthLink" + index} sx={{ 'paddingLeft': '12px', display: 'inline-block'}} onClick={ () => filterByMonth(months[index], index)}>
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
                <b> Current Balance: </b> { formatter.format(accountBalance)}
            </p>
            <p>
                <b> {selectedMonth} Gained: </b> { formatter.format(incomeGained)}
            </p>
            <p>
                <b> {selectedMonth} Spent: </b> { formatter.format(incomeSpending)}
            </p>
            <p>
                <b> {selectedMonth} Balance: </b> { formatter.format(incomeGained + incomeSpending)}
            </p>
            <p>
                <b> Category Balance: </b> { formatter.format(categoryBalance)}
            </p>
            <Box sx={{ minWidth: 120 }} className="select">
                <FormControl>
                    <small>
                        <b>
                            Category
                         </b>
                    </small>
                    <Select
                        labelId="category"
                        id="category"
                        value={category}
                        sx={{
                            'minWidth': '260px',
                            'height': '40px'
                        }}
                        onChange={handleSelectCategory}>
                        {categories.map((c, index) =>
                            <MenuItem value={c} key={index}>
                                { c } 
                            </MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

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