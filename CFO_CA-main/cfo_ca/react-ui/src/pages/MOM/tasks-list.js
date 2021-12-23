import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row, Col, Container, Card, CardBody, CardTitle } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import ReactApexChart from 'react-apexcharts';
import { parseDate } from './utils';

//Import Images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import LoadingComponent from '../Dashboard/loadingComponent';

class TasksList extends Component {
    state = {
        chk1: true,
        chk2: true,
        chk3: true,
        series: [{ name: "Complete Tasks", type: "column", data: [23, 11, 22, 27, 13, 22, 52, 21, 44, 22, 30] }, { name: "All Tasks", type: "line", data: [23, 11, 34, 27, 17, 22, 62, 32, 44, 22, 39] }],
        options: { chart: { height: 280, type: "line", stacked: !1, toolbar: { show: !1 } }, stroke: { width: [0, 2, 5], curve: "smooth" }, plotOptions: { bar: { columnWidth: "20%", endingShape: "rounded" } }, colors: ["#556ee6", "#34c38f"], fill: { gradient: { inverseColors: !1, shade: "light", type: "vertical", opacityFrom: .85, opacityTo: .55, stops: [0, 100, 100, 100] } }, labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"], markers: { size: 0 }, yaxis: { min: 0 } },
        loading: true
    }

    componentDidMount() {
        // Meetings
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/mom/meetings/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(meetings => {
                return this.setState({ meetings: meetings, loading: false });
            })
            .catch(err => {
                console.log(err);
            })

        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/mom/perticulars/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(tasks => {
                return this.setState({ tasks: tasks });
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <React.Fragment>
                    <div className="">
                        <Container fluid>
                            {/* Render Breadcrumbs */}
                            {this.state.loading ? <LoadingComponent /> :
                            <Row>
                                <Col lg={8}>

                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-4">Today's Meeting</CardTitle>
                                            <div className="table-responsive">
                                                {this.state.meetings != null && this.state.meetings.length > 0 ? this.state.meetings.filter(function (meeting) {
                                                    var parts = meeting.m_date.split('/');
                                                    var meeting_date = new Date(parts[2], parts[1] - 1, parts[0]);
                                                    var today = new Date();
                                                    if (meeting.status === true 
                                                        && today.getDay() == meeting_date.getDay() 
                                                        && today.getMonth() == meeting_date.getMonth() 
                                                        && today.getFullYear() == meeting_date.getFullYear()
                                                    ) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }).map((meeting, index) => {
                                                    return (
                                                        <table className="table table-nowrap table-centered mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <h5 className="text-truncate font-size-14 m-0"><Link to={"/detail-meeting/" + meeting.id} className="text-dark">{meeting.title}</Link></h5>
                                                                    </td>
                                                                    <td>
                                                                        { parseDate(meeting.m_date) }
                                                                    </td>
                                                                    <td>
                                                                        <div className="text-center">
                                                                            <span className="badge badge-pill badge-soft-warning font-size-11">Pending</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>)
                                                }) :
                                                    <Card body>
                                                        <CardTitle className="mt-0">No Any Incoming Meetings</CardTitle>
                                                    </Card>
                                                }
                                            </div>

                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-4">Upcoming Meetings </CardTitle>
                                            <div className="table-responsive">
                                                {this.state.meetings != null && this.state.meetings.length > 0 ?
                                                    this.state.meetings.filter(function (meeting) {
                                                        var parts = meeting.m_date.split('/');
                                                        var meeting_date = new Date(parts[2], parts[1] - 1, parts[0]);
                                                        var today = new Date();
                                                        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                                                        var diffDays = (today.getTime() - meeting_date.getTime()) / (oneDay);
                                                        console.log(diffDays);
                                                        if (meeting.is_closed != true && diffDays < 0) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }).map((meeting, index) => {
                                                        return (
                                                            <table className="table table-nowrap table-centered mb-0">
                                                                <tbody>
                                                                    <tr>
                                                                        {/* <td style={{ width: "60px" }}>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox" className="custom-control-input" id="customCheck1" defaultChecked={meeting.status} />
                                                                        <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                                    </div>
                                                                </td> */}
                                                                        <td>
                                                                            <h5 className="text-truncate font-size-14 m-0"><Link to={"/detail-meeting/" + meeting.id} className="text-dark">{meeting.title}</Link></h5>
                                                                        </td>
                                                                        {/* <td>
                                                                    {meeting.perticular != null &&
                                                                        <div className="team">
                                                                            <Link to="#" className="team-member">
                                                                                <img src={avatar2} className="rounded-circle avatar-xs m-1" alt="" />
                                                                            </Link>
                                                                            <Link to="#" className="team-member d-inline-block">
                                                                                <img src={avatar4} className="rounded-circle avatar-xs m-1" alt="" />
                                                                            </Link>
                                                                            <Link to="#" className="team-member d-inline-block">
                                                                                <div className="avatar-xs">
                                                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                        3 +
                                                                                        </span>
                                                                                </div>
                                                                            </Link>
                                                                        </div>
                                                                    } 
                                                                    </td>
                                                                    
                                                                    */}
                                                                        <td>
                                                                            { parseDate(meeting.m_date) }
                                                                        </td>
                                                                        <td>
                                                                            <div className="text-center">
                                                                                <span className="badge badge-pill badge-soft-secondary font-size-11">Waiting</span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>)
                                                    }) :
                                                    <Card body>
                                                        <CardTitle className="mt-0">No Incoming Meetings</CardTitle>
                                                    </Card>
                                                }
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-4">Completed </CardTitle>
                                            <div className="table-responsive">
                                                {this.state.meetings != null && this.state.meetings.length > 0 ? this.state.meetings.filter(function (meeting) {
                                                    return meeting.is_closed === true;
                                                }).map((meeting, index) => {
                                                    return (
                                                        <table className="table table-nowrap table-centered mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <h5 className="text-truncate font-size-14 m-0"><Link to={"/meeting-report/" + meeting.id} className="text-dark">{meeting.title}</Link></h5>
                                                                    </td>
                                                                    <td>
                                                                        { parseDate(meeting.m_date) }
                                                                    </td>
                                                                    <td>
                                                                        <div className="text-center">
                                                                            <span className="badge badge-pill badge-soft-success font-size-11">Complete</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>)
                                                }) :
                                                    <Card body>
                                                        <CardTitle className="mt-0">No Any Completed Meetings</CardTitle>
                                                    </Card>
                                                }
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col lg={4}>
                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-4">Tasks </CardTitle>
                                            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={280} />
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-4">Recent Tasks </CardTitle>

                                            <div className="table-responsive">
                                                <table className="table table-nowrap table-centered mb-0">
                                                    <tbody>
                                                        {this.state.tasks != null && this.state.tasks.length > 0 ?
                                                            this.state.tasks.slice(0, 5).map((task, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            <h5 className="text-truncate font-size-14 m-0"><Link to={"/task/" + task.id} className="text-dark">{task.title}</Link></h5>
                                                                        </td>
                                                                        {/* <td>
                                                                        <div className="team">
                                                                            <Link to="#" className="team-member d-inline-block">
                                                                                <img src={avatar7} className="rounded-circle avatar-xs m-1" alt="" />
                                                                            </Link>
                                                                        </div>
                                                                    </td> */}
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>No Recent Tasks</tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardBody>
                                    </Card>

                                </Col>
                            </Row>

                            }
                        </Container>
                    </div>
            </React.Fragment>
        );
    }
}

export default TasksList;