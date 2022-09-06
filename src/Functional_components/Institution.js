import { React, useEffect, useState } from 'react';
import {  useNavigate } from "react-router";
import api from '../Api/Api';
import { Divider, List, Stack, Box, Skeleton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import MainCard from './MainCard';
import Header from './Header';


export default function Institution() {

  const navigate = useNavigate();

  const [institutions, setInstitutions] = useState([]);
  
  useEffect(() => {
      // validate token if error navigate back to index
      if(sessionStorage.getItem('token') === null){
          navigate('/')
      }

      setTimeout(() => {
        api.post('/user/institutions')
        .then((response) => {
          setInstitutions(response.data);
          console.log(response.data)
        })
        .catch(() => {
            sessionStorage.clear();
            window.location.reload();
        })
      }, 2000);

  },[navigate]);

  const handleClick = (id) => {
    remove(id)
  }

  const remove = async (id) => {
    try{
        const response = await api.delete(`/user/institutions/${id}`);
        setInstitutions(response.data)

        if(response.data.length === 0){
            navigate('/account');
        }
    }catch (error) {
      navigate('/account');
    }
  }

  const displayInstitutions = () =>{
        if(!institutions.length){
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
                {institutions.map((institution, index) =>
                    <div key={index}>
                        <Divider/>
                        <List>
                            <span>
                                <Stack direction="row" sx={{ display: 'inline-flex'}}>
                                    <h4> {institution.institution} </h4>        
                                    <IconButton
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => handleClick(institution.token_id)}>
                                        <Delete sx={{margin: '12px'}}/>
                                    </IconButton>
                                </Stack>
                            </span>
                        </List>
                    </div>
                )}
            </div>
          );
        }
  }

    return (
        <div>
            <MainCard>
                <Header/>
                <h2
                    style={{
                        'marginBottom': '-20px',
                        'paddingBottom': '24px'
                    }}
                > 
                    Manage Institutions
                </h2>
                { displayInstitutions() }
            </MainCard>
        </div>
        
    );
}