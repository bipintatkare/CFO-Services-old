import React, { Component, Suspense } from 'react';
import {
  Row, Col, Card, Button, CardTitle, Container, Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import CardBody from 'reactstrap/lib/CardBody';
import { withRouter } from 'react-router';
import { parseDate2, parseDate } from './utils';
import "./Cron/cron-builder.css";
import cookie from "react-cookies";
import Schedule from "./Schedule";
import LoadingComponent from '../Dashboard/loadingComponent';

const UserManage = React.lazy(() =>  import("./UserManage")); 
class MeetingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_updating: false,
      organizers: [],
      attendees: [],
      loading: true
    }
  }

  componentDidMount() {
    if (this.props.match.params.meeting_id !== undefined) {
      // Update Meeting
      this.setState({ is_updating: true });
      fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting/${this.props.match.params.meeting_id}` + '/')
        .then(res => {
          if (res.status > 400) {
            return console.log("Something went wrong")
          }
          return res.json()
        })
        .then(meeting => {
          console.log(meeting)
          return this.setState({
            loading: false,
            title: meeting.title,
            summary: meeting.summary,
            start_time: parseDate2(meeting.start_time),
            end_time: parseDate2(meeting.end_time),
            thread_id: meeting.meeting_thread.id,
            reminder: meeting.reminder,
            organizers: meeting.attendee
            .filter((org) => {
              return org.is_organizer
            })
            .map((org) => {
              return {
                "name": org.attendee.first_name + " " + org.attendee.last_name,
                "email": org.attendee.email,
                "mobile": org.attendee.mobile
              }
            }),
            attendees: meeting.attendee
            .filter((org) => {
              return !org.is_organizer
            })
            .map((org) => {
              return {
                "name": org.attendee.first_name + " " + org.attendee.last_name,
                "email": org.attendee.email,
                "mobile": org.attendee.mobile
              }
            }),
          });
        })
        .catch(err => {
          console.log(err);
        })
    }

    fetch(process.env.REACT_APP_BASEURL_BACKEND + '/mom/meeting-threads/')
      .then(res => {
        if (res.status > 400) {
          return console.log("Something went wrong")
        }
        return res.json()
      })
      .then(meeting_threads => {
        return this.setState({ meeting_threads: meeting_threads });
      })
      .catch(err => {
        console.log(err);
      })
      this.setState({ loading: false });
  }

  handleUpdate(e) {
    console.log("On click handleUpdate();")
    const { title, summary, start_time, end_time, thread_id, organizers, attendees, reminder } = this.state;
    const meeting = {
      'title': title,
      'start_time': start_time,
      'end_time': end_time,
      'summary': summary,
      'meeting_thread': thread_id,
      'organizer': organizers,
      'attendee': attendees,
      'reminder': reminder,
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

    console.log(requestOptions);
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

  handleSubmit(e) {
    console.log("On click handleSubmit();")
    const { title, summary, start_time, end_time, thread_id, organizers, attendees, reminder } = this.state;

    const meeting = {
      'title': title,
      'start_time': start_time,
      'end_time': end_time,
      'summary': summary,
      'meeting_thread': thread_id,
      'organizer': organizers,
      'attendee': attendees,
      'reminder': reminder,
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-CSRFToken": cookie.load("csrftoken"),
        "Authorization": `token ${cookie.load("token")}`
      },
      body: JSON.stringify(meeting)
    };
    fetch(process.env.REACT_APP_BASEURL_BACKEND + '/mom/meetings/', requestOptions)
      .then(res => res.json())
      .then(data => {
        this.props.history.goBack()
      })
      .catch(err => {
        console.log(err);
        this.props.history.push("/error")
      })
  }

  handleChange = (e) => {
    return this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  handleAttendeeData = (data) => {
    console.log(data);
    this.setState({
      'attendees': data
    });
  }

  handleOrganizerData = (data) => {
    console.log(data);
    this.setState({
      'organizers': data
    });
  }

  handleCronData = (data) => {
    this.setState({
      'reminder': data
    })
  }


  render() {
    const { meeting_threads, loading } = this.state

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {loading ? <LoadingComponent /> :
            <Row>
              <Col md={12}>
                <Card body>
                  <CardTitle className="mt-0 text-center">
                    {this.state.is_updating ?
                      <h3>Update Meeting </h3>
                      :
                      <h3>Create Meeting </h3>
                    }
                  </CardTitle>
                  <br />
                  <Row>
                    <Col md={3}>
                      <h5>Title </h5> <br />
                      <Input type="text"
                        name="title"
                        value={this.state.title}
                        placeholder="Enter title of meeting here"
                        onChange={this.handleChange.bind(this)}
                      />
                    </Col>
                    <Col md={4}>
                      <h5>Agenda </h5> <br />
                      <Input type="textarea"
                        name="summary"
                        value={this.state.summary}
                        placeholder="Enter purpose of meeting here"
                        onChange={this.handleChange.bind(this)}
                      />
                    </Col>

                    <Col md={3}>
                      <h5>Thread </h5><br />
                      <select
                        name="thread_id"
                        className="form-control"
                        value={this.state.thread_id}
                        onChange={this.handleChange.bind(this)}>
                        <option value="" >Choose meeting thread</option>
                        {meeting_threads != null && meeting_threads.length > 0 ? meeting_threads.map((threads, index) => {
                          return (
                            <option value={threads.id}>
                              {threads.title}
                            </option>
                          )
                        }) :
                          console.log("No users")
                        }
                      </select>
                    </Col>
                    <Col md={2}>
                      <h5>Schedule</h5>
                      <br />
                      <Schedule remindersData={true} meeting_id={this.props.match.params.meeting_id} handleData={this.handleCronData} />
                    </Col>
                  </Row>
                  <br />
                  <br />
          
                  <Card>
                    <Col md={12}>
                      <CardTitle style={{ fontSize: "16px" }}>Add Organizers </CardTitle> <br />
                      {/**<UserManage is_organizer={true} meeting_id={this.props.match.params.meeting_id} handleData={this.handleOrganizerData} />**/}
                      <Suspense fallback={<h1>Still Loading…</h1>}>
                      <UserManage is_organizer={true} meeting_id={this.props.match.params.meeting_id}  handleData={this.handleOrganizerData} />
                      </Suspense>
                    </Col>
                  </Card>
                  <br />
                  <Card>
                    <Col md={12}>
                      <CardTitle style={{ fontSize: "16px" }}>Add Attendees </CardTitle> <br />
                      <Suspense fallback={<h1>Still Loading…</h1>}>          
                      <UserManage is_organizer={false} meeting_id={this.props.match.params.meeting_id} handleData={this.handleAttendeeData} />
                      </Suspense>
                    </Col>
                  </Card>

                  <Col md={12}>
                    <br/>
                    <center>
                      {this.state.is_updating ?
                        <div>

                          <Button color="primary" className="mt-2" onClick={this.handleUpdate.bind(this)}> Update </Button>

                          <Link to={"/detail-meeting/" + this.props.match.params.meeting_id}><Button color="primary" className="mt-2"> Next </Button> </Link>

                        </div>

                        :
                        <Button color="primary" onClick={this.handleSubmit.bind(this)}> Submit </Button>
                      }
                    </center>
                  </Col>

                </Card>
              </Col>


            </Row>
            }

          </Container>

        </div >
      </React.Fragment >
    );
  }
}

export default withRouter(MeetingForm);