import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home'
import List from './pages/List';
import Menu from './components/Menu';

function Routes() {
    return (
        <BrowserRouter>
            <Menu/>
            <Route path="/" Component={Home} />
            <Route path="/list" Component={List} />
        </BrowserRouter>
    )
}

export default Routes;
