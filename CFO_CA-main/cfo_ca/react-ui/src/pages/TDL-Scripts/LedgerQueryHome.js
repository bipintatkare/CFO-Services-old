import React, { Component } from 'react';
import {
    Row, Col, Container
} from "reactstrap";

import LedgerQueryTable from "./LedgerQueryTable";

const TableCss = {
    border: "1px solid black"
}

class LedgerQueryHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Row>
                            <Col md={12}>
                                <LedgerQueryTable />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default LedgerQueryHome; 