import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import {Provider} from "react-redux"
import { store } from './redux/store'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthProvider>
      <Provider store={store}>

      <App />
      </Provider>
      <Toaster position='top-right' reverseOrder={false} />
    </AuthProvider>

  </BrowserRouter>

)
