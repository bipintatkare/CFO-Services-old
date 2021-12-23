import React, { Component } from 'react';
import {
    Row, Col, Card, Button, CardTitle, Table, Container,
} from "reactstrap";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import cookie from "react-cookies";


class MeetingReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            attendence_list: []
        }
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting/${this.props.match.params.meeting_id}` + '/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(data => {
                return this.setState({
                    meeting: data
                });
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleDelete() {
        console.log("In side handleDelete()")
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting/${this.props.match.params.meeting_id}/`, requestOptions)
            .then(res => {
                if (res.status > 400) {
                    this.props.history.push("/error")
                }
                this.props.history.goBack()
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/error")
            })
    }

    isAttendeePresent(attendee_id) {
        var attendee = this.state.meeting.present_attendees.find(obj => {
            return obj === attendee_id
        });
        if (typeof attendee !== "undefined") {
            return true;
        }
        return false;
    }

    closeMeeting() {
        console.log("On click closeMeeting();")
        const meeting = {
            'is_closed': true,
            'status': false
        }

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            },
            body: JSON.stringify(meeting)
        };

        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting/${this.props.match.params.meeting_id}/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                this.props.history.goBack()
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/error")
            })
    }


    render() {
        const { meeting } = this.state

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Row>
                            <Col md={12}>
                                {meeting != null &&
                                    <Card body>
                                        <CardTitle className="mt-0 text-center"><h3>Meeting Report</h3></CardTitle>
                                        <br />
                                        <Row>
                                            <Col md={2}>
                                                <h5>Title </h5> <br />
                                                <p>{meeting.title}
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <h5>Agenda </h5> <br />
                                                <p>{meeting.summary}
                                                </p>
                                            </Col>
                                            <Col md={2}>
                                                <h5>Status </h5> <br />
                                                {meeting.status ?
                                                    <p>Active</p>
                                                    :
                                                    <p>Inactive</p>
                                                }

                                            </Col>
                                            <Col md={2}>
                                                <h5>Start Date </h5> <br />
                                                <p> {meeting.start_time} </p>
                                            </Col>
                                        </Row>
                                        <br />
                                        <Row>

                                            <Col md={8}>
                                                <h5>Attendees </h5> <br />
                                                <div className="table-responsive">
                                                    <Table className="table table-bordered mb-0">

                                                        <thead>
                                                            <tr>
                                                                <th>Attendence</th>
                                                                <th>Full Name</th>
                                                                <th>Email</th>
                                                                <th>Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {meeting.attendee
                                                            .filter(function (att) {
                                                                return !att.is_organizer
                                                            })
                                                            .map((att) => {
                                                                return (
                                                                    <tr>
                                                                        <th scope="row">  <input type="checkbox" value={att.id} defaultChecked={this.isAttendeePresent(att.id)} disabled /> </th>
                                                                        <td>{att.attendee.first_name} {att.attendee.last_name}</td>
                                                                        <td>{att.attendee.email}</td>
                                                                        <td>{att.attendee.mobile}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <h5>Organizers </h5> <br />
                                                <div className="table-responsive">
                                                    <Table className="table table-bordered mb-0">

                                                        <thead>
                                                            <tr>
                                                                {/* <th>#</th> */}
                                                                <th>Full Name</th>
                                                                {/* <th>Email</th> */}
                                                                <th>Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {meeting.attendee
                                                            .filter(function (att) {
                                                                return att.is_organizer
                                                            })
                                                            .map((org) => {
                                                                return (
                                                                    <tr>
                                                                        {/* <th scope="row">1</th> */}
                                                                        <td>{org.attendee.first_name} {org.attendee.last_name}</td>
                                                                        {/* <td>{org.email}</td> */}
                                                                        <td>{org.attendee.mobile}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                    <br />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <br />
                                                <h5>Perticulars </h5> <br />
                                                <div className="table-responsive">
                                                    <Table className="table table-bordered mb-0">

                                                        <thead>
                                                            <tr>
                                                                <th>Sr. No.</th>
                                                                <th>Perticulars</th>
                                                                <th>Owner</th>
                                                                <th>Action Completion Date</th>
                                                                <th>Remark</th>
                                                                <th>Task Completed</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {meeting.perticular != null &&
                                                                meeting.perticular.map((item, idx) => {
                                                                    return (
                                                                        <tr>
                                                                            <th scope="row">{idx + 1}</th>
                                                                            <td>{item.title}</td>
                                                                            <td>{item.organizer_name}</td>
                                                                            <td>{item.completion_date}</td>
                                                                            <td>{item.remark}</td>
                                                                            <td><input type="checkbox" defaultChecked={item.is_completed} disabled />  </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }

                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>

                                            <Col>
                                                <br />
                                                <center>
                                                    {!meeting.is_closed &&
                                                        <div>
                                                            <Link color="primary" to={"/detail-meeting/" + this.props.match.params.meeting_id} ><Button> Back </Button> </Link>
                                                            <Button className="btn btn-primary" color="primary" onClick={this.closeMeeting.bind(this)}> Close Meeting </Button>
                                                        </div>
                                                    }
                                                    <br />
                                                    <Button className="btn btn-outline-danger" color="white" type="submit" onClick={this.handleDelete.bind(this)}>Delete</Button>
                                                </center>
                                            </Col>
                                        </Row>

                                    </Card>

                                }
                            </Col>

                        </Row>


                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(MeetingReport);