import allRouter from "@/router";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './global.css'
import '@ant-design/v5-patch-for-react-19';

function App() {
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
