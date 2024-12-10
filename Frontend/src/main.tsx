import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from './routes/root.tsx'
import ErrorPage from './error-page'
import Settings, { sendSettingsAction } from './routes/settings.tsx'
import Frontpage from './routes/frontpage.tsx'
import Login from './routes/login.tsx'
import MqttComponent from './mqtt.tsx'



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,

    children: [
      {
        index: true,
        element: <Frontpage></Frontpage>
      },
      {
        path: "asetukset/:sensorId",
        element: <Settings></Settings>,
        action: sendSettingsAction
      },
      {
        path: "kirjaudu",
        element: <Login></Login>
      },
      {
        path: "mqtt", 
        element: <MqttComponent></MqttComponent>,
      }
      

    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
