import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Container, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import cookie from "react-cookies"
import LoadingComponent from './loadingComponent';

//Simple bar
import SimpleBar from "simplebar-react";

class ManagerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site_users_list: [],
            recruiter_name: "",
            redirect: false,
            recruiter_id: "",
            loading: true,

        }
    }

    load_managers = () => {
        const token = cookie.load("token")
        const csrf = cookie.load("csrftoken")
        const user = JSON.parse(localStorage.getItem("authUser"));

        const lookups = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
            }
        }

        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/api/v1/site_user_list/${user.id}/`, lookups)
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(res => {
                console.log("response recruiter list", res)
                return this.setState({
                    loading: false,
                    site_users_list: res
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleClick = (id) => {
        return this.setState({
            redirect: true,
            recruiter_id: id
        })
    }

    componentDidMount() {
        this.load_managers()
    }

    render() {
        const { site_users_list, loading } = this.state

        return (
            <React.Fragment>

                <div className="page-content">
                    {loading ? <LoadingComponent /> :
                        <Container fluid>


                            <div>


                                <Col style={{ marginTop: "2%", marginBottom: "2%" }} xl="12">


                                    <Row>
                                        <Col md="10">
                                            <h2>Manager</h2>
                                        </Col>
                                        <Col md="2">
                                            <Link to="/Add_manager"><button type="button" className="btn btn-secondary">Add Manager</button></Link>

                                        </Col>
                                    </Row>


                                    <Card style={{ marginTop: "2%", marginBottom: "2%", borderRadius: "20px" }}>
                                        <CardBody>
                                            <Row>
                                                <Col md="1">
                                                    <p style={{ marginTop: "15%", }}>Filter By</p>
                                                </Col>
                                                <Col md="2">
                                                    <select className="btn btn-secondary" name="cars" id="cars">
                                                        <option value="volvo">Name</option>
                                                        <option value="saab">Last Name</option>
                                                        <option value="opel">Phone No.</option>
                                                    </select>
                                                </Col>
                                                <Col md="3">
                                                    <input type="text" className="form-control" />
                                                </Col>
                                                <Col md="2">
                                                    <input type="date" className="form-control" />
                                                </Col>
                                                <Col md="2">
                                                    <input type="date" className="form-control" />
                                                </Col>
                                                <Col md="2">
                                                    <button type="button" class="btn btn-success">Search</button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>


                                    <Card style={{ borderRadius: "20px" }}>

                                        <table className="table">
                                            <thead>
                                                <tr style={{ backgroundColor: "#292F42" }}>
                                                    <th scope="col" style={{ borderRadius: "20px 0px 0px 0px" }}><center style={{ color: "white" }}>First Name</center></th>
                                                    <th scope="col"><center style={{ color: "white" }}>Last Name</center></th>
                                                    <th scope="col"><center style={{ color: "white" }}>Email ID</center></th>
                                                    <th scope="col"><center style={{ color: "white" }}>Phone No.</center></th>
                                                    <th scope="col" style={{ borderRadius: "0px 20px 0px 0px" }}><center style={{ color: "white" }}>Edit</center></th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {site_users_list.length > 0 ? site_users_list.map((siteUserItem, index) => {
                                                    return (
                                                        <tr>
                                                            <th scope="row"><center>{siteUserItem.first_name}</center></th>
                                                            <td><center>{siteUserItem.last_name}</center></td>
                                                            <td><center>{siteUserItem.email}</center></td>
                                                            <td><center>{siteUserItem.mobile}</center></td>
                                                            <td><center><Link to="/Add_manager"><Button style={{ height: "auto", fontSize: "10px" }}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{ marginTop: "0px" }}></i></center></Button></Link></center></td>
                                                        </tr>
                                                    )
                                                })
                                                    : <tr><td></td><td></td><center><h5>No Managers</h5></center></tr>

                                                }




                                            </tbody>
                                        </table>

                                    </Card>
                                </Col>
                            </div>


                        </Container>
                    }
                </div>

            </React.Fragment>
        );
    }
}

export default ManagerView;