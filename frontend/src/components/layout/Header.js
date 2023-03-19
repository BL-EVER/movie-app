import React from 'react';
import {useOidc, useOidcAccessToken} from "@axa-fr/react-oidc";
import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';



const Header = () => {
    const { login, logout, renewTokens, isAuthenticated } = useOidc();
    const { accessToken, accessTokenPayload } = useOidcAccessToken();
    React.useEffect(() => {
        if(accessToken){
            localStorage.setItem("access_token", accessToken);
        }
        else
        {
            localStorage.removeItem("access_token");
        }
    },[accessToken]);
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Movie application
                        </Typography>
                        {!isAuthenticated && (
                            <Button
                                color="inherit"
                                onClick={() => login("/")}
                            >
                                Login
                            </Button>
                        )}
                        {isAuthenticated && (
                            <Button
                                color="inherit"
                                onClick={() => logout()}
                            >
                                logout
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>


        </div>
    );
};

export default Header;