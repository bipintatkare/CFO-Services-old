import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, CardText, CardTitle,
DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon,Container, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import "./table_border.css";
import SearchFilter from "./SearchFilter"
import LoadingComponent from './loadingComponent';


//Simple bar
import SimpleBar from "simplebar-react";

const TableCss={
    border:"1px solid black"
}

class momMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
        }
    }

    render() {
        const {data_received, loading} = this.state

        return (
            <React.Fragment>
             <div className="page-content">
                    <Container fluid>

                        <Row>
                            <Col md={3}>
                                <Card body>
                                    <CardTitle className="mt-0">Threads</CardTitle>
                                    <CardText>Use threads for series of meeting's.</CardText>
                                    <Link to="#" className="btn btn-primary waves-effect waves-light">Go to Threads</Link>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card body>
                                        <CardTitle className="mt-0"> Meetings </CardTitle>
                                        <CardText>For meeting's without threads..</CardText>
                                        <Link to="#" className="btn btn-primary waves-effect waves-light">Go to Meetings</Link>
                                </Card>
                            </Col>
                             <Col md={3}>
                                <Card body>
                                        <CardTitle className="mt-0">Task</CardTitle>
                                        <CardText>For task status.</CardText>
                                        <Link to="#" className="btn btn-primary waves-effect waves-light">Go to Task</Link>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card body>
                                        <CardTitle className="mt-0">Task</CardTitle>
                                        <CardText>For issues raised by team members..</CardText>
                                        <Link to="#" className="btn btn-primary waves-effect waves-light">Go to Task</Link>
                                </Card>
                            </Col>
                        </Row>


                     </Container>
             </div>
            </React.Fragment>
        );
    }
}

export default momMain;