import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Drinks from './Drinks';
import Home from './Home';
import Students from './Students';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path='/students'
                    element={<Students />}
                />
                <Route
                    path='/drinks'
                    element={<Drinks />}
                />
                <Route
                    path='/'
                    element={<Home />}
                />
            </Routes>
        </BrowserRouter>
    );
}