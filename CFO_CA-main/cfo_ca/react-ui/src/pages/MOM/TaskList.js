import React, { Component } from "react";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { withRouter } from 'react-router';
import { parseDate } from './utils';
import "./datatables.scss";
import LoadingComponent from '../Dashboard/loadingComponent';


class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    handleRowClick(task_id) {
        this.props.history.push(`/task/${task_id}`)
    }

    is_completed_ui(is_completed, perticular_id) {
        if (is_completed) {
            return <input type="checkbox" defaultChecked={is_completed} disabled checked />
        } else {
            return <input type="checkbox" defaultChecked={is_completed} disabled />
        }
    }

    componentDidMount() {
        // Get perticulars, connected with thread
        let tasks_url = process.env.REACT_APP_BASEURL_BACKEND + '/mom/tasks/';
        if (this.props.match.params.thread_id !== undefined) {
            tasks_url = tasks_url + `${this.props.match.params.thread_id}/`
        }
        fetch(tasks_url)
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(perticulars => {
                let data_perticulars = perticulars.map(
                    (perticular, i) => {
                        return {
                            clickEvent: () => this.handleRowClick(perticular.id),
                            title: perticular.title,
                            organizer: perticular.organizer,
                            organizer_name: perticular.organizer_name,
                            completion_date: parseDate(perticular.completion_date),
                            remark: perticular.remark,
                            is_completed: this.is_completed_ui(perticular.is_completed, perticular.id),
                            meeting_title: perticular.meeting.title
                        };
                    });
                return this.setState({ perticulars: data_perticulars, loading: false });
            })
            .catch(err => {
                console.log(err);
            })
    }


    render() {

        const { perticulars, loading } = this.state

        const data = {
            columns: [
                {
                    label: "Perticular",
                    field: "title",
                    sort: "asc",
                    width: 150
                },

                {
                    label: "Meeting Title",
                    field: "meeting_title",
                    sort: "asc",
                    width: 150
                },

                {
                    label: "Organizer",
                    field: "organizer_name",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "Complation Date",
                    field: "completion_date",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "Remark",
                    field: "remark",
                    sort: "asc",
                    width: 400
                },
                {
                    label: "Task Completed",
                    field: 'is_completed',
                    width: 150
                }
            ],

            rows: perticulars
        };
        return (
            <React.Fragment>
                <div className="">
                    {loading ? <LoadingComponent /> :
                    <div className="container-fluid">
                        <Row>
                            <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle>Task Entries </CardTitle>
                                        <CardSubtitle className="mb-3">
                                            Below are the task entries.
                                        </CardSubtitle>

                                        <MDBDataTableV5 responsive striped bordered data={data} />

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(TaskList);
