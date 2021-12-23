import React, { Component } from 'react';

import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";

// Redux
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

// actions
import { loginUser, apiError } from '../../store/actions';

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/cfo-logo.png";
import cookie from "react-cookies";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {}

        // handleValidSubmit
        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    // handleValidSubmit
    handleValidSubmit(event, values) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            },
            body: JSON.stringify(values)
        };
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/login', requestOptions)
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                }
                else if (res.status === 401) {
                    this.setState({ "error": "Invalid Credentials" })
                }
                else {
                    this.setState({ "error": "Something went wrong" })
                }
            })
            .then(response => {
                localStorage.setItem("authUser", JSON.stringify(response.user));
                this.props.history.push("/mom-home")
            })
            .catch(err => {
                this.props.history.push("/login")
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
                                                    <h5 className="text-primary">Welcome Back !</h5>
                                                    <p>Sign in to CFO Services.</p>
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

                                                <div className="form-group">
                                                    <AvField name="username" label="Email" className="form-control" placeholder="Enter email" type="email" required />
                                                </div>

                                                <div className="form-group">
                                                    <AvField name="password" label="Password" type="password" required placeholder="Enter Password" />
                                                </div>

                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customControlInline" />
                                                    <label className="custom-control-label" htmlFor="customControlInline">Remember me</label>
                                                </div>

                                                <div className="mt-3">
                                                    <button className="btn btn-primary btn-block waves-effect waves-light" type="submit">Log In</button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock mr-1"></i> Forgot your password?</Link>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-5 text-center">
                                    <p>Don't have an account ? <Link to="register" className="font-weight-medium text-primary"> Signup now </Link> </p>
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

export default withRouter(Login);

