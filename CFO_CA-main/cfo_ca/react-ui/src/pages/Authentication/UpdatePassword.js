
import React, { Component } from "react";
import { Row, Col, Alert, Card, CardBody, Container } from "reactstrap";

// Redux
import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/cfo-logo.png";
import cookie from "react-cookies";

class UpdatePasswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // handleValidSubmit
        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    // handleValidSubmit
    handleValidSubmit(event, values) {
        if (values["password"] === values["password2"]) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": cookie.load("csrftoken"),
                    "Authorization": `token ${cookie.load("token")}`
                },
                body: JSON.stringify(values)
            };

            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/api/v1/reset-password/${this.props.match.params.user_id}/`, requestOptions)
                .then(res => {
                    if (res.status > 400) {
                        this.setState({ "forgetError": "Something went wrong" })
                    }
                    return res.json()
                })
                .then(res => {
                    if (res.message !== null) {
                        this.setState({ "successMsg": res.message })
                        setTimeout(() => {
                            this.props.history.push("/login")
                        }, 2000);
                    }
                    else {
                        this.setState({ "forgetError": "Something went wrong" })
                    }
                })
                .catch(err => {
                    this.setState({ "forgetError": err })
                })
        }
        else {
            this.setState({ "forgetError": "Password not match" })
        }
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
                                                    <p>Sign in to continue to CFO Services.</p>
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

                                            {this.state.forgetError ? (
                                                <Alert color="danger" style={{ marginTop: "13px" }}>
                                                    {this.state.forgetError}
                                                </Alert>
                                            ) : null}
                                            {this.state.successMsg ? (
                                                <Alert color="success" style={{ marginTop: "13px" }}>
                                                    {this.state.successMsg}
                                                </Alert>
                                            ) : null}

                                            <AvForm
                                                className="form-horizontal mt-4"
                                                onValidSubmit={this.handleValidSubmit}
                                            >

                                                <div className="form-group">
                                                    <AvField
                                                        name="password"
                                                        label="Password"
                                                        className="form-control"
                                                        placeholder="Enter new password"
                                                        type="password"
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <AvField
                                                        name="password2"
                                                        label="Conform Password"
                                                        className="form-control"
                                                        placeholder="Re-enter password"
                                                        type="password"
                                                        required
                                                    />
                                                </div>
                                                <Row className="form-group">
                                                    <Col className="text-right">
                                                        <button
                                                            className="btn btn-primary w-md waves-effect waves-light"
                                                            type="submit"
                                                        >
                                                            Reset
                                                          </button>
                                                    </Col>
                                                </Row>
                                            </AvForm>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-5 text-center">
                                    <p>
                                        Go back to{" "}
                                        <Link
                                            to="login"
                                            className="font-weight-medium text-primary"
                                        >
                                            Login
                                        </Link>{" "}
                                    </p>
                                    <p>© {new Date().getFullYear()} CFO Services. Crafted with <i className="mdi mdi-heart text-danger"></i> by Farintsol</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(UpdatePasswordPage);