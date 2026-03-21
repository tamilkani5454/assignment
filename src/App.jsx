import Login from './pages/login/Login'
import Products from './pages/products/Products'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import ProtectedLayout from './components/ProtectedLayout';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path='/products' element={<Products />} />
        </Route>
      </Routes>

      <Toaster position="top-center" />
    </>
  )
}

export default App