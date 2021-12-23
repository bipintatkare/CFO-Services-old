import React, { Component } from 'react';
import {
    Row, Col, Card, CardText, CardTitle, Container
} from "reactstrap";
import { Link } from "react-router-dom";
import TasksList from "./tasks-list"

class momMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Row>
                            <Col md={3}>
                                <Card body>
                                    <CardTitle className="mt-0">Threads</CardTitle>
                                    <br />
                                    {/* <CardText>Use threads for series of meeting's.</CardText> */}
                                    <Link to="/thread-home" className="btn btn-primary waves-effect waves-light">Go to Threads</Link>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card body>
                                    <CardTitle className="mt-0"> Meetings </CardTitle>
                                    <br />
                                    {/* <CardText>For recurring meeting's which are independent or connected threads..</CardText> */}
                                    <Link to="/meeting-home" className="btn btn-primary waves-effect waves-light">Go to Meetings</Link>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card body>
                                    <CardTitle className="mt-0">Task</CardTitle>
                                    <br />
                                    {/* <CardText>For task status and manipulations.</CardText> */}
                                    <Link to="/task-home" className="btn btn-primary waves-effect waves-light">Go to Task</Link>
                                </Card>
                            </Col>

                            <Col md={3}>
                                <Card body>
                                    <CardTitle className="mt-0">Issues</CardTitle>
                                    <br />
                                    {/* <CardText>For issues raised by team members..</CardText> */}
                                    <Link to="#" className="btn btn-primary waves-effect waves-light">Go to Task</Link>
                                </Card>
                            </Col>

                            <Col md={12}>
                                <TasksList />

                            </Col>

                        </Row>


                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default momMain;