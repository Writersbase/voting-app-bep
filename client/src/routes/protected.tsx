


import React from 'react'
import { Navigate } from 'react-router-dom'
function Protected({ isSignedIn, children }: any) {
    if (!isSignedIn) {
        console.log(isSignedIn)
        return <Navigate to="/auth/login" replace />
    }
    return children
}
export default Protected

