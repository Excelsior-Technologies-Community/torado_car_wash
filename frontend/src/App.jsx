import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from './common/Header'
import Homepage from './pages/Homepage'


function App() {

  return (
    <>

      <BrowserRouter>
        <Header />

        <Routes>

        <Route element={<Homepage />} path='/'/>


        </Routes>


      </BrowserRouter>

    </>
  )
}

export default App
