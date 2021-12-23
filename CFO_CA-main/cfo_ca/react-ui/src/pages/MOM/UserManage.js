import React, { Component } from 'react';
import {
    Row, Col, Button, Table, Form, Input, Card, CardBody, FormGroup, CardTitle, Container, Label
} from "reactstrap";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
const TableCss = {
    border: "1px solid black"
}

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            nameError: "",
            emailError: "",
            mobileError: "",
        }
    }

    componentDidMount() {
        if (this.props.meeting_id !== undefined) {
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting/${this.props.meeting_id}` + '/')
                .then(res => {
                    if (res.status > 400) {
                        return console.log("Something went wrong")
                    }
                    return res.json()
                })
                .then(meeting => {
                    if (this.props.is_organizer == true) {

                        let organizers = meeting.attendee
                        .filter((org) => {
                            return org.is_organizer
                        })
                        .map((org) => {
                            return {
                                "name": org.attendee.first_name + " " + org.attendee.last_name,
                                "email": org.attendee.email,
                                "mobile": org.attendee.mobile
                            }
                        })
                        return this.setState({
                            rows: organizers,
                        });
                    } else {
                        let attendees = meeting.attendee
                        .filter((att) => {
                            return !att.is_organizer
                        })
                        .map((att) => {
                            return {
                                "name": att.attendee.first_name + " " + att.attendee.last_name,
                                "email": att.attendee.email,
                                "mobile": att.attendee.mobile
                            }
                        })
                        return this.setState({
                            rows: attendees
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    validation = () => {
        let nameError = "";
        let emailError = "";
        let mobileError = "";


        if (!this.state.new_name) {
            nameError = 'Please enter your Name';
        }

        if (!this.state.new_email) {
            emailError = 'Please enter your email id';
        } else if (!this.state.new_email.includes("@")) {
            emailError = 'Invalid Email';
        }

        if (!this.state.new_mobile) {
            mobileError = 'Please enter your mobile number';
        }
        else if (this.state.new_mobile.length < 10) {
            mobileError = 'Please Enter a Valid number';
        } else if (this.state.new_mobile.length > 10) {
            mobileError = 'Please Enter a Valid number';
        }

        if (emailError || mobileError || nameError) {
            this.setState({ emailError, mobileError, nameError });
            return false;
        } else {
            this.setState({ emailError, mobileError, nameError });
        }

        return true;
    };

    sendDataToParentComponent() {
        this.props.handleData(this.state.rows);
    }

    handleChange = (e) => {
        return this.setState({
            [e.target.name]: e.target.value,
        })


    }

    handleAddRow = () => {
        const item = {
            "name": this.state.new_name,
            "email": this.state.new_email,
            "mobile": this.state.new_mobile
        };


        const validate = this.validation();
        if (validate) {
            this.setState({
                rows: [...this.state.rows, item],

            },
                () => {
                    this.sendDataToParentComponent()

                }
            );
            console.log(this.state.rows)
            this.setState({
                new_name : "",
                new_email : "",
                new_mobile : ""
            })
        }


    };


    handleRemoveRow = (e, idx) => {
        let values = [...this.state.rows];
        values.splice("addr" + idx, 1);
        this.setState({ rows: values });
        console.log(this.state.rows)

        // if (typeof (idx) != "undefined")
        //     document.getElementById("addr" + idx).style.display = "none";

        this.sendDataToParentComponent()

    };

    render() {
        return (
            <React.Fragment>
                <Row>
                    <Col md={12}>
                        <div className="">
                            <Row>
                                <Col xs="12">
                                    <table style={{ width: "100%" }}>
                                        <tbody>
                                            <tr id="addr01" key="">
                                                <td>
                                                    <Form
                                                        className="repeater"
                                                        encType="multipart/form-data"
                                                    >
                                                        <div data-repeater-list="group-a">
                                                            <Row data-repeater-item>

                                                                <Col lg="3" className="form-group">
                                                                    <Label htmlFor="name">Full Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        value={this.state.new_name}
                                                                        name="new_name" onChange={this.handleChange.bind(this)} placeholder="Enter Full Name here"
                                                                        className="form-control"
                                                                    /><div style={{ color: "red" }}>{this.state.nameError}</div>
                                                                </Col>

                                                                <Col lg="3" className="form-group">
                                                                    <Label htmlFor="email">Email Id</Label>
                                                                    <Input type="email" className="form-control"
                                                                        value={this.state.new_email}
                                                                        name="new_email" onChange={this.handleChange.bind(this)} placeholder="Enter Email Id here"
                                                                    /><div style={{ color: "red" }}>{this.state.emailError}</div>
                                                                </Col>

                                                                <Col lg="3" className="form-group" htmlFor="validationCustom01">
                                                                    <Label htmlFor="subject">Mobile</Label>
                                                                    <Input type="text" id="subject" className="form-control"
                                                                        value={this.state.new_mobile} name="new_mobile" onChange={this.handleChange.bind(this)} placeholder="Enter Mobile here"
                                                                    /><div style={{ color: "red" }}>{this.state.mobileError}</div>
                                                                </Col>

                                                                <Col
                                                                    lg="3"
                                                                    className="form-group align-self-center"
                                                                >
                                                                    <Button onClick={e => this.handleAddRow(e)} color="primary" className="mt-3" style={{ width: "50%" }} block>
                                                                        Save{" "}
                                                                    </Button>{" "}
                                                                </Col>

                                                            </Row>
                                                        </div>
                                                    </Form>
                                                </td>
                                            </tr>
                                            <br />
                                            {this.state.rows.map((item, idx) => (
                                                <tr id={"addr" + idx} key={idx}>
                                                    <td>
                                                        <Form
                                                            className="repeater"
                                                            encType="multipart/form-data"
                                                        >
                                                            <div data-repeater-list="group-a">
                                                                <Row data-repeater-item>
                                                                    {/* <Label style={{ marginRight: "20px", marginTop: "5px" }} htmlFor="name">{idx + 1}</Label> */}

                                                                    <Col lg="3" className="form-group">
                                                                        <Input type="email" defaultValue={item.name} placeholder="Enter Name here" />
                                                                    </Col>

                                                                    <Col lg="3" className="form-group">
                                                                        <Input type="text" defaultValue={item.email} placeholder="Enter Email Id here" />
                                                                    </Col>

                                                                    <Col lg="3" className="form-group">
                                                                        <Input type="text" value={item.mobile} placeholder="Enter Mobile here" />
                                                                    </Col>

                                                                    <Col
                                                                        lg="3"
                                                                        className="form-group"
                                                                    >
                                                                        <Button
                                                                            onClick={e =>
                                                                                this.handleRemoveRow(e, idx)
                                                                            }
                                                                            color="primary"
                                                                        >Delete
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Form>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        </div>
                        <br />
                    </Col>
                </Row>

            </React.Fragment>);
    }
}

export default UserManage;