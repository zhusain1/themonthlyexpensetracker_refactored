import React, { useRef }  from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityIconOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import CreateAccount from './CreateAccount';
import api from '../Api/Api';


export default function Login(){

    /* Show/Hide Password */
    
    const [togglePassword, setTogglePassword] = React.useState(false);

    /* Login Form Fields */
    const [email, setEmail] = React.useState("");
    
    const [password, setPassword] = React.useState("");

    const inputRef = useRef();

    /* Routing*/

    const navigate = useNavigate();

    /* User Errors */

    const [invalidUser, setInvalidUser] = React.useState(false);

    let userErrorMessage = invalidUser ? "Invalid email/password" : ""

    const handleTogglePassword = (e) => {
        e.preventDefault();
        setTogglePassword(!togglePassword); 
        inputRef.current.type = togglePassword ? "password" : "text"; 
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log('form submitted');
        loginUser();
    }

    // API reqeust 
    const loginUser = async () => {

        const request = {
            email: email,
            password: password,
        }

        try{
            const response = await api.post('/user/login', request);
            
            let { token } = response.data;

            let { path } = response.data;

            const fullPath = `/${path}`;

            setInvalidUser(false);

            console.log(userErrorMessage);
            
            // token put in session storage
            sessionStorage.setItem("token", token);
            navigate(fullPath);

        }catch (error) {
            setInvalidUser(true)
        }
    }

    let disabled = !email || !password

    let visibility =  !togglePassword ? <VisibilityIcon onClick={handleTogglePassword}/>  
    : <VisibilityIconOff onClick={handleTogglePassword}/>

    return(
        <div>
            <form onSubmit={handleLoginSubmit}>
                <TextField id="email" label="Email" variant="outlined" color="primary" type="email"
                    onChange={e => setEmail(e.target.value)}
                    error={invalidUser}
                    helperText={userErrorMessage}
                />
                <TextField id="password" label="Password" variant="outlined" color="primary" type="password" inputRef={inputRef}
                    onChange={e => setPassword(e.target.value)}
                    error={invalidUser}
                    InputProps={{
                        endAdornment: visibility
                    }}
                />
                <br/>
                <Button color="primary" disabled={disabled} type="submit">
                    Login
                </Button>
                <br/>
            </form>
            <br/>
            <CreateAccount/>
        </div>
    );
}