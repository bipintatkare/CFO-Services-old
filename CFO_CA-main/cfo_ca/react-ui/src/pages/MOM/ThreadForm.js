import React, { Component } from 'react';
import {
    Row, Col, Card, CardBody, Button, Label,
    Form, FormGroup, Input, InputGroup, InputGroupAddon, Container, Spinner
} from "reactstrap";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { PassThrough } from 'stream';
import { withRouter } from 'react-router';
import cookie from "react-cookies";



const TableCss = {
    border: "1px solid black"
}

class ThreadForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_updating: false,
            companies: []
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
                    return this.setState({
                        thread_title: thread.title, organizer_name: thread.organizer, start_date: thread.start_date, summary: thread.summary, company: thread.company
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }

        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/site_users_list')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Somthing went wrong")
                }
                return res.json()
            })
            .then(organizers => {
                return this.setState({ organizers: organizers })
            })
            .catch(err => {
                console.log(err);
            })


        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/company_list/')
            .then(res => {
                if (res.status > 400) {
                    return null
                }
                return res.json()
            })
            .then(companies => {
                return this.setState({ companies: companies })
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleUpdate(e) {
        console.log("On click handleUpdate();")
        const { thread_title, organizer_name, summary, company } = this.state;
        const meetingThreads = {
            'title': thread_title,
            'organizer': organizer_name,
            'summary': summary,
            'company': company
        }

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            },
            body: JSON.stringify(meetingThreads)
        };
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting-thread/${this.props.match.params.thread_id}/`, requestOptions)
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
        const { thread_title, organizer_name, summary, company } = this.state;
        const meetingThreads = {
            'title': thread_title,
            'organizer': organizer_name,
            'summary': summary,
            'company': company
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            },
            body: JSON.stringify(meetingThreads)
        };
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/mom/meeting-threads/', requestOptions)
            .then(res => res.json())
            .then(data => {
                this.props.history.goBack()
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/error")
            })
    }

    handleDelete(e) {
        console.log("On click handleDelete();")
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            }
        };
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting-thread/${this.props.match.params.thread_id}/`, requestOptions)
            .then(res => this.props.history.goBack())
            .catch(err => {
                console.log(err);
                this.props.history.push("/error")
            })
    }

    handleChange = (e) => {
        console.log('e.target', e.target)
        return this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { organizers, companies } = this.state

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Row>
                            <Col xl="8">
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Add New Thread</h4>
                                        <p className="card-title-desc">
                                            Fill below form to add new thread for series of linked meetings.</p>
                                        <AvForm className="needs-validation" >
                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom01">Thread Title</Label>
                                                        <AvField
                                                            name="thread_title"
                                                            placeholder="Thread Title"
                                                            type="text"
                                                            value={this.state.thread_title}
                                                            onChange={this.handleChange.bind(this)}
                                                            errorMessage="Enter Thread Title"
                                                            className="form-control"
                                                            validate={{ required: { value: true } }}
                                                            id="validationCustom01"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom02">Organizer Name</Label>
                                                        <AvField
                                                            name="organizer_name"
                                                            placeholder="Select Organizer Name"
                                                            onChange={this.handleChange.bind(this)}
                                                            type="select"
                                                            value={this.state.organizer_name}
                                                            errorMessage="Enter a valid email"
                                                            className="form-control"
                                                            validate={{ required: { value: true } }}
                                                            id="validationCustom02"
                                                        >
                                                            <option value="" >Choose organizer</option>
                                                            {organizers != null && organizers.length > 0 ? organizers.map((organizer, index) => {
                                                                return (
                                                                    <option value={organizer.id}>
                                                                        {organizer.first_name} {organizer.last_name}
                                                                    </option>
                                                                )
                                                            }) :
                                                                console.log("No users")
                                                            }

                                                        </AvField>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom02">Company Name</Label>
                                                        <AvField
                                                            name="company"
                                                            placeholder="Select Company"
                                                            onChange={this.handleChange.bind(this)}
                                                            type="select"
                                                            value={this.state.company}
                                                            className="form-control"
                                                            validate={{ required: { value: true } }}
                                                            id="validationCustom02"
                                                        >
                                                            <option value="">Choose Company</option>
                                                            {companies != null && companies.length > 0 ? companies.map((company, index) => {
                                                                return (
                                                                    <option value={company.id}>
                                                                        {company.company_name}
                                                                    </option>
                                                                )
                                                            }) :
                                                                console.log("No companies")
                                                            }

                                                        </AvField>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom04">Summary</Label>
                                                        <AvField
                                                            name="summary"
                                                            placeholder="Summary"
                                                            type="text"
                                                            onChange={this.handleChange.bind(this)}
                                                            value={this.state.summary}
                                                            errorMessage="Please provide a Summary."
                                                            className="form-control"
                                                            id="validationCustom04"
                                                        />
                                                    </FormGroup>
                                                </Col>

                                            </Row>

                                            {this.state.is_updating ?
                                                <Row class="form-group">
                                                    <Col md="4">
                                                        <Button class="form-control" color="primary" type="submit" onClick={this.handleUpdate.bind(this)}>Update</Button>
                                                    </Col>
                                                    <Col md="4">
                                                        <Button class="form-control" color="primary" type="submit" onClick={this.handleDelete.bind(this)}>Delete</Button>
                                                    </Col>
                                                </Row>
                                                :
                                                <Button color="primary" type="submit" onClick={this.handleSubmit.bind(this)}>Submit</Button>
                                            }
                                        </AvForm>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>




                    </Container>
                </div>
            </React.Fragment >
        );
    }
}

export default withRouter(ThreadForm);