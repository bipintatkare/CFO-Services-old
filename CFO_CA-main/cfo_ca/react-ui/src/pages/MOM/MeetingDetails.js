import React, { Component, lazy, Suspense } from 'react';
import {
    Row, Col, Card, CardBody, Button, CardText, CardTitle, Table, Container,
} from "reactstrap";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { withRouter } from 'react-router';
import Modal from 'react-bootstrap/Modal'
import LoadingComponent from '../Dashboard/loadingComponent';

const MOMPerticular = lazy(() =>  import("./MOMPerticular")); 

const TableCss = {
    border: "1px solid black"
}

class MeetingDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            show: false,
            meeting: null,            
        }
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting/${this.props.match.params.meeting_id}/`)
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(data => {
                return this.setState({
                    meeting: data,
                    loading: false
                });
            })
            .catch(err => {
                console.log(err);
            })
    }

    handlePerticularData = (data) => {
        console.log(data);
        this.setState({
            'perticulars': data
        });
    }

    handleAttendenceData = (e, attendee_id) => {
        console.log(e);
    };

    handleUpdateAttendence() {
        console.log("On click handleUpdateAttendence();")
        const { attendee } = this.state.meeting;

        const attendence = {
            'attendee': attendee
        }
        const token = cookie.load("token")
        const csrf = cookie.load("csrftoken")
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
            },
            body: JSON.stringify(attendence)
        };

        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting/${this.props.match.params.meeting_id}/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.log(err);
            })
        this.handleClose()
    }

    handleMeetingClose() {
        console.log("On click handleAddPerticulars();")
        const { perticulars } = this.state;

        const meeting = {
            'perticular': perticulars,
            'is_closed': true,
            'status': false
        }
        const token = cookie.load("token")
        const csrf = cookie.load("csrftoken")
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
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

    handleDelete() {
        console.log("In side handleDelete()")
        const token = cookie.load("token")
        const csrf = cookie.load("csrftoken")
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
            }
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


    handleClose = () => this.setState({ show: false });
    handleShow = (props) => this.setState({ show: true });

    render() {
        const { meeting, loading } = this.state

        return (
            <React.Fragment>

                <Modal size="lg" show={this.state.show} onHide={this.handleClose}>

                    <Modal.Header >
                        <Modal.Title>Attandence</Modal.Title>
                        <Col >
                            <Button color="primary" className="btn btn-rounded .w-lg float-right ml-2" onClick={this.handleClose}><i className="bx bx-x font-size-16 align-middle mr-2"></i>Close</Button>
                            <Button color="primary" className="btn btn-rounded .w-lg float-right" type="submit" onClick={this.handleUpdateAttendence.bind(this)}><i className="bx bx-check font-size-16 align-middle mr-2"></i>Save</Button>
                        </Col>
                    </Modal.Header>

                    <Modal.Body>
                        <Col
                            md={12}
                            className="form-group align-self-center">
                            {meeting != null &&
                            
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

                                        {meeting.attendee != null && meeting.attendee.map((att) => {
                                            return (
                                                <tr>
                                                    <th scope="row">  
                                                        <input type="checkbox" value={att.id} defaultChecked={att.is_present} onChange={(e) => { 
                                                            meeting.attendee = this.state.meeting.attendee.map((aa) => {
                                                                if(aa.id === att.id) {
                                                                    console.log(e.target.checked);
                                                                    aa.is_present = e.target.checked; 
                                                                }
                                                                return aa;
                                                            });
                                                            console.log(meeting.attendee);
                                                            this.setState({
                                                                meeting: meeting
                                                            });
                                                        }} /> 
                                                    </th>
                                                    <td>{att.attendee.first_name} {att.attendee.last_name}</td>
                                                    <td>{att.attendee.email}</td>
                                                    <td>{att.attendee.mobile}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            }
                        </Col>
                    </Modal.Body>
                </Modal>


                {loading ? <LoadingComponent /> :
                <div className="page-content">
                    <Container fluid>
                        <Row>
                            <Col md={12}>
                                {meeting != null &&
                                    <Card body>
                                        <CardTitle className="mt-0 text-center"><h3>Minutes Of Meeting</h3></CardTitle>

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
                                                <h5>Thread </h5> <br />
                                                <p> {meeting.thread_name} </p>
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
                                                                <th>Full Name</th>
                                                                <th>Email</th>
                                                                <th>Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {meeting.attendee != null && meeting.attendee
                                                            .filter(function (aa) {
                                                                return !aa.is_organizer;
                                                            })
                                                            .map((att) => {
                                                                return (
                                                                    <tr>
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
                                                                <th>Full Name</th>
                                                                <th>Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {meeting.attendee != null && meeting.attendee
                                                            .filter(function (aa) {
                                                                return (aa.is_organizer);
                                                            })
                                                            .map((org) => {
                                                                return (
                                                                    <tr>
                                                                        <td>{org.attendee.first_name} {org.attendee.last_name}</td>
                                                                        <td>{org.attendee.mobile}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                    <br />
                                                </div>
                                            </Col>


                                            <Col md={8}>
                                                <br />
                                                <div className="text-center">
                                                    <Button className="btn" color="primary" type="submit" onClick={this.handleShow}> Attendence</Button>
                                                </div>
                                                <br />
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Suspense fallback={<h1>Still Loading…</h1>}>
                                                <MOMPerticular meeting_id={this.props.match.params.meeting_id} handleData={this.handlePerticularData} />
                                                </Suspense>
                                            </Col>
                                            <Col>
                                                <br />
                                                <center>
                                                    {!meeting.is_closed &&
                                                        <div>
                                                            <Link color="primary" to={"/update-meeting/" + this.props.match.params.meeting_id} ><Button> Edit Meeting </Button> </Link>
                                                            <Button color="primary" className="btn" onClick={this.handleMeetingClose.bind(this)}> Close Meeting </Button>
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
                }
            </React.Fragment>
        );
    }
}

export default withRouter(MeetingDetails);