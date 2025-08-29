import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import { store } from './Store'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>  
      <div className='cursor-pointer'>
        <App />
      </div>
    </Provider>
  </StrictMode>
)
