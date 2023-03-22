import React from 'react';
import { Navigate } from 'react-router-dom';
import {useOidc, useOidcAccessToken} from "@axa-fr/react-oidc";

const Protected = ({authorizationRoles, children}) => {
    const { login, isAuthenticated } = useOidc();
    const { accessToken, accessTokenPayload } = useOidcAccessToken();
    if(isAuthenticated === false) return login(window.location.pathname);
    if(authorizationRoles === []) return children;
    if(accessTokenPayload.realm_access.roles.some(r=> authorizationRoles.includes(r))) return children;
    return <Navigate to="/" />
}

export default Protected;