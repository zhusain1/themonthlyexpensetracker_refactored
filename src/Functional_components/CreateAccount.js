import React, { useRef }  from 'react'
import TextField from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityIconOff from '@mui/icons-material/VisibilityOff';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button, Link } from '@mui/material';
import Stack from '@mui/material/Stack';
import api from '../Api/Api';
import { useNavigate } from 'react-router';

export default function CreateAccount(){

    /* Show Create Account Modal */

    const [showModal, setShowModal] = React.useState(false);

     /* Form Fields */
     const [firstName, setFirstName] = React.useState("");

     const [lastName, setLastName] = React.useState("");
     
     const [email, setEmail] = React.useState("");
     
     const [password, setPassword] = React.useState("");
 
     const [confirmPassword, setConfirmPassword] = React.useState("");

    /* Show/Hide Password */

    const [togglePassword, setTogglePassword] = React.useState(false);

    const [confirmTogglePassword, setConfirmTogglePassword] = React.useState(false);

    const passwordRef = useRef();

    const confirmPasswordRef = useRef();

    /* Routing */
    let navigate = useNavigate();

    /* User Errors */

    const [userExists, setUserExists] = React.useState(false);

    let userErrorMessage = userExists ? "Email already exists" : ""

    let passwordMatches = (password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword) ? true
    : false

    let passwordMatchesMessage = passwordMatches ? "Password does not match" : ""

    // Password Toggle
    const handleTogglePassword = (e) => {
        e.preventDefault();
        setTogglePassword(!togglePassword); 
        passwordRef.current.type = togglePassword ? "password" : "text"; 
    }

    let visibility =  !togglePassword ? <VisibilityIcon onClick={handleTogglePassword}/>  
    : <VisibilityIconOff onClick={handleTogglePassword}/>

    // Confirm Password Toggle
    const handlConfirmTogglePassword = (e) => {
        e.preventDefault();
        setConfirmTogglePassword(!confirmTogglePassword); 
        confirmPasswordRef.current.type = confirmTogglePassword ? "password" : "text"; 
    }

    let confirmVisibility =  !confirmTogglePassword ? <VisibilityIcon onClick={handlConfirmTogglePassword}/>  
    : <VisibilityIconOff onClick={handlConfirmTogglePassword}/>

    
    /* Toggle Modal */
    const openModal = () => {
        setUserExists(false)
        setShowModal(!showModal);
    }

    /*  API call */
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("form submitted");

        createUser();
    } 

    const createUser = async () => {
        const request = {
            email: email,
            firstName: firstName, 
            lastName: lastName, 
            password: password,
            confirmPassword: confirmPassword
        }

        try{
            const response = await api.post('/user/createUser', request);
            console.log(response);

            setUserExists(false);

            let { token } = response.data;
            sessionStorage.setItem("token", token);

            navigate('/setup')
        }catch (err) {
            setUserExists(true);
        }
    }

    let disabled = !firstName || !lastName || !email  || !password || !confirmPassword || passwordMatches

    return(
        <div>
            <Link onClick={openModal}> Sign Up </Link>
            <Dialog open={showModal}>
                    <div className="createDialog" style={{textAlign: 'center'}}>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                <h2> Sign Up </h2>
                                <TextField id="first_name" label="First Name" variant="outlined" color="primary" type="text"
                                    onChange={e => setFirstName(e.target.value)}
                                />
                                <TextField id="last_name" label="Last Name" variant="outlined" color="primary" type="text"
                                    onChange={e => setLastName(e.target.value)}
                                />
                                <TextField id="create_email" label="Email" variant="outlined" color="primary" type="email"
                                    onChange={e => setEmail(e.target.value)}
                                    error={userExists}
                                    helperText={userErrorMessage}
                                />
                                <TextField id="create_password" label="Password" variant="outlined" color="primary" type="password" inputRef={passwordRef} 
                                    InputProps={{
                                        endAdornment: visibility
                                    }}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <TextField id="confirm_password" label="Confirm Password" variant="outlined" color="primary" type="password" inputRef={confirmPasswordRef}
                                    InputProps={{
                                        endAdornment: confirmVisibility
                                    }}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    error={passwordMatches}
                                    helperText={passwordMatchesMessage}
                                />
                                <br/>
                                <div className='stackContainer'>
                                    <Stack direction="row" spacing={2} sx={{textAlign: 'center'}}> 
                                        <Button color="primary" disabled={disabled} type="submit"> Create </Button> 
                                        <Button className="secondary" variant="outlined" onClick={openModal}> Cancel </Button> 
                                    </Stack>
                                </div>
                                <br/>
                            </form>
                        </DialogContent>
                    </div>
                </Dialog>
        </div>

        
    );
}