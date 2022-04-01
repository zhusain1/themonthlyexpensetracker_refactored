import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router';
import { Button, Typography } from '@mui/material';


export default function Navigationbar() {

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
   
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleBankSetup = () => {
        setAnchorEl(null);
        navigate('/setup')
    };
    const handleAccount = () => {
        setAnchorEl(null);
        navigate('/account')
    };
    const handleInstitutions = () => {
        setAnchorEl(null);
        navigate('/institutions')
    };
    const logout = () => {
        sessionStorage.clear();
        window.location.reload();
    };

    return (
        <Box>
            <AppBar>
                <Toolbar>
                <IconButton
                    size="large"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleClick}>
                    <MenuIcon sx={{ 'fontSize': '36px'}} />
                </IconButton>
                <Menu
                    id="menu"
                    aria-labelledby="nav-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    className="navbar"
                >
                    <MenuItem onClick={handleAccount}>
                        Linked Accounts
                    </MenuItem>
                    <MenuItem onClick={handleBankSetup}>
                        Add Bank Account
                    </MenuItem>
                    <MenuItem onClick={handleInstitutions}>
                        Manage Institutions
                    </MenuItem>
                </Menu>
                <Typography sx={{ flexGrow: 1 }}>
                </Typography>
                    <Button color="secondary" onClick={logout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}