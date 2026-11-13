import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Header from './components/PageStructure/Header/Header'
import Play from './Pages/Authenticated/Play'
import Menu from './components/PageStructure/Menu/Menu'


function App() {
  return (
    <BrowserRouter>
      <Header title="Spotify" user={'Ayoub'} />
      <Menu />
      <Routes>
        <Route path="/Play" element={<Play />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
