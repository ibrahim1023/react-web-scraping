import React from 'react';
import { Table } from 'react-bootstrap';

import Rating from './Rating';

const ProductDetails = ({ results }) => {
  const calculateDiscount = (price, originalPrice) => {
    var discount;
    if (originalPrice !== '') {
      discount = Math.round((1 - price / originalPrice) * 100);
      return discount + '%';
    }
    return '';
  };

  return (
    <>
      {/* <Row style={{ marginLeft: 120 }}>
        <Col md={12}>
          <ListGroup variant='flush'>
            <ListGroup.Item key={result.link}>
              <Row>
                <Col md={5}>
                  <a href={result.link}>{result.title}</a>
                </Col>
                <Col md={2}>${result.price}</Col>
                <Col md={2}>
                  {calculateDiscount(result.price, result.original_price)}
                </Col>
                <Col md={2}>{result.rating}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row> */}
      <Table striped hover bordered responsive className='table-sm'>
        <thead>
          <tr>
            <th>TITLE</th>
            <th>PRICE</th>
            <th>DISCOUNT</th>
            <th>RATING</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.link}>
              <td>
                <a href={result.link}>{result.title}</a>
              </td>
              <td>${result.price}</td>
              <td style={{ textAlign: 'center' }}>
                {calculateDiscount(result.price, result.original_price)}
              </td>
              <td style={{ textAlign: 'center' }} width='110'>
                <Rating value={Number(result.rating.substr(0, 3))} />
              </td>
              {/* <td>
                <LinkContainer to={result.link}>
                  <Button variant='light' className='btn-sm'>
                    <i className='fas fa-edit'></i>
                  </Button>
                </LinkContainer>
              </td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductDetails;
