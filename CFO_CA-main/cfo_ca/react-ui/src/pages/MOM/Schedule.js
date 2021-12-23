import React, { Component } from "react";
import { withRouter } from 'react-router';
import {
  Row, Col, Button, Table, Form, Input, Label
} from "reactstrap";
import Modal from 'react-bootstrap/Modal'

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      show: false,
      rows: [],
      days_array: [],
      timeStamp:[],
      start_time: null,
      end_time: null,
      is_recurring: true,
      on_datetime: ""
    };
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
          if (this.props.remindersData == true) {
            let reminders = meeting.reminders.map((rmd) => {
              return {
                "title": rmd.title,
                "days_array":rmd.days_array,
                "timeStamp":rmd.timeStamp
              }
            })
            return this.setState({
              rows: reminders,
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  handleClose = () => this.setState({ show: false })
  handleShow = () => this.setState({ show: true })

  
  handleAddSchedule = (e) => {

    var time = this.state.timeStamp;
    var start_time = this.state.start_time;
    var on_datetime = this.state.on_datetime;
    var days_array = this.state.days_array.toString();

    var time_array = time.split(":");
    var date_array = on_datetime.split("-");

    console.log(date_array);

    var hour = time_array[0] || "*"
    var minute = time_array[1] || "*"
    var day_of_month = date_array[2] || "*"
    var month_of_year = date_array[1] || "*"
    var year = date_array[0] || "*"

    var days_array = days_array === "" ? "*" : days_array;
    var cron = minute+" "+hour+" "+days_array+" "+day_of_month+" "+month_of_year;
    console.log(cron);
    const item = {
      "title": this.state.title,
      "cron": cron,
      "days_array": this.state.days_array,
      "timeStamp":this.state.timeStamp,
      "start_time": this.state.start_time,
      "end_time": this.state.end_time,
      "is_recurring": this.state.is_recurring,
      "on_datetime": this.state.on_datetime
    };
    
    this.setState({
      rows: [...this.state.rows, item ],
    },
        () => {
         this.sendDataToParentComponent()
        }

    );

    this.state.title = "";
    this.state.days_array=[];
    this.state.timeStamp=[];
    this.start_time = null;
    this.end_time = null;

    this.setState({show:false})
  };        

  handleChange = (e) => {
    return this.setState({
      [e.target.name]: e.target.value
    })
  }

  sendDataToParentComponent(e) {
    console.log(this.state.rows);
    this.props.handleData(this.state.rows);
  }

  handleCheckbox(e) {
    console.log(e.target.name);
    this.setState({
      [e.target.name]: e.target.value,
    },
      () => {
        console.log(this.state);
      })
    if (e.target.checked) {
      this.setState({
        days_array: this.state.days_array.concat([e.target.name]),
      })
    } 
    
    this.setState({
      [this.timeStamp]: e.target.value
    })
  }

  handleIsRecurring(e) {
    console.log(e.target.checked)
    this.setState({
      is_recurring: e.target.checked
    })
  }


  render() {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-primary" onClick={this.handleShow}>Schedule</button>
        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>

          <Modal.Header >
            <Modal.Title>Schedule</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Col>
            <Row>
              {/* <Col md={12}
                className="form-group align-self-center">
                  <label style={{ fontSize: "15px" }} className="col-sm-2 col-form-label">Title</label>
                  <Input className="col-sm-10" type="text" value={this.state.title} name="title"
                  onChange={this.handleCheckbox.bind(this)} placeholder="Enter Your Remark" />
              </Col> */}
              <Col md={6}>
                  <div class="ml-3">
                    <Input className="form-check-input" type="checkbox" name="is_recurring" id="is_recurring" defaultChecked={this.state.is_recurring} value={this.state.is_recurring} onChange={e => this.handleIsRecurring(e)}></Input>
                    <label class="col-form-label" for="is_recurring">Is Recurring</label>
                  </div>
              </Col>
              <Col md={6}>
                  <div>
                      <label htmlFor="example-time-input" className="col-md-3 col-form-label">Time</label>
                      <div className="col-md-12">
                        <Input name="timeStamp" className="form-control" value={this.timeStamp} type="time" id="example-time-input" onChange={e => this.handleCheckbox(e)} required/>
                      </div>
                      
                  </div>
              </Col>
            </Row>
            {this.state.is_recurring &&
              <Row>
                <label className="col-sm-2 col-form-label">Schedule</label>
                <div className="col-sm-10">
                  <div className="row form-group">
                    <div className="form-check mr-5">
                      <Input type="checkbox" name="MON" className="form-check-input"  id="exampleCheck1" value={this.monday} onChange={e => this.handleCheckbox(e)} />
                      <Label class="form-check-label" for="exampleCheck1">Monday</Label>                    
                    <br/>
                      <Input type="checkbox" name="TUE" className="form-check-input" id="exampleCheck2" value={this.tuesday} onChange={e => this.handleCheckbox(e)} />
                      <Label class="form-check-label" for="exampleCheck2">Tuesday</Label>
                    <br/>
                      <Input type="checkbox" name="WED" className="form-check-input" id="exampleCheck3" value={this.wednesday} onChange={e => this.handleCheckbox(e)} />
                      <Label class="form-check-label" for="exampleCheck3">Wednesday</Label>
                    <br/>
                      <Input type="checkbox" name="THU" className="form-check-input" id="exampleCheck4" value={this.thursday} onChange={e => this.handleCheckbox(e)} />
                      <Label class="form-check-label" for="exampleCheck4">Thursday</Label>
                    </div>
                    <div className="form-check">
                      <Input type="checkbox" name="FRI" className="form-check-input" id="exampleCheck5" value={this.friday} onChange={e => this.handleCheckbox(e)} />
                      <Label class="form-check-label" for="exampleCheck5">Friday</Label>
                    <br/>
                      <Input type="checkbox" name="SAT" className="form-check-input" id="exampleCheck6" value={this.saturday} onChange={e => this.handleCheckbox(e)} />
                      <Label class="form-check-label" for="exampleCheck6">Saturday</Label>
                    <br/>
                      <Input type="checkbox" name="SUN" className="form-check-input" id="exampleCheck7" value={this.sunday} onChange={e => this.handleCheckbox(e)} />
                      <Label class="form-check-label" for="exampleCheck7">Sunday</Label>
                    <br/>
                      <Input type="checkbox" name="Daily" className="form-check-input" id="exampleCheck8" value={this.daily} onChange={e => this.handleCheckbox(e)} />
                      <Label class="form-check-label" for="exampleCheck8">Daily</Label>
                    </div>
                  </div>
                </div>
              </Row>
            }
            
            <Row>
                {!this.state.is_recurring &&
                  <Col md={5}>
                    <label className="col-form-label">Schedule On Date</label>
                    <div>
                      <Input
                        name="on_datetime"
                        type="Date"
                        value={this.state.on_datetime}
                        onChange={this.handleChange.bind(this)}
                        />
                      </div>
                  </Col>
                }
              </Row>
              <Row>
                <Col md={6}>
                  <label className="col-form-label">From Date</label>
                  <div>
                    <Input
                      name="start_time"
                      type="Date"
                      value={this.state.start_time}
                      onChange={this.handleChange.bind(this)}
                      required
                      />
                    </div>
                </Col>
                <Col md={6}>
                  <label className="col-form-label">To Date</label>
                  <div >
                    <Input
                      name="end_time"
                      type="Date"
                      value={this.state.end_time}
                      onChange={this.handleChange.bind(this)}
                      required
                      />
                    </div>
                </Col>
              </Row>
            </Col>
          </Modal.Body>

          <Modal.Footer>
            <Button className="btn btn-rounded .w-lg btn-default" onClick={this.handleClose}>
              Close
            </Button>
            <Button className="btn btn-rounded .w-lg btn-success" onClick={this.handleAddSchedule}>
              Add{" "}
            </Button>{" "}
          </Modal.Footer>

            <h4 className="ml-3">List of Reminders</h4>
          <Modal.Body>
            <Col className="row">
            {this.state.rows.map((item, idx) => (
           <div style={{padding:"5px"}}>
             <p style={{textAlign: "center", lineHeight: "1.5", wordBreak: "break-word", fontSize: "15px", margin: "0"}}>
               {idx + 1}. &nbsp; <b>{item.title}</b> &nbsp; is scheduled on &nbsp;<b>{item.days_array}</b>&nbsp; at <b>{item.start_time}, {item.timeStamp}</b></p>
              </div>
            ))}
            </Col>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}


export default withRouter(Schedule);
