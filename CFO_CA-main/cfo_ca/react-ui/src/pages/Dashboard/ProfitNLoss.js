import React, { Component } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col, Table, Button, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import cookie from "react-cookies";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import LoadingComponent from './loadingComponent';

class ProfitNLoss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            companies: [],
        };
    }

    syncGroups() {
        this.setState({loading:true});
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/tl/groupswithsubgroups/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(groups => {
                this.setState({
                    groups: groups,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({loading:false});
            })
    }

    componentDidMount() {
        this.syncGroups();
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


    render() {
        const { groups, companies } = this.state
        return (
            <React.Fragment>
                {this.state.loading ? <LoadingComponent/> :
                <div className="page-content">
                    <Container fluid>
                        <center><h2> Profit And Loss </h2></center>
                        <br />
                        <div>
                            <Row>
                                <Col md="6">
                                    <Card>
                                        <CardBody>
                                            <CardTitle> Income Groups </CardTitle>
                                            <br />
                                            <div className="table-responsive">
                                                <Table className="table table-bordered mb-0">

                                                    <thead>

                                                        <tr>
                                                            <th>Sr. No.</th>
                                                            <th>Name</th>
                                                            <th>Sub Groups</th>
                                                            <th>Open Cr.</th>
                                                            <th>Open Dr.</th>
                                                            <th>Close Cr.</th>
                                                            <th>Close Dr.</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groups != null ?
                                                            groups
                                                                .filter((group) => {
                                                                    return group.group_type === "P&L" && group.balance_sheet_type === "Income"
                                                                })
                                                                .map((group, index) => {
                                                                    return (
                                                                        <>
                                                                            <tr>
                                                                                <th scope="row">{index + 1}</th>
                                                                                <td>{group.name}</td>
                                                                                <td> </td>
                                                                                <td>{group.opening_balance_cr}</td>
                                                                                <td>{group.opening_balance_dr}</td>
                                                                                <td>{group.closing_balance_cr}</td>
                                                                                <td>{group.closing_balance_dr}</td>
                                                                            </tr>

                                                                            {group.sub_groups !== null &&
                                                                                group.sub_groups != null && group.sub_groups.length > 0 ? group.sub_groups.map((g) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td></td>
                                                                                            <td></td>
                                                                                            <td>{g.name}</td>
                                                                                            <td>{g.opening_balance_cr}</td>
                                                                                            <td>{g.opening_balance_dr}</td>
                                                                                            <td>{g.closing_balance_cr}</td>
                                                                                            <td>{g.closing_balance_dr}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                                : <></>
                                                                            }
                                                                        </>
                                                                    )
                                                                })
                                                            :
                                                            <p>No Custom Income Groups</p>
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col md="6">
                                    <Card>
                                        <CardBody>
                                            <CardTitle> Expences Group </CardTitle>
                                            <br />
                                            <div className="table-responsive">
                                                <Table className="table table-bordered mb-0">

                                                    <thead>

                                                        <tr>
                                                            <th>Sr. No.</th>
                                                            <th>Name</th>
                                                            <th>Sub Groups</th>
                                                            <th>Open Cr.</th>
                                                            <th>Open Dr.</th>
                                                            <th>Close Cr.</th>
                                                            <th>Close Dr.</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groups != null ?
                                                            groups
                                                                .filter((group) => {
                                                                    return group.group_type === "P&L" && group.balance_sheet_type === "Expense"
                                                                })
                                                                .map((group, index) => {
                                                                    return (
                                                                        <>
                                                                            <tr>
                                                                                <th scope="row">{index + 1}</th>
                                                                                <td>{group.name}</td>
                                                                                <td> </td>
                                                                                <td>{group.opening_balance_cr}</td>
                                                                                <td>{group.opening_balance_dr}</td>
                                                                                <td>{group.closing_balance_cr}</td>
                                                                                <td>{group.closing_balance_dr}</td>
                                                                            </tr>

                                                                            {group.sub_groups !== null &&
                                                                                group.sub_groups != null && group.sub_groups.length > 0 ? group.sub_groups.map((g) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td></td>
                                                                                            <td></td>
                                                                                            <td>{g.name}</td>
                                                                                            <td>{g.opening_balance_cr}</td>
                                                                                            <td>{g.opening_balance_dr}</td>
                                                                                            <td>{g.closing_balance_cr}</td>
                                                                                            <td>{g.closing_balance_dr}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                                : <></>
                                                                            }
                                                                        </>
                                                                    )
                                                                })
                                                            :
                                                            <p>No Expence Groups</p>
                                                        }

                                                    </tbody>
                                                </Table>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                            </Row>
                        </div>
                    </Container>
                </div>
                }

            </React.Fragment>
        );
    }
}

export default ProfitNLoss;