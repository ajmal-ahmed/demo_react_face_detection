import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Layout = (props) => {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h1 className="display-4">Sample App</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    {props.children}
                </Col>
            </Row>
            <footer className="pt-4 my-md-5 pt-md-5 border-top">
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <small className="d-block mb-3 text-muted">&copy; Ajmal Ahamed {new Date().getFullYear()}</small>
                    </Col>
                </Row>
            </footer>
        </Container>
    );
}

export default Layout;