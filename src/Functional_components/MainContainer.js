import * as React from 'react';
import Container  from '@mui/material/Container'

export default function MainContainer({children}) {
    return (
    <React.Fragment>
        <Container  maxWidth={false}
        sx={{ textAlign: 'center', backgroundColor:'#FFFFFF', 'paddingTop': '60px'}}>
                { children }
        </Container>
    </React.Fragment>
  );
}