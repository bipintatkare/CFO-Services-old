import React, { Component } from 'react';
import {
    Row, Col, Container
} from "reactstrap";
import ThreadList from "./ThreadList"

const TableCss = {
    border: "1px solid black"
}

class TaskHome extends Component {
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
                            <Col lg={12}>
                                <div className="text-left mb-5">
                                    <h4>Thread</h4>
                                    <p className="text-muted">
                                        In any thread, there are series of meetings interlinked with each other, helping to better understand the flow and nature of meetings.
                                    </p>
                                </div>
                            </Col>
                            <Col md={12}>
                                {/* Display thread-wise perticulars, on click redirect to `ThreadWiseTask` */}
                                <ThreadList redirect_perticular={true} />
                            </Col>



                        </Row>


                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default TaskHome;