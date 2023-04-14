


import React from 'react'
import { Navigate } from 'react-router-dom'
function PublicHidden({ isSignedIn, children }: any) {
    if (isSignedIn) {
        console.log(isSignedIn)
        return <Navigate to="/app/dashboard" replace />
    }
    return children
}
export default PublicHidden

