import React, { Component } from "react";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Progress } from "reactstrap";
import { withRouter } from 'react-router';
import "./datatables.scss";
import LoadingComponent from '../Dashboard/loadingComponent';
import { parseDate } from '../MOM/utils';


class MeetingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    handleRowClick(meeting_id, is_completed) {
        if (is_completed) {
            this.props.history.push(`/meeting-report/${meeting_id}`)
        } else {
            this.props.history.push(`/detail-meeting/${meeting_id}`)
        }
    }

    task_status(meeting) {
        if (meeting.perticular.length === 0) {
            return <div>No tasks</div>
        } else {
            var complated_tasks = meeting.perticular.filter(function (perticular) {
                return perticular.is_completed
            })
            return <div>{complated_tasks.length} out of {meeting.perticular.length} </div>
        }
    }

    meeting_status_template(status) {
        if (status) {
            return <input type="checkbox" defaultChecked={status} disabled checked />
        }
        else {
            return <input type="checkbox" defaultChecked={status} disabled />
        }
    }

    componentDidMount() {
        // MeetingThreads
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/mom/meetings/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(meetings => {
                let data_meetings = meetings.map(
                    (meeting, i) => {
                        return {
                            clickEvent: () => this.handleRowClick(meeting.id, meeting.is_completed),
                            title: <a>{meeting.title}</a>,
                            task_status: <a>{this.task_status(meeting)}</a>,
                            thread_name: <a>{meeting.thread_name}</a>,
                            m_date: <a>{parseDate(meeting.m_date)}</a>,
                            summary: <a>{meeting.summary}</a>,
                            status: this.meeting_status_template(meeting.status)
                        };
                    });
                return this.setState({ meetings: data_meetings, loading: false });
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {

        const { meetings, loading } = this.state

        const data = {
            columns: [

                {
                    label: "Meeting Title",
                    field: "title",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "Completed tasks",
                    field: "task_status",
                    width: 100
                },
                {
                    label: "Meeting Date",
                    field: "m_date",
                    width: 100
                },
                {
                    label: "Thread",
                    field: 'thread_name',
                    sort: "asc",
                    width: 150
                },
                {
                    label: "Summary",
                    field: "summary",
                    sort: "asc",
                    width: 400
                },
                {
                    label: "Status",
                    field: "status",
                    width: 150

                }
            ],

            rows: meetings
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
                                        <CardTitle>Meeting Entries </CardTitle>
                                        <CardSubtitle className="mb-3">
                                            Below are the meeting entries.
                                        </CardSubtitle>

                                        <MDBDataTableV5 responsive striped bordered data={data} hover />

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

export default withRouter(MeetingList);
