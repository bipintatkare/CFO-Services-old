import React, { Component } from 'react';
import {
  Row, Col, Button, Table, Form, Input
} from "reactstrap";
import { parseDate } from './utils'
import LoadingComponent from '../Dashboard/loadingComponent';


const TableCss = {
  border: "1px solid black"
}

class MOMPerticular extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rows: [],
      rows1: []
    }
  }

  componentDidMount() {
    if (this.props.meeting_id !== undefined) {
      // Update Perticular
      fetch(process.env.REACT_APP_BASEURL_BACKEND + `/mom/meeting/${this.props.meeting_id}` + '/')
        .then(res => {
          if (res.status > 400) {
            return console.log("Something went wrong")
          }
          return res.json()
        })
        .then(meeting => {
          // Parse perticulars from meeting
          let perticulars = meeting.perticular.map((per) => {
            return {
              "id": per.id,
              "title": per.title,
              "organizer": per.organizer,
              "organizer_name": per.organizer_name,
              "completion_date": parseDate(per.completion_date),
              "remark": per.remark
            }
          })

          return this.setState({
            rows: perticulars,
            option: [...meeting.attendee],
            loading: false
          });
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  sendDataToParentComponent() {
    this.props.handleData(this.state.rows);
  }

  handleChange = (e) => {
    console.log('e.target', e.target)
    return this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleAddRow = (e) => {
    const org_id =  this.state.new_organizer;
    var organizer = this.state.option.filter(function(e) {
      return e.attendee.id == org_id;
    })[0]
    const item = {
      "title": this.state.new_title,
      "organizer": this.state.new_organizer,
      "completion_date": this.state.new_completion_date,
      "remark": this.state.new_remark,
      "organizer_name":  organizer.attendee.first_name +" "+organizer.attendee.last_name,
    };
    this.setState({
      rows: [...this.state.rows, item],
      [e.target.name]: e.target.value
    },
      () => {
        this.sendDataToParentComponent()
      }
    );

    this.setState({
      new_title: "",
      new_organizer: "",
      new_completion_date: "",
      new_remark: ""
    })
  };


  handleRemoveRow = (e, idx) => {
    if (typeof (idx) != "undefined")
      document.getElementById("addr" + idx).style.display = "none";

    this.sendDataToParentComponent()
  };




  render() {
    const { option } = this.state

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
                                <Col
                                  lg="11"
                                  className="form-group align-self-center"
                                >

                                  <Table className="table table-bordered mb-0">
                                    <thead>
                                      <tr>
                                        <th style={{ width: "10%" }}>Sr. No.</th>
                                        <th style={{ width: "22%" }}>Perticulars</th>
                                        <th style={{ width: "22%" }}>Owner</th>
                                        <th style={{ width: "22%" }}>Action Completion Date</th>
                                        <th style={{ width: "22%" }}>Remark</th>
                                      </tr>
                                    </thead>
                                    <br />
                                    <tbody>
                                      <tr>
                                        <th scope="row" style={{ width: "10%" }}>1</th>
                                        <td style={{ width: "22%" }}><Input type="text" value={this.state.new_title} name="new_title" onChange={this.handleChange.bind(this)} placeholder="Enter Perticulars here" /></td>
                                        <td style={{ width: "22%" }}>
                                          <Input
                                            name="new_organizer"
                                            placeholder="Select Organizer Name"
                                            onChange={this.handleChange.bind(this)}
                                            value={this.state.new_organizer}
                                            type="select"
                                            className="form-control"
                                          >
                                            <option value="" selected>Choose Organizer/Attendee</option>
                                            {option != null && option.length > 0 ? option.map((option, index) => {
                                              return (
                                                <option value={option.attendee.id}>
                                                  {option.attendee.first_name} {option.attendee.last_name} {option.attendee.is_organizer ? "(Organizer)" : ""}
                                                </option>
                                              )
                                            }) :
                                              console.log("No users")
                                            }

                                          </Input>
                                        </td>
                                        <td style={{ width: "22%" }}><Input type="date" value={this.state.new_completion_date} name="new_completion_date" onChange={this.handleChange.bind(this)} placeholder="Enter Action Completion Date here" /></td>
                                        <td style={{ width: "22%" }}><Input type="text" value={this.state.new_remark} name="new_remark" onChange={this.handleChange.bind(this)} placeholder="Enter Remark here" /></td>
                                      </tr>
                                    </tbody>
                                  </Table>

                                </Col>
                              </Row>
                            </div>
                          </Form>
                        </td>
                      </tr>

                      {this.state.rows.map((item, idx) => (
                        <tr id={"addr" + idx} key={idx}>
                          <td>
                            <Form
                              className="repeater"
                              encType="multipart/form-data"
                            >
                              <div data-repeater-list="group-a">
                                <Row data-repeater-item>
                                  <Col
                                    lg="11"
                                    className="form-group align-self-center"
                                  >

                                    <Table className="table table-bordered mb-0">
                                      <tbody>
                                        <tr>
                                          <th scope="row" style={{ width: "10%" }}>{idx + 2}</th>
                                          <td style={{ width: "22%" }}><Input value={item.title} type="text" placeholder="Enter Perticulars here" /></td>
                                          <td style={{ width: "22%" }}><Input value={item.organizer_name} type="text" placeholder="Enter Owner name here" /></td>
                                          <td style={{ width: "22%" }}><Input value={item.completion_date} type="date" placeholder="Enter Action Completion Date here" /></td>
                                          <td style={{ width: "22%" }}><Input value={item.remark} type="text" placeholder="Enter Remark here" /></td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  </Col>

                                  <Col
                                    lg="1"
                                    className="form-group align-self-center"
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
                  <Button onClick={this.handleAddRow} color="primary" className="btn">
                    Add{" "}
                  </Button>{" "}
                  {/* <Button className="btn btn-success" onClick={this.handleUpdate.bind(this)}> Update </Button> */}
                  {/* <Button className="btn btn-success" > Update Particular {" "} </Button>{" "} */}

                </Col>
              </Row>

            </div>
          </Col>

        </Row>

      </React.Fragment>
    );
  }
}

export default MOMPerticular;