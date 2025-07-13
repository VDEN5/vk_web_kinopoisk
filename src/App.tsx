import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppRoute } from './const';
import { LoginForm } from './pages/login-form';
import { MoviesList } from './pages/movies-list';
import { MoviesList1 } from './pages/movies-list1';
import { AuthProvider } from './components/auth-context';
import { PrivateRoute } from './components/private-route';
import { Movie } from './pages/movie';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path={AppRoute.Login} element={<LoginForm />} />
                    <Route path={AppRoute.Root} element={<MoviesList />} />
                    <Route path={AppRoute.Favorite} element={<MoviesList1 />} />
                    <Route path={AppRoute.Movie} element={<Movie />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
