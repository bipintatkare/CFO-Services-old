import React, { Component } from 'react';
import {
    Row, Col, Card, CardBody, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, CardText, CardTitle,
    DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon, Container, Spinner
} from "reactstrap";
import { Link } from "react-router-dom";

import ThreadList from "./ThreadList"

//Simple bar
import SimpleBar from "simplebar-react";

const TableCss = {
    border: "1px solid black"
}

class ThreadHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    render() {
        const { loading } = this.state
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Row>
                            <Col lg={6}>
                                <div className="text-left mb-5">
                                    <h4>Thread</h4>
                                    <p className="text-muted">
                                        In any thread, there are series of meetings interlinked with each other, helping to better understand the flow and nature of meetings.
                                    </p>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="text-right mb-5">
                                    <Link to="/create-thread" className="btn btn-primary waves-effect waves-light">
                                        Add New Thread
                                    </Link>

                                </div>
                            </Col>
                            <Col md={12}>
                                <ThreadList />

                            </Col>



                        </Row>


                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default ThreadHome;