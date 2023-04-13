import React, { createContext, useState } from 'react'

interface IBaseProvider {
   useAuth: any;
   events: any;
   useLoader: any;
}
export const BaseProvider = createContext<IBaseProvider>({useAuth: null,events: null,useLoader: null});

