import React from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';

const ProductDetails = ({ result }) => {
  return (
    <Row style={{ marginLeft: 120 }}>
      <Col md={12}>
        <ListGroup variant='flush'>
          <ListGroup.Item key={result.link}>
            <Row>
              {/* <Col md={5}>{result.title}</Col> */}
              <Col md={5}>
                <a href={result.link}>{result.title}</a>
                {/* <Link to={`${result.link}`}>{result.title}</Link> */}
              </Col>
              <Col md={2}>${result.price}</Col>
              <Col md={2}>{result.rating}</Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
};

export default ProductDetails;
