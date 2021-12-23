import React, { Component } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col, Table, Button, Label, Input, ListGroup } from "reactstrap";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import cookie from "react-cookies";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Select from 'react-select';

class AddReportsNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show1: false,
            show2: false,
            modal_large: false,
            groups: [],
            companies: [],
            notes: [],
            reports: [],
            options: [],
            options2: [],
            selected_notes: [],
            selected_groups: [],
            is_updating: false,
            item: {
                id: "dummy"
            },
        };
        this.tog_large = this.tog_large.bind(this);
        this.handleNoteSubmit = this.handleNoteSubmit.bind(this);
        this.handleReportSubmit = this.handleReportSubmit.bind(this);
    }

    syncNotes() {
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/reporting/notes/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(notes => {
                const options2 = notes.map((note) => {
                    return {
                        "value": note.id,
                        "label" :  note.name
                    }
                })
                this.setState({
                    notes: notes,
                    options2: options2
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    syncReports() {
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/reporting/reports/')
        .then(res => {
            if (res.status > 400) {
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(reports => {
            this.setState({
                reports: reports,
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    componentDidMount() {
        this.syncNotes();
        this.syncReports();
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

        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/tl/cgroups/')
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(groups => {
                const options = groups.map((group) => {
                    return {
                        "value": group.id,
                        "label" :  group.name
                    }
                })
                this.setState({
                    groups: groups,
                    options: options
                })
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

    handleNoteSubmit(event, values) {
        values.custom_group_ids = this.state.selected_groups
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
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/reporting/note/${this.state.item.id}/`, requestOptions)
                .then(res => res.json())
                .then(data => {
                     const note_list = this.state.notes.map((note) => {
                         if (note.id === data.id) {
                             const updatedItem = {
                                 ...note,
                                 name: data.name,
                                 company_id: data.company_id,
                                 custom_group_ids: data.custom_group_ids
                             }
                             console.log(updatedItem);
                             return updatedItem;
                         }
                         return note;
                     })
                     this.setState({
                         notes: note_list
                     })
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/reporting/note/${this.state.item.id}/`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        notes: [...this.state.notes, data]
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }
        this.handleClose1();
        this.syncNotes();
    };

    handleReportSubmit(event, values) {
        values.note_ids = this.state.selected_notes
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
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/reporting/report/${this.state.item.id}/`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const report_list = this.state.reports.map((report) => {
                         if (report.id === data.id) {
                             const updatedItem = {
                                 ...report,
                                 name: data.name,
                                 company_id: data.company_id,
                                 note_ids: data.note_ids
                             }
                             return updatedItem;
                         }
                         return report;
                     })
                    this.setState({
                        reports: report_list
                    })
                })
                .catch(err => {
                    console.log(err);
                })

            this.setState({
                is_updating: false,
            })
        } else {
            fetch(process.env.REACT_APP_BASEURL_BACKEND + `/reporting/report/${this.state.item.id}/`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.setState({
                        reports: [...this.state.reports, data]
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }
        this.handleClose2();
        this.syncReports();
    }

     onDeleteReport(report_id, index) {
         console.log("In side onDeleteReport()")
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
         fetch(process.env.REACT_APP_BASEURL_BACKEND + `/reporting/report/${report_id}/`, requestOptions)
             .then(res => {
                 if (res.status > 400) {
                     console.log('Something went wrong')
                 }
                 this.setState({
                     reports: this.state.reports.filter((report) => {
                         return report.id !== report_id
                     })
                 })
             })
             .catch(err => {
                 console.log(err);
             })
     }

     onDeleteNote(note_id, index) {
         console.log("In side onDeleteNote()")
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
         fetch(process.env.REACT_APP_BASEURL_BACKEND + `/reporting/note/${note_id}/`, requestOptions)
             .then(res => {
                 if (res.status > 400) {
                     console.log('Something went wrong')
                 }
                 this.setState({
                     notes: this.state.notes.filter((note) => {
                         return note.id !== note_id
                     })
                 })
             })
             .catch(err => {
                 console.log(err);
             })
     }


    handleClose1 = () => this.setState({ show1: false,
        item: {
            id: "dummy",
            name: null,
            company: null,
            default_selected_notes: []
        },
        is_updating: false
    });
    handleShow1 = () => this.setState({ show1: true });

    handleClose2 = () => this.setState({ show2: false,
        item: {
            id: "dummy",
            name: null,
            company: null,
            default_selected_groups: []
        },
        is_updating: false
    });
    handleShow2 = () => this.setState({ show2: true });

    handleChange1 = selectedOption1 => { 
        const selected_groups = selectedOption1 !== null && selectedOption1 !== undefined ? 
            selectedOption1.map((g) => {return g.value}) : selectedOption1
        this.setState({
            selected_groups: selected_groups,
        }, () => {
            console.log(this.state.selected_groups);
        });
    };

    handleChange2 = selectedOption2 => {
        const selected_notes = selectedOption2 !== null && selectedOption2 !== undefined ? 
            selectedOption2.map((note) => {return note.value}) : selectedOption2

        this.setState({
            selected_notes: selected_notes,
        });
    };

    render() {
        const { notes, reports, companies, selectedOption1, selectedOption2, options, options2 } = this.state
        return (
            <React.Fragment>

                <Modal size="lg" show={this.state.show1} onHide={this.handleClose1}>
                    <AvForm
                        className="form-horizontal"
                        onValidSubmit={this.handleNoteSubmit}
                    >
                        <Modal.Header >
                            <Modal.Title>Add Note</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="form-group">
                                <AvField
                                    name="name"
                                    label="Note Name"
                                    className="form-control"
                                    placeholder="Enter Note Name"
                                    type="text"
                                     defaultValue={(this.state.item !== undefined && this.state.item !== null) ? this.state.item.name : ""}
                                    required
                                />

                                <AvField
                                    name="company_id"
                                    label="Company"
                                    placeholder="Select Company"
                                    className="form-control"
                                    type="select"
                                    defaultValue={(this.state.item !== undefined && this.state.item !== null) ?
                                        (this.state.item.company !== null) ? this.state.item.company : ""
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
                                <h5>Select Groups</h5>
                                  <Select
                                  isMulti
                                  value={selectedOption1}
                                  onChange={this.handleChange1}
                                  options={options}
                                  defaultValue={(this.state.item !== undefined && this.state.item !== null) ?
                                        (this.state.item.default_selected_groups !== null) ? this.state.item.default_selected_groups : []
                                        :
                                        []
                                        }
                                  />
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
                        onValidSubmit={this.handleReportSubmit}
                    >
                        <Modal.Header >
                            <Modal.Title>Add Report</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="form-group">
                                <AvField
                                    name="name"
                                    label="Report Name"
                                    className="form-control"
                                    placeholder="Enter Report Name"
                                    type="text"
                                     defaultValue={(this.state.item !== undefined && this.state.item !== null) ? this.state.item.name : ""}
                                    required
                                />
                                <AvField
                                    name="company_id"
                                    label="Company"
                                    placeholder="Select Company"
                                    className="form-control"
                                    type="select"
                                    defaultValue={(this.state.item !== undefined && this.state.item !== null) ?
                                        (this.state.item.company !== null) ? this.state.item.company : ""
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
                                <h5>Select Notes</h5>
                                <Select
                                isMulti
                                value={selectedOption2}
                                onChange={this.handleChange2}
                                options={options2}
                                defaultValue={(this.state.item !== undefined && this.state.item !== null) ?
                                        (this.state.item.default_selected_notes !== null) ? this.state.item.default_selected_notes : []
                                        :
                                        []
                                    }
                                />
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
                        <center><h2> Reports and Notes </h2></center>
                        <br />
                        <div>
                            <Row>
                                <Col md="6">
                                    <Card>
                                        <CardBody>
                                            <CardTitle> Notes </CardTitle>
                                            <br />
                                            <div className="table-responsive">
                                                <Table className="table table-bordered mb-0">

                                                    <thead>

                                                        <tr>
                                                            <th>Sr. No.</th>
                                                            <th>Name</th>
                                                            <th>Groups</th>
                                                            <th colspan="2" className="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {notes != null ?
                                                            notes.map((note, index) => {
                                                                return (
                                                                    <tr>
                                                                        <th scope="row">{index + 1}</th>
                                                                        <td>{note.name}</td>
                                                                        <td>
                                                                            <ListGroup>
                                                                            {note.custom_groups != null && note.custom_groups
                                                                                .map((group_obj) => {
                                                                                    return (
                                                                                        <li>{group_obj.name}</li>
                                                                                    )
                                                                                })
                                                                            }
                                                                            </ListGroup>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={
                                                                                    () => {
                                                                                        this.setState({
                                                                                            item: {
                                                                                                id: note.id,
                                                                                                name: note.name,
                                                                                                company: note.company,
                                                                                                default_selected_groups: note.custom_groups.map((group) => { return {"value":group.id , "label": group.name }})
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
                                                                                onClick={() => this.onDeleteNote(note.id, index)}
                                                                            >
                                                                                <i class="bx bx-trash-alt"></i> Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <p>No Notes</p>
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

                                <Col md="6">
                                    <Card>
                                        <CardBody>
                                            <CardTitle> Reports </CardTitle>
                                            <br />
                                            <div className="table-responsive">
                                                <Table className="table table-bordered mb-0">

                                                    <thead>

                                                        <tr>
                                                            <th>Sr. No.</th>
                                                            <th>Name</th>
                                                            <th>Notes</th>
                                                            <th colspan="2" className="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reports != null ?
                                                            reports.map((report, index) => {
                                                                return (
                                                                    <tr>
                                                                        <th scope="row">{index + 1}</th>
                                                                        <td>{report.name}</td>
                                                                        <td>
                                                                            <ListGroup>
                                                                            {report.notes != null && report.notes
                                                                                .map((note_obj) => {
                                                                                    return (
                                                                                        <li>{note_obj.name}</li>
                                                                                    )
                                                                                })
                                                                            }
                                                                            </ListGroup>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={
                                                                                    () => {
                                                                                        this.setState({
                                                                                            item: {
                                                                                                id: report.id,
                                                                                                name: report.name,
                                                                                                company: report.company,
                                                                                                default_selected_notes: report.notes.map((note) =>{ return { "value": note.id, "label": note.name}})
                                                                                            },
                                                                                            is_updating: true
                                                                                        }, () => {
                                                                                            console.log(this.state.item);
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
                                                                                onClick={() => this.onDeleteReport(report.id, index)}
                                                                            >
                                                                                <i class="bx bx-trash-alt" ></i> Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <p>No Reports</p>
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

export default AddReportsNotes;