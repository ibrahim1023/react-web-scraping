import React, { useState } from 'react';
import axios from 'axios';
import { InputGroup, FormControl, Button, Container } from 'react-bootstrap';

import Loader from '../components/Loader';
import ProductDetails from '../components/ProductDetails';

const sortByProperty = (property) => {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
};

const HomePage = () => {
  const [input, setInput] = useState('Playstation 4 Console');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [emptyResults, setEmptyResults] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResults([]);
    setShowResults(false);
    setEmptyResults(false);

    setLoading(true);
    console.log('Input: ', input.toLowerCase());

    const { data } = await axios.get(
      `/api/results?searchTerm=${input.toLowerCase()}`
    );

    console.log('Results: ', data.result);

    if (data.result == null || data.result.length === 0) {
      setEmptyResults(true);
    } else {
      setShowResults(true);
      setResults(data.result.sort(sortByProperty('price')));
    }
    setLoading(false);
  };

  return (
    <>
      <Container>
        <InputGroup className='mb-3' style={{ padding: 50 }}>
          <FormControl
            placeholder='Search a product'
            aria-describedby='basic-addon2'
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type='submit'
            variant='outline-secondary'
            style={{ marginLeft: 10 }}
            onClick={handleSubmit}>
            Search
          </Button>
        </InputGroup>
        {loading && <Loader />}
        {
          showResults && <ProductDetails results={results} />
          // results.map((result) => (
          //   <ProductDetails result={result} key={result.link} />
          // ))
        }
        {emptyResults && (
          <h1 style={{ textAlign: 'center', marginTop: 50 }}>
            No Results found
          </h1>
        )}
      </Container>
    </>
  );
};

export default HomePage;
