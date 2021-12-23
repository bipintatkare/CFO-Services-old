import React, { Component } from 'react';
import {
    Row, Col, Container
} from "reactstrap";
import { Link } from "react-router-dom";
import MeetingList from "./MeetingList"

class MeetingHome extends Component {
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
                            <Col lg={6}>
                                <div className="text-left mb-5">
                                    <h4>Meetings</h4>
                                    <p className="text-muted">
                                        In any meeting, Can be connected to thread or individule. You can also setup recurring meeting.</p>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="text-right mb-5">
                                    <Link to="/create-meeting" className="btn btn-primary waves-effect waves-light">
                                        Add New Meeting
                                    </Link>

                                </div>
                            </Col>
                            <Col md={12}>
                                <MeetingList />

                            </Col>



                        </Row>


                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default MeetingHome;