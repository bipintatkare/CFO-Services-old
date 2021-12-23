import React, { Component } from 'react';
import {
    Row, Col, Card, CardBody, Button, Label,
    FormGroup, Container
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { withRouter } from 'react-router';
import { parseDate } from './utils';
import cookie from "react-cookies";


const TableCss = {
    border: "1px solid black"
}

class TaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_updating: false,
            perticular_title: "",
            perticular_organizer: "",
            perticular_completion_date: "",
            perticular_is_completed: false,
            perticular_remark: "",
        }
    }

    componentDidMount() {
        if (this.props.match.params.task_id !== undefined) {
            this.setState({ is_updating: true });
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/perticular/${this.props.match.params.task_id}/`)
                .then(res => {
                    if (res.status > 400) {
                        return console.log("Somthing went wrong")
                    }
                    return res.json()
                })
                .then(perticular => {
                    return this.setState({
                        perticular_title: perticular.title,
                        perticular_organizer: perticular.organizer,
                        perticular_completion_date: parseDate(perticular.completion_date),
                        perticular_is_completed: perticular.is_completed,
                        perticular_remark: perticular.remark
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }

        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/site_users_list')
            .then(res => {
                if (res.status > 400) {
                    console.log("Somthing went wrong")
                    return null
                }
                return res.json()
            })
            .then(organizers => {
                return this.setState({ organizers: organizers })
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleUpdate(e) {
        console.log("On click handleUpdate();")
        const {
            perticular_title,
            perticular_organizer,
            perticular_completion_date,
            perticular_is_completed,
            perticular_remark
        } = this.state;

        const perticular = {
            'title': perticular_title,
            'organizer': perticular_organizer,
            'completion_date': perticular_completion_date,
            'is_completed': perticular_is_completed,
            'remark': perticular_remark
        }

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            },
            body: JSON.stringify(perticular)
        };
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/perticular/${this.props.match.params.task_id}/`, requestOptions)
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
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/perticular/${this.props.match.params.task_id}/`, requestOptions)
            .then(res => this.props.history.goBack())
            .catch(err => {
                console.log(err);
                this.props.history.push("/error")
            })
    }

    handleSubmit(e) {
        console.log("On click handleSubmit();")
    }

    handleChange = (e) => {
        console.log('e.target', e.target)
        return this.setState({
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        })
    }

    render() {
        const { organizers, perticular_title, perticular_organizer, perticular_remark, perticular_completion_date, perticular_is_completed } = this.state
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Row>
                            <Col xl="8">
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Task</h4>
                                        <p className="card-title-desc">
                                            Fill below form to add/update new task for series of linked meetings.</p>
                                        <AvForm className="needs-validation" >
                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom01">Task Title</Label>
                                                        <AvField
                                                            name="perticular_title"
                                                            placeholder="Perticular Title"
                                                            type="text"
                                                            value={perticular_title}
                                                            onChange={this.handleChange.bind(this)}
                                                            errorMessage="Enter Perticular Title"
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
                                                            name="perticular_organizer"
                                                            placeholder="Select Organizer Name"
                                                            onChange={this.handleChange.bind(this)}
                                                            type="select"
                                                            value={perticular_organizer}
                                                            errorMessage="Enter a valid email"
                                                            className="form-control"
                                                            validate={{ required: { value: true } }}
                                                            id="validationCustom02"
                                                        >
                                                            <option value="">Choose organizer</option>
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
                                                        <Label htmlFor="validationCustom03">Completion Date</Label>
                                                        <AvField
                                                            name="perticular_completion_date"
                                                            placeholder="Completion Date"
                                                            type="date"
                                                            onChange={this.handleChange.bind(this)}
                                                            value={perticular_completion_date}
                                                            errorMessage=" Please provide a Completion Date."
                                                            className="form-control"
                                                            validate={{ required: { value: true } }}
                                                            id="validationCustom03"
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="8">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom04">Remark</Label>
                                                        <AvField
                                                            name="perticular_remark"
                                                            placeholder="Remark"
                                                            type="text"
                                                            onChange={this.handleChange.bind(this)}
                                                            value={perticular_remark}
                                                            className="form-control"
                                                            id="validationCustom04"
                                                        />
                                                    </FormGroup>
                                                </Col>

                                            </Row>

                                            <Row>

                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom03">Is Completed</Label>
                                                        <AvField
                                                            name="perticular_is_completed"
                                                            type="checkbox"
                                                            onChange={this.handleChange.bind(this)}
                                                            defaultChecked={perticular_is_completed}
                                                            checked={perticular_is_completed}
                                                            id="validationCustom03"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="8">
                                                    {
                                                        this.state.is_updating ?
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
                                                </Col>
                                            </Row>
                                        </AvForm>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(TaskForm);