import allRouter from "../../../frontend/src/router";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './global.css'
import '@ant-design/v5-patch-for-react-19';
import { useEffect } from "react";
import rest from "../axios";
import { getLocalstorage } from "../utils/storage";

function App() {

  useEffect(() => {
    rest.get('/user/userInfo/v1', {
      data: {
        deviceId: getLocalstorage<string>('deviceId')
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err)
    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {
          allRouter.map(item =>
            (
              <Route
                key={item.path}
                path={item.path}
                element={item.component}
              />
            )
          )
        }
      </Routes>
    </BrowserRouter>
  )
}

export default App
