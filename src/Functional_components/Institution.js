import { React, useEffect, useState } from 'react';
import {  useNavigate } from "react-router";
import api from '../Api/Api';
import { Divider, List, Stack } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';


export default function Institution() {

  const navigate = useNavigate();

  const [institutions, setInstitutions] = useState([]);
  
  useEffect(() => {
      // validate token if error navigate back to index
      if(sessionStorage.getItem('token') === null){
          navigate('/')
      }

      api.post('/user/institutions')
          .then((response) => {
            setInstitutions(response.data);
            console.log(response.data)
          })
          .catch(() => {
              sessionStorage.clear();
              window.location.reload();
          })
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
    return(
            <div>
                {institutions.map((institution, index) =>
                    <div key={index}>
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
                        <Divider/>
                    </div>
                )}
            </div>
    );
  }

    return (
        <div>
            <h2
                style={{
                    'marginBottom': '-20px',
                    'paddingBottom': '24px'
                }}
            > 
                Manage Institutions
            </h2>
            <Divider/>
            { displayInstitutions() }
        </div>
        
    );
}