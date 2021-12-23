import React, { Component } from "react";
import { Card, CardBody, CardTitle, Media, Container, Row, Col, Table, ListGroup, Input } from "reactstrap";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import Button from "reactstrap/lib/Button";
import Modal from 'react-bootstrap/Modal';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Select from 'react-select';
import LoadingComponent from '../Dashboard/loadingComponent';

class TrialBalanceMapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parent_group_list: [], 
            group_list: [],
            custom_groups: [],
            ledger_object_id: null,
            custom_parent_group: null,
            custom_group: [],
            loading2: true,

        };
    }

    componentWillMount() {
        this.syncTrialBalanceMapping();
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/tl/cgroups/')
        .then(res => {
            if (res.status > 400) {
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(data => {
            return this.setState({
                group_list: data,
                loading2: false
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({loading2: false})
        })
    }


    handleChange = (e) => {
        return this.setState({
          [e.target.name]: e.target.value
        })
    }

    syncTrialBalanceMapping() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            },
        };
        this.setState({loading: true});
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/ledgers_list/', requestOptions)
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(data => {
                this.setState({
                    ledgers_data: data,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({loading: false});
            })
    }

    updateCustomGroup(ledger_object_id, custom_parent_group, custom_groups) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": cookie.load("csrftoken"),
                "Authorization": `token ${cookie.load("token")}`
            },
            body: JSON.stringify({
                custom_parent_group : custom_parent_group, 
                custom_groups: custom_groups 
            })
        };

        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/api/v1/ledgers/${ledger_object_id}/`, requestOptions)
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })

            this.syncTrialBalanceMapping();
            this.setState({ 
                custom_parent_group: null, 
                custom_groups: [],
                ledger_object_id: null,
            })
            this.handleClose1();
    }

    handleClose1 = () => this.setState({ show1: false });
    handleShow1 = () => this.setState({ show1: true });

    updateDefaultDataModal() {
        const { group_list, custom_parent_group } = this.state;
        const default_custom_groups = group_list
        .filter((group) => {
            return group.under !== null && group.under.id === custom_parent_group
        })
        .map((group) => {
            return {
                "value": group.id, 
                "label" :  group.name
            }
        })
    
        this.setState({
            default_custom_groups: default_custom_groups,
            default_custom_parent_group: custom_parent_group
        });
    }

    handleChange1 = selectedOption1 => {
        this.setState({            
            custom_parent_group: selectedOption1.value,
        }
        // , () => {
        //     this.updateDefaultDataModal()
        // }
        )
    };

    handleChange2 = selectedOption2 => {
        if (selectedOption2 !== null) {
            var cgroups = selectedOption2.map((group) => {
                return group.value;
            }); 
            var custom_groups = [...this.state.custom_groups, ...cgroups]
            this.setState({
                custom_groups: custom_groups,
            });
        }
    };

    render() {
        const { selectedOption1, selectedOption2 } = this.state;
        const { group_list, ledgers_data, loading, loading2, default_custom_parent_group, default_custom_groups } = this.state;
        const options = group_list.map((group) => {
            return {
                "value": group.id, 
                "label" :  group.name
            }
        }) 



        return (
            <React.Fragment>
                {loading? <LoadingComponent/> :
                <div className="page-content">
                    <Container fluid>
                        <center>
                            <h2> Trial Balance Mapping </h2></center>
                        <br />
                        <Row>
                            {/* <Col md="2">
                                <Card>
                                    <CardBody>
                                        <CardTitle>Total Mapping: 15 </CardTitle>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col md="2">
                                <Card>
                                    <CardBody>
                                        <CardTitle>Unmapped: 22 </CardTitle>
                                    </CardBody>
                                </Card>
                            </Col> */}

                            <Col md={7}></Col>
                            <Col md="1">
                                <Link to={"/add-dropdown-content"}><Button>Add Group</Button></Link>
                            </Col>
                            <Col md="2">
                                <Link to={"/add-reports-notes"}><Button>Add Reports & Notes</Button></Link>
                            </Col>
                            <Col md="2">
                                <Link to={"/trial-balance-report"}><Button>Trial Balance Report</Button></Link>
                            </Col>
                        </Row>
                        <br/>
                        {ledgers_data != null ?
                            <div>
                                <Row>
                                    <Col md="12">
                                        <Card>
                                            <CardBody>
                                                <div className="table-responsive">
                                                    <Table className="table table-bordered mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>Sr. No.</th>
                                                                <th>Name</th>
                                                                <th>Balance Amt.</th>
                                                                <th>Under</th>
                                                                <th>Groups</th>
                                                                <th>Under (Custom)</th>
                                                                <th>Custom Groups</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ledgers_data.map((ledger_object, index) => {
                                                                return (
                                                                    <tr>
                                                                        <th scope="row">{index + 1}</th>
                                                                        <th>{ledger_object.name}</th>
                                                                        <td>Rs. {ledger_object.closing_balance}</td>
                                                                        <td> {ledger_object.under !== null && ledger_object.under.name } </td>
                                                                        <td> {ledger_object.groups !== null && 
                                                                            ledger_object.groups != null && ledger_object.groups.length > 0 ? ledger_object.groups.map((group) => {
                                                                                return (
                                                                                    <li>{group.name}</li>
                                                                                    )
                                                                                })
                                                                                : <></>
                                                                            }

                                                                        </td>
                                                                        <td> {ledger_object.custom_under !== null && ledger_object.custom_under.name } </td>
                                                                        <td> {ledger_object.custom_groups !== null && 
                                                                            ledger_object.custom_groups != null && ledger_object.custom_groups.length > 0 ? ledger_object.custom_groups.map((group) => {
                                                                                return (
                                                                                    <li>{group.name}</li>
                                                                                    )
                                                                                })
                                                                                : <></>
                                                                            }

                                                                        </td>
                                                                        <td>
                                                                            <Button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    this.setState({
                                                                                        "ledger_object_id" : ledger_object.id
                                                                                    }, () => {
                                                                                        this.handleShow1()
                                                                                    });
                                                                                }}>
                                                                                Multi-Update
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                            :
                            <p>No data available</p>
                      
                      
                      }

                    <Modal size="lg" show={this.state.show1} onHide={this.handleClose1}>
                        {loading2? <LoadingComponent/>:
                            <AvForm
                                className="form-horizontal"
                                onValidSubmit={ () => {
                                    var {ledger_object_id, custom_parent_group, custom_groups } = this.state;
                                    this.updateCustomGroup(ledger_object_id, custom_parent_group, custom_groups);
                                }
                            }
                            >
                                <Modal.Header >
                                    <Modal.Title>Multiple Groups</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <Row>
                                        <Col md={8}>
                                            <h5>Select Custom Under Group </h5>
                                            <Select value={selectedOption1} onChange={this.handleChange1} options={options} defaultValue={default_custom_parent_group}/>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col md={8}>
                                            <h5>Select Custom Group </h5>
                                            <Select isMulti value={selectedOption2} onChange={this.handleChange2} options={options} defaultValue={default_custom_groups}  />
                                        </Col>
                                    </Row>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="btn btn-rounded .w-lg btn-default" onClick={this.handleClose1}>
                                        Close
                                    </Button>
                                    <Button type="submit" className="btn btn-rounded .w-lg btn-success">
                                        Add
                                    </Button>
                                </Modal.Footer> 
                            </AvForm>
                            }
                        </Modal>
                    </Container>
                </div>
                }
            </React.Fragment>
        );
    }
}

export default TrialBalanceMapping;
