import * as React from 'react';
import Card from '@mui/material/Card';
import Container  from '@mui/material/Container'

export default function MainCard({children}) {
    return (
    <React.Fragment>
        <Container maxWidth="sm" 
        sx={{ textAlign: 'center' }}>
            <Card variant="outlined"
                sx={{ 
                    boxShadow: 2,
                    marginTop: '60px',
                    paddingTop: '25px',
                    paddingBottom: '20px'
                }}
            >
                { children }
            </Card>
        </Container>
    </React.Fragment>
  );
}