import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/home'
function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" Component={Home} />
        </BrowserRouter>
    )
}

export default Routes;
