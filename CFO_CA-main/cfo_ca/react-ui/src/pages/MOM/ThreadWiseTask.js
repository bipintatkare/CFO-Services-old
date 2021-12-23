import React, { Component } from 'react';
import {
    Row, Col, Container
} from "reactstrap";
import { Link } from "react-router-dom";

import ThreadList from "./ThreadList"
import TaskList from './TaskList';

const TableCss = {
    border: "1px solid black"
}

class ThreadWiseTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        if (this.props.match.params.thread_id !== undefined) {
            this.setState({ is_updating: true });
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting-thread/${this.props.match.params.thread_id}/`)
                .then(res => {
                    if (res.status > 400) {
                        return console.log("Somthing went wrong")
                    }
                    return res.json()
                })
                .then(thread => {
                    return this.setState({ thread_title: thread.title, organizer_name: thread.organizer, start_date: thread.start_date, summary: thread.summary })
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }

    render() {
        const { thread_title, organizer_name, start_date, summary } = this.state
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Row>
                            <Col lg={12}>
                                <div className="text-left mb-5">
                                    <h4>{thread_title}</h4>
                                    <p className="text-muted">
                                        {summary}
                                    </p>
                                </div>
                            </Col>
                            <Col md={12}>
                                <TaskList thread_id={this.props.match.params.thread_id} />
                            </Col>



                        </Row>


                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default ThreadWiseTask;