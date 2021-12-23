import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import cookie from "react-cookies"


//Simple bar
import SimpleBar from "simplebar-react";

const styles = {
  StyleSheet: {
    fieldSet: {
      margin: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      alignItems: 'center',
      borderColor: '#000'
    },
    legend: {
      position: 'absolute',
      top: -10,
      left: 10,
      fontWeight: 'bold',
      backgroundColor: '#FFFFFF'
    }
  }
};


class Add_manager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      work: {},
      companies: [],
      site_users_list: []
    }
  }

  loadSiteUsers() {
    const token = cookie.load("token")
    const csrf = cookie.load("csrftoken")

    const lookups = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        "Authorization": `token ${token}`
      }
    }

    fetch(process.env.REACT_APP_BASEURL_BACKEND + "/api/v1/site_users_list", lookups)
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

  loadCompanies() {
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

  componentDidMount() {
    this.loadCompanies()
    this.loadSiteUsers()
  }

  handleProfileChange = (e) => {
    return this.setState({
      profile: {
        ...this.state.profile,
        [e.target.name]: e.target.value,
      }
    })
  }

  onSubmitProfile = (e) => {
    const token = cookie.load("token")
    const csrf = cookie.load("csrftoken")
    var { profile } = this.state;

    const lookups = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        "Authorization": `token ${token}`,
      },
      "body": JSON.stringify(profile)
    }  
    console.log(lookups);

    fetch(process.env.REACT_APP_BASEURL_BACKEND + "/api/v1/site_user/dummy/", lookups)
      .then(res => {
        if (res.status > 400) {
          return console.log("Something went wrong")
        }
        return res.json()
      })
      .then(res => {
        console.log("response", res)
      })
      .catch(err => {
        console.log(err)
      })

      this.setState({
        profile: {}
      })
  }

  handleWorkChange = (e) => {
    return this.setState({
      work: {
        ...this.state.work,
        [e.target.name]: e.target.value,
      }
    })
  }

  onSubmitWork = (e) => {
    const token = cookie.load("token")
    const csrf = cookie.load("csrftoken")
    var { work } = this.state;

    const lookups = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        "Authorization": `token ${token}`,
      },
      "body": JSON.stringify(work)
    }  

    fetch(process.env.REACT_APP_BASEURL_BACKEND + "/api/v1/site_user/dummy/", lookups)
      .then(res => {
        if (res.status > 400) {
          return console.log("Something went wrong")
        }
        return res.json()
      })
      .then(res => {
        console.log("response", res)
      })
      .catch(err => {
        console.log(err)
      })

      this.setState({
        work: {}
      })
  }

  render() {
    const { companies, site_users_list } = this.state
    return (
      <React.Fragment>
        <div style={{ marginTop: "10%", marginLeft: "8%", marginBottom: "10%" }}>
          <Card className="col-md-11" style={{ borderRadius: "20px" }}>
            <CardBody >
              <fieldset className="card-body  border border-primary " style={{ borderRadius: "20px", borderColor: " red" }}>
                <legend className="col-md-3" style={{ color: "#296D98", width: "50%" }}><strong>Personal Details</strong></legend>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label for="inputEmail4">First Name</label>
                    <Input type="text" 
                      className="form-control" 
                      id="inputEmail4" 
                      placeholder="First Name"
                      name="first_name"
                      value={this.state.profile.first_name} 
                      onChange={this.handleProfileChange.bind(this)} />
                  </div>
                  <div className="form-group col-md-6">
                    <label for="inputPassword4">Last Name</label>
                    <Input type="text" 
                      className="form-control" 
                      id="inputPassword4" 
                      placeholder="Last Name" 
                      name="last_name"
                      value={this.state.profile.last_name} 
                      onChange={this.handleProfileChange.bind(this)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label for="inputPassword4">Contact No.</label>
                    <Input type="number" 
                      className="form-control" 
                      id="inputPassword4" 
                      placeholder="Contact No." 
                      name="contact_no"
                      value={this.state.profile.contact_no} 
                      onChange={this.handleProfileChange.bind(this)}
                      />
                  </div>
                  <div className="form-group col-md-6">
                    <label for="inputPassword4">Date Of Birth</label>
                    <Input type="date" 
                      className="form-control" 
                      id="dob" 
                      placeholder="Date" 
                      name="d_o_b"
                      value={this.state.profile.d_o_b} 
                      onChange={this.handleProfileChange.bind(this)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label for="inputPassword4">Email ID</label>
                    <Input type="text" 
                      className="form-control" 
                      id="inputPassword4" 
                      placeholder="Email ID"
                      name="email"
                      value={this.state.profile.email} 
                      onChange={this.handleProfileChange.bind(this)}
                      />
                  </div>
                  <div className="form-group col-md-6">
                    <label for="inputPassword4">Adhar Card Number</label>
                    <Input type="text" 
                      className="form-control" 
                      id="inputPassword4" 
                      placeholder="Adhar Card Number"
                      name="aadhar_no"
                      value={this.state.profile.aadhar_no} 
                      onChange={this.handleProfileChange.bind(this)}
                    />
                  </div>


                  <div className="form-group col-md-6">
                    <label for="inputState">Gender</label>
                    <Input type="select" id="inputState" name="gender" className="form-control" value={this.state.profile.gender} onChange={this.handleProfileChange.bind(this)}>
                      <option value="" selected>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Input>
                  </div>
                  <div className="form-group col-md-6">
                    <label for="inputCity">Age</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="inputCity" 
                      placeholder="Age"
                      name="age"
                      value={this.state.age} 
                      onChange={this.handleProfileChange.bind(this)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label for="inputAddress">Residential Address</label>
                    <textarea 
                      className="form-control" 
                      id="inputAddress" 
                      placeholder="Residential Address" 
                      name="residential_address"
                      value={this.state.profile.residential_address} 
                      onChange={this.handleProfileChange.bind(this)}
                      style={{ height: "150px" }}></textarea>
                  </div>
                  <div className="form-group col-md-6">
                    <label for="inputAddress2">Permanent Address</label>
                    <textarea type="text" 
                      className="form-control" 
                      id="inputAddress2" 
                      placeholder="Permanent Address" 
                      name="permanent_address"
                      value={this.state.permanent_address} 
                      onChange={this.handleProfileChange.bind(this)}
                      style={{ height: "150px" }}></textarea>
                  </div>
                </div>
                <Button outline color="info" onClick={() => this.onSubmitProfile()}>Save</Button>
                </fieldset>
            </CardBody>
          </Card>


          <Card className="col-md-11" style={{ borderRadius: "20px" }}>
            <CardBody >
              <fieldset className="card-body  border border-primary " style={{ borderRadius: "20px", borderColor: " red" }}>
                <legend className="col-md-3" style={{ color: "#296D98", width: "20%" }}><strong>Work Details</strong></legend>


                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label for="comp">Assign Company</label>
                    <Input type="select" 
                      style={{ marginLeft: "0%" }} 
                      className="form-control col-md-12" 
                      id="comp" 
                      name="company"
                      value={this.state.work.company} 
                      onChange={this.handleWorkChange.bind(this)}
                      >
                      <option value="">Choose a Company</option>
                      {companies != null && companies.length > 0 ? companies.map((company, index) => {
                        return (
                          <option value={company.id}>
                            {company.company_name}
                          </option>
                        )
                      }) :
                        console.log("No companies")
                      }
                    </Input>
                  </div>


                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label for="under">Under</label>
                    <Input type="select" 
                      style={{ marginLeft: "0%" }} 
                      className="form-control col-md-12" 
                      id="under" 
                      name="under"
                      value={this.state.work.under} 
                      onChange={this.handleWorkChange.bind(this)}
                      
                      >
                      <option value="">Choose a Partner</option>
                      {site_users_list != null && site_users_list.length > 0 ? site_users_list
                      .filter((user) => {
                        return user.user_type === 'partner'
                      })
                      .map((user, index) => {
                        return (
                          <option value={user.id}>
                            {user.first_name} {user.last_name}
                          </option>
                        )
                      }) :
                        console.log("No SiteUsers")
                      }
                    </Input>
                  </div>


                </div>
                <Button outline color="info" onClick={() => this.onSubmitWork()}>Save</Button>


              </fieldset>

            </CardBody>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default Add_manager;