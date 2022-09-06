import * as React from 'react';
import Box from '@mui/material/Box';
import { Paper, Typography, Grid } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';

export default function ItemWrapper({children}) {

  const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', 
  });

  const displayCategories = (categories) =>{
    return(
        <div>
            {categories.map((category, index) =>
                <span key={index}>
                    {category + ' ' + ' | ' }
                </span>
            )}
        </div>
    );
  }

  return (
    <Paper elevation={6}
        sx={{
            margin: '0 auto',
            maxWidth: '700px'
        }}
    >
        <Box
            sx={{
                minHeight: 80,
                padding: '12px',
                margin: '16px'
            }}>
                <Typography variant='h6' align="left" fontWeight="bold">
                    { children.name }
                </Typography>
                <Grid container alignItems="center">
                    <Grid>
                        <Typography variant='subtitle1' align="left" fontWeight="550" sx={{ color: '#595959'}}>
                            { formatter.format(children.amount) }
                        </Typography>
                    </Grid>
                    <Grid sx={{
                        marginLeft: 'auto'
                    }}>
                        <PaidIcon fontSize='large'/>
                    </Grid>
                </Grid> 
                <Typography variant='subtitle2' align="left" fontWeight="550" sx={{ color: '#595959'}}>
                    { children.date }
                </Typography>
                <Typography variant='subtitle2' align="left" fontWeight="550" sx={{ color: '#595959'}}>
                    { displayCategories(children.category) }
                </Typography>
        </Box>
    </Paper>
  );
}