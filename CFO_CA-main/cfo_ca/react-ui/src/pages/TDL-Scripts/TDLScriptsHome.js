import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, CardTitle, Container } from "reactstrap";
import { Link } from "react-router-dom";


//Simple bar
import SimpleBar from "simplebar-react";

const TableCss = {
    border: "1px solid black"
}

class TDLScriptsHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            script_master: [],
            loading: false,
        } 
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/reporting/script-master/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(data => {
                return this.setState({
                    script_master: data
                });
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleOnRunButtonClick(script_id) {
        if (script_id === 4 || script_id === 12 || script_id == 41) {
            this.props.history.push(`/vouchers-query-home/${script_id}`)
        } else {
            this.props.history.push(`/ledger-query-home/${script_id}`)
        }
    }

    render() {
        const { script_master, loading } = this.state

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Row>
                            <Col md={12}>
                                <Card body>
                                    <Row>
                                        <CardBody className="shadow-lg list-group-item col-md-12" style={{ padding: "15px" }}>
                                            <Row>
                                                <Col md={1}>
                                                    <CardTitle className="mt-0 text-center">Script No.</CardTitle>
                                                </Col>
                                                <Col md={5}>
                                                    <CardTitle className="mt-0 text-center">Script Name</CardTitle>
                                                </Col>
                                                <Col md={2}>
                                                    <CardTitle className="mt-0 text-center">Execution Time</CardTitle>
                                                </Col>
                                                <Col md={4}>
                                                    <CardTitle className="mt-0 text-center">Actions</CardTitle>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Row>
                                </Card>
                            </Col>
                            <Col md={12}>
                                {script_master != null ?
                                    script_master.map((script) => {
                                        return (
                                            <Card body>
                                                <Row>
                                                    <CardBody className="shadow-lg list-group-item col-md-12" style={{ padding: "15px" }}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <CardTitle className="mt-0 text-center">{script.script_id}</CardTitle>
                                                            </Col>
                                                            <Col md={5}>
                                                                <CardTitle className="mt-0 text-center">{script.name}</CardTitle>
                                                            </Col>
                                                            <Col md={2}>
                                                                <CardTitle className="mt-0 text-center">{script.execution_time}</CardTitle>
                                                            </Col>
                                                            <Col md={4}>
                                                                <CardTitle className="mt-0 text-center">
                                                                    <Button className="btn btn-success btn-outline-success" onClick={() => this.handleOnRunButtonClick(script.script_id)}>
                                                                        <i class="bx bx-code-block"></i> Run Script
                                                                    </Button>
                                                                </CardTitle>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Row>
                                            </Card>
                                        )
                                    })
                                    :
                                    <p>No Scripts Available!</p>
                                }
                            </Col>

                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default TDLScriptsHome;