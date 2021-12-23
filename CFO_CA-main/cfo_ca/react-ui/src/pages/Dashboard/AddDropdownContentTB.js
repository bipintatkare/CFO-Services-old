import React, { Component } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col, Table, Button, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import cookie from "react-cookies";
import { AvForm, AvField } from 'availity-reactstrap-validation';

class AddDropdownContentTB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show1: false,
            show2: false,
            modal_large: false,
            groups: [],
            companies: [],
            is_updating: false,
            item_group: {
                id: "dummy"
            },
        };
        this.tog_large = this.tog_large.bind(this);
        this.handleParentGroupSubmit = this.handleParentGroupSubmit.bind(this);
        this.handleGroupSubmit = this.handleGroupSubmit.bind(this);
    }

    syncGroups() {
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/tl/cgroups/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(groups => {
                this.setState({
                    groups: groups,
                })
            })
            .catch(err => {
                console.log(err);
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

    removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    tog_large() {
        this.setState(prevState => ({
            modal_large: !prevState.modal_large
        }));
        this.removeBodyCss();
    }
    show() {
        this.setState({ visible: true });
    }
    hide() {
        this.setState({ visible: false });
    }

    handleParentGroupSubmit(event, values) {
        const token = cookie.load("token")
        const csrf = cookie.load("csrftoken")
        const requestOptions = {
            method: this.state.is_updating ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
            },
            body: JSON.stringify(values)
        };

        if (this.state.is_updating) {
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/tl/cgroup/${this.state.item_group.id}/`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    const p_group_list = this.state.groups.map((pgroup) => {
                        if (pgroup.id === data.id) {
                            const updatedItem = {
                                ...pgroup,
                                name: data.name,
                                company_id: data.company_id
                            }
                            console.log(updatedItem);
                            return updatedItem;
                        }
                        return pgroup;
                    })
                    this.setState({
                        groups: p_group_list
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            this.setState({
                is_updating: false,
                item_group: {
                    id: "dummy"
                }
            })
        } else {
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/tl/cgroup/${this.state.item_group.id}/`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    this.setState({
                        groups: [...this.state.groups, data]
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }
        this.handleClose1();
    };

    handleGroupSubmit(event, values) {
        const token = cookie.load("token")
        const csrf = cookie.load("csrftoken")
        const requestOptions = {
            method: this.state.is_updating ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
            },
            body: JSON.stringify(values)
        };

        if (this.state.is_updating) {
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/tl/cgroup/${this.state.item_group.id}/`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const group_list = this.state.groups.map((group) => {
                        if (group.id === data.id) {
                            const updatedItem = {
                                ...group,
                                name: data.name,
                                under: data.under,
                                company_id: data.company_id
                            }
                            return updatedItem;
                        }
                        return group;
                    })
                    this.setState({
                        groups: group_list
                    })
                })
                .catch(err => {
                    console.log(err);
                })

            this.setState({
                is_updating: false,
                item_group: {
                    id: "dummy"
                }
            })
        } else {
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/tl/cgroup/${this.state.item_group.id}/`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.setState({
                        groups: [...this.state.groups, data]
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }
        this.handleClose2();
    }

    onDeleteGroup(group_id, index) {
        console.log("In side onDeleteGroup()")
        const token = cookie.load("token")
        const csrf = cookie.load("csrftoken")
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
            }
        };
        fetch(process.env.REACT_APP_BASEURL_BACKEND + `/tl/cgroup/${group_id}`, requestOptions)
            .then(res => {
                if (res.status > 400) {
                    console.log('Something went wrong')
                }
                console.log("Group deleted successfully");
                this.setState({
                    groups: this.state.groups.filter((group) => {
                        return group.id !== group_id
                    })
                })
            })
            .catch(err => {
                console.log(err);
            })
    }


    handleClose1 = () => this.setState({ show1: false });
    handleShow1 = () => this.setState({ show1: true });

    handleClose2 = () => this.setState({ show2: false });
    handleShow2 = () => this.setState({ show2: true });

    render() {
        const { groups, companies } = this.state
        return (
            <React.Fragment>

                <Modal size="lg" show={this.state.show1} onHide={this.handleClose1}>
                    <AvForm
                        className="form-horizontal"
                        onValidSubmit={this.handleParentGroupSubmit}
                    >
                        <Modal.Header >
                            <Modal.Title>Add Primary Group</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="form-group">
                                <AvField
                                    name="name"
                                    label="Parent Group Name"
                                    className="form-control"
                                    placeholder="Enter Parent Group Name"
                                    type="text"
                                    defaultValue={(this.state.item_group !== undefined && this.state.item_group !== null) ? this.state.item_group.name : ""}
                                    required
                                />
                                <AvField
                                    name="company_id"
                                    label="Company"
                                    placeholder="Select Company"
                                    className="form-control"
                                    type="select"
                                    defaultValue={(this.state.item_group !== undefined && this.state.item_group !== null) ?
                                        (this.state.item_group.company !== null) ? this.state.item_group.company : ""
                                        :
                                        ""
                                    }
                                    required
                                >
                                    <option value="">Select Company</option>
                                    {companies !== null && companies.length > 0 &&
                                        companies.map((company) => {
                                            return (
                                                <option value={company.id}>
                                                    {company.company_name}
                                                </option>
                                            )
                                        })
                                    }
                                </AvField>
                            </div>
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
                </Modal>

                <Modal size="lg" show={this.state.show2} onHide={this.handleClose2}>
                    <AvForm
                        className="form-horizontal"
                        onValidSubmit={this.handleGroupSubmit}
                    >
                        <Modal.Header >
                            <Modal.Title>Add Secondary Group</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="form-group">
                                <AvField
                                    name="name"
                                    label="Custom Group Name"
                                    className="form-control"
                                    placeholder="Enter Group Name"
                                    type="text"
                                    defaultValue={(this.state.item_group !== undefined && this.state.item_group !== null) ? this.state.item_group.name : ""}
                                    required
                                />

                                <AvField
                                    name="under"
                                    label="Parent Group"
                                    placeholder="Select Parent Group"
                                    className="form-control"
                                    type="select"
                                    defaultValue={(this.state.item_group !== undefined && this.state.item_group !== null) ?
                                        (this.state.item_group.under !== null) ? this.state.item_group.under : ""
                                        :
                                        ""
                                    }
                                    required
                                >
                                    <option value="">Select Parent Group</option>
                                    {groups !== null &&
                                        groups.map((pgroup) => {
                                            return (
                                                <option value={pgroup.id}>
                                                    {pgroup.name}
                                                </option>
                                            )
                                        })
                                    }
                                </AvField>
                                <AvField
                                    name="company_id"
                                    label="Company"
                                    placeholder="Select Company"
                                    className="form-control"
                                    type="select"
                                    defaultValue={(this.state.item_group !== undefined && this.state.item_group !== null) ?
                                        (this.state.item_group.company !== null) ? this.state.item_group.company : ""
                                        :
                                        ""
                                    }
                                    required
                                >
                                    <option value="">Select Company</option>
                                    {companies !== null && companies.length > 0 &&
                                        companies.map((company) => {
                                            return (
                                                <option value={company.id}>
                                                    {company.company_name}
                                                </option>
                                            )
                                        })
                                    }
                                </AvField>
                            </div>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button className="btn btn-rounded .w-lg btn-default" onClick={this.handleClose2}>
                                Close
                            </Button>
                            <Button type="submit" className="btn btn-rounded .w-lg btn-success">
                                Add
                            </Button>
                        </Modal.Footer>
                    </AvForm>
                </Modal>

                <div className="page-content">
                    <Container fluid>
                        <center><h2> Custom Primary/Secondary Group </h2></center>
                        <br />
                        <div>
                            <Row>
                                <Col md="5">
                                    <Card>
                                        <CardBody>
                                            <CardTitle> Primary Group </CardTitle>
                                            <br />
                                            <div className="table-responsive">
                                                <Table className="table table-bordered mb-0">

                                                    <thead>

                                                        <tr>
                                                            <th>Sr. No.</th>
                                                            <th>Name</th>
                                                            <th>Company</th>
                                                            <th colspan="2" className="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groups != null ?
                                                            groups
                                                            .filter((pgroup) => {
                                                                return !(pgroup.under !== undefined && pgroup.under !== null)
                                                            })
                                                            .map((pgroup, index) => {
                                                                return (
                                                                    <tr>
                                                                        <th scope="row">{index + 1}</th>
                                                                        <td>{pgroup.name}</td>
                                                                        <td>{pgroup.company.company_name}</td>
                                                                        <td className="text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={
                                                                                    () => {
                                                                                        this.setState({
                                                                                            item_group: {
                                                                                                id: pgroup.id,
                                                                                                name: pgroup.name,
                                                                                                company: pgroup.company.id
                                                                                            },
                                                                                            is_updating: true

                                                                                        }, () => {
                                                                                            console.log(this.state)
                                                                                            this.handleShow1()
                                                                                        })
                                                                                    }
                                                                                }
                                                                                className="btn btn-success waves-effect waves-light">
                                                                                <i class="bx bx-edit-alt"></i> Edit
                                                                            </button>

                                                                        </td>

                                                                        <td className="text-center">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-danger waves-effect waves-light"
                                                                                onClick={() => this.onDeleteGroup(pgroup.id, index)}
                                                                            >
                                                                                <i class="bx bx-trash-alt"></i> Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <p>No Custom Parent Groups</p>
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <button
                                        type="button"
                                        className="col-md-2 btn btn-primary waves-effect waves-light"
                                        onClick={this.handleShow1}>
                                        Add
                                        </button>
                                </Col>

                                <Col md="7">
                                    <Card>
                                        <CardBody>
                                            <CardTitle> Secondary Group </CardTitle>
                                            <br />
                                            <div className="table-responsive">
                                                <Table className="table table-bordered mb-0">

                                                    <thead>

                                                        <tr>
                                                            <th>Sr. No.</th>
                                                            <th>Name</th>
                                                            <th>Under</th>
                                                            <th>Company</th>
                                                            <th colspan="2" className="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groups != null ?
                                                            groups
                                                            .filter((sgroup) => {
                                                                return (sgroup.under !== undefined && sgroup.under !== null)
                                                            })
                                                            .map((sgroup, index) => {
                                                                return (
                                                                    <tr>
                                                                        <th scope="row">{index + 1}</th>
                                                                        <td>{sgroup.name}</td>
                                                                        <td>{(sgroup.under !== undefined && sgroup.under !== null) ? sgroup.under.name : ""}</td>
                                                                        <td>{sgroup.company.company_name}</td>
                                                                        <td className="text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={
                                                                                    () => {
                                                                                        const under = (sgroup.under !== undefined && sgroup.under !== null) ? sgroup.under.id : ""
                                                                                        this.setState({
                                                                                            item_group: {
                                                                                                id: sgroup.id,
                                                                                                name: sgroup.name,
                                                                                                under: under,
                                                                                                company: sgroup.company.id

                                                                                            },
                                                                                            is_updating: true
                                                                                        }, () => {
                                                                                            console.log(this.state.item_group);
                                                                                            this.handleShow2()
                                                                                        })
                                                                                    }
                                                                                }
                                                                                className="btn btn-success waves-effect waves-light"
                                                                            >
                                                                                <i class="bx bx-edit-alt"></i> Edit
                                                                            </button>

                                                                        </td>

                                                                        <td className="text-center">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-danger waves-effect waves-light"
                                                                                onClick={() => this.onDeleteGroup(sgroup.id, index)}
                                                                            >
                                                                                <i class="bx bx-trash-alt" ></i> Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <p>No Custom Groups</p>
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <button
                                        type="button"
                                        className="col-md-2 btn btn-primary waves-effect waves-light"
                                        onClick={this.handleShow2}
                                    >
                                        Add
                                    </button>
                                </Col>

                            </Row>
                        </div>
                    </Container>
                </div>

            </React.Fragment>
        );
    }
}

export default AddDropdownContentTB;