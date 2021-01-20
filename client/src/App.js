import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import HomePage from './Pages/HomePage';

function App() {
  return (
    <Router>
      <main className='py-3'>
        <Container>
          <Route path='/' component={HomePage} exact />
        </Container>
      </main>
    </Router>
  );
}

export default App;
