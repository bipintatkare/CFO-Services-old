import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { render } from 'react-dom';
// import 'react-cron-generator/dist/cron-builder.css'
import MeetingForm from './MeetingForm';
import MeetingDetails from './MeetingDetails';
import {
  Row, Col, Card, Button, CardTitle, Container, Input, Table
} from "reactstrap";

class Report extends Component {
  state = {
    loading: true
  }

  async componentDidMount() {
    // const baseUrl = 'http://localhost:8000';
    // fetch(baseUrl + `/mom/meeting/${this.props.match.params.meeting_id}` + '/')
    //     .then(res => {
    //         if (res.status > 400) {
    //             return console.log("Something went wrong")
    //         }
    //         return res.json()
    //     })
    //     .then(meeting => {
    //         console.log(meeting);
    //         return this.setState({
    //             meeting: meeting
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })



    // const url = "http://localhost:8000/mom/meeting/";
    // const response = await fetch(url);
    // const data = await response.json();
    // console.log(data)


    axios.get('http://localhost:8000/mom/meeting/')
      .then(response => {
        console.log(response)
      });
  }



  render() {
    return (
      <div className="page-content">
        {this.state.loading ? <div>Loading...</div> : null}
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card body>
                <CardTitle className="mt-0 text-center"><h3>Minutes of Meeting </h3></CardTitle>
                <br />
                <Row>
                  <Col md={3}>
                    <h5 style={{ textAlign: "center", marginLeft: "30px" }}>Title </h5> <br />
                    <p style={{ borderBottom: "1px solid #2a3042", marginLeft: "30px" }}>--Title--</p>
                  </Col>
                  <Col md={4}>
                    <h5 style={{ textAlign: "center" }}>Purpose of Meeting </h5> <br />
                    <p style={{ borderBottom: "1px solid #2a3042" }}>--Purpose--</p>
                  </Col>
                  <Col md={2}>
                    <h5 style={{ textAlign: "center" }}>Date </h5> <br />
                    <p style={{ borderBottom: "1px solid #2a3042" }}>--Date--</p>
                  </Col>

                  <Col md={2}>
                    <h5 style={{ textAlign: "center" }}>Thread </h5> <br />
                    <p style={{ borderBottom: "1px solid #2a3042" }}>--Thread--</p>
                  </Col>
                </Row>
                <br />
                <hr />
                <Table className="table table-bordered mb-0">
                  <thead>
                    <tr style={{ textAlign: "center" }}>
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
                      <td style={{ width: "22%" }}><p>Title</p></td>
                      <td style={{ width: "22%" }}>
                        <p>Organizer</p>
                      </td>
                      <td style={{ width: "22%" }}><p>Compleation Date</p></td>
                      <td style={{ width: "22%" }}><p>Remark</p></td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>


          </Row>


        </Container>
      </div>
    )
  }
}

export default Report;