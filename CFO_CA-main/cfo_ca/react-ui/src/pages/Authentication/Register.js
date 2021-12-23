import React, { Component } from "react";
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// action
import { registerUser, apiError, registerUserFailed } from "../../store/actions";

// Redux
import { connect } from "react-redux";

// import images
import profileImg from "../../assets/images/profile-img.png";
// import logoImg from "../../assets/images/logo.svg";
import logo from "../../assets/images/cfo-logo.png";
import cookie from "react-cookies";
import { withRouter, Link } from 'react-router-dom';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }


  handleValidSubmit(event, values) {
    console.log(values)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-CSRFToken": cookie.load("csrftoken"),
        "Authorization": `token ${cookie.load("token")}`
      },
      body: JSON.stringify(values)
    };
    console.log(requestOptions)
    fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/sign-up', requestOptions)
      .then(response => {
        if (response.status === 200) {
          console.log(response.user);
          this.setState({ "message": "User Sign-Up Successfully!" })
          localStorage.setItem("authUser", JSON.stringify(response.user));
          this.props.history.push("/login")
        }
        else if (response.status === 409) {
          this.setState({ "error": "User already exists!" })
        }
        else {
          this.setState({ "error": "Something went wrong" })
          this.props.history.push("/register")
        }
      })
      .catch(err => {
        this.setState({ "error": "Something went wrong" })
        this.props.history.push("/register")
      })
    // this.props.registerUser(values);
  }

  componentDidMount() {
    // this.props.apiError("");
    // this.props.registerUserFailed("");
  }

  render() {
    return (
      <React.Fragment>
        <div className="home-btn d-none d-sm-block">
          <Link to="/" className="text-dark">
            <i className="bx bx-home h2"></i>
          </Link>
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
                          <h5 className="text-primary">Register</h5>
                          <p>Sign-Up CFO Services account now.</p>
                        </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img src={profileImg} alt="" className="img-fluid" />
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
                      <AvForm
                        className="form-horizontal"
                        onValidSubmit={this.handleValidSubmit}
                      >
                        {this.state.message && this.state.message ? <Alert color="success">{this.state.message}</Alert> : null}
                        {this.state.error && this.state.error ? <Alert color="danger">{this.state.error}</Alert> : null}

                        <div className="form-group">
                          <AvField
                            name="name"
                            label="Name"
                            className="form-control"
                            placeholder="Enter Name"
                            type="text"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <AvField
                            name="email"
                            label="Email"
                            type="email"
                            required
                            placeholder="Enter email"
                          />
                        </div>
                        <div className="form-group">
                          <AvField
                            name="password"
                            label="Password"
                            type="password"
                            required
                            placeholder="Enter Password"
                          />
                        </div>

                        <div className="mt-4">
                          <button
                            className="btn btn-primary btn-block waves-effect waves-light"
                            type="submit"
                          >
                            Register
                          </button>
                        </div>

                        <div className="mt-4 text-center">
                          <p className="mb-0">
                            By registering you agree to the Skote{" "}
                            <Link to="#" className="text-primary">
                              Terms of Use
                            </Link>
                          </p>
                        </div>
                      </AvForm>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    Already have an account ?{" "}
                    <Link
                      to="/login"
                      className="font-weight-medium text-primary"
                    >
                      {" "}
                      Login
                    </Link>{" "}
                  </p>
                  <p>
                    © {new Date().getFullYear()} CFO Services. Crafted with{" "}
                    <i className="mdi mdi-heart text-danger"></i> by Farintsol
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

// const mapStatetoProps = state => {
//   const { user, registrationError, loading } = state.Account;
//   return { user, registrationError, loading };
// };

export default withRouter(Register);
// connect(mapStatetoProps, { registerUser, apiError, registerUserFailed })(Register);
