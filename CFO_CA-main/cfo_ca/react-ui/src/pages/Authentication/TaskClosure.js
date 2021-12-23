import React, { Component } from 'react';

import { Row, Col, CardBody, Card, Alert, Container, Label } from "reactstrap";

// Redux
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

// availity-reactstrap-validation
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';

// actions
import { loginUser, apiError } from '../../store/actions';

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/cfo-logo.png";
import cookie from "react-cookies";

class TaskClosure extends Component {

    constructor(props) {
        super(props);
        this.state = {}

        // handleValidSubmit
        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    // handleValidSubmit
    handleValidSubmit(event, values) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            },
            body: JSON.stringify(values)
        };

        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/perticular/${this.props.match.params.task_id}/`, requestOptions)
            .then(res => {
                if (res.status > 400) {
                    this.setState({ "error": "Something went wrong" })
                }
                return res.json()
            })
            .then(response => {
                this.setState({ "message": "Task status updated successfully!" })
            })
            .catch(err => {
                this.setState({ "error": "Something went wrong" })
            })
    }

    componentWillMount() {
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/perticular/${this.props.match.params.task_id}/`)
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                }
                else {
                    console.log("Something went wrong");
                }
            })
            .then(particular => {
                this.setState({ "is_completed": particular.is_completed, "remark": particular.remark, "name": particular.organizer_name })
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {

        return (
            <React.Fragment>
                <div className="home-btn d-none d-sm-block">
                    <Link to="/" className="text-dark"><i className="bx bx-home h2"></i></Link>
                </div>
                <div className="account-pages my-5 pt-sm-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="overflow-hidden">
                                    <div className="bg-soft-primary">
                                        <Row>
                                            <Col className="col-7">
                                                <div className="text-primary p-4">
                                                    <h5 className="text-primary">Welcome {this.state.name},</h5>
                                                </div>
                                            </Col>
                                            <Col className="col-5 align-self-end">
                                                <img src={profile} alt="" className="img-fluid" />
                                            </Col>
                                        </Row>
                                    </div>
                                    <CardBody className="pt-0">
                                        <div>
                                            <Link to="/">
                                                <div className="avatar-md profile-user-wid mb-4">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <img src={logo} alt="" classNam="rounded-circle" height="34" />
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="p-2">

                                            <AvForm className="form-horizontal" onValidSubmit={this.handleValidSubmit} >

                                                {this.state.error && this.state.error ? <Alert color="danger">{this.state.error}</Alert> : null}
                                                {this.state.message && this.state.message ? <Alert color="success">{this.state.message}</Alert> : null}

                                                <div className="form-group">
                                                    <AvField name="remark" label="Remark" type="text" placeholder="Enter remark" value={this.state.remark} />
                                                </div>

                                                <div className="custom-control custom-checkbox">
                                                    <AvInput type="checkbox" name="is_completed" className="custom-control-input" id="customControlInline" checked={this.state.is_completed} />
                                                    <label className="custom-control-label" htmlFor="customControlInline">Update task status</label>
                                                </div>

                                                <div className="mt-3">
                                                    <button className="btn btn-primary btn-block waves-effect waves-light" type="submit">Update</button>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-5 text-center">
                                    <p>© {new Date().getFullYear()} Crafted with <i className="mdi mdi-heart text-danger"></i> by Farintsol</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(TaskClosure);

