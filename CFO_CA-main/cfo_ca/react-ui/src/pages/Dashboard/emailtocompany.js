import React, { Component } from "react";

import { Card, CardBody, CardTitle, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import LoadingComponent from './loadingComponent';

import { AvForm, AvField } from "availity-reactstrap-validation";

class EmailCard extends Component {
  constructor(props) {
    super(props);
    this.state = {

      companies: [],
      loading: true,
      form_data: {
        selected_email_id: "",
        selected_company: "",
        selected_mis: "",
        days_array: [],
        scheduled_emails: [],

      }

    };
  }



  load_companies = () => {
    //        const token = cookie.load("token")
    //        const csrf  = cookie.load("csrftoken")

    const lookups = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
        //                "X-CSRFToken": csrf,
        //                "Authorization": `token ${token}`
      }
    }

    fetch(process.env.REACT_APP_BASEURL_BACKEND + "/api/v1/company_list/", lookups)
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
          companies: res
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  load_scheduled_list = () => {
    const lookups = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      }
    }

    fetch(process.env.REACT_APP_BASEURL_BACKEND + "/reporting/mis-schedule-mails/", lookups)
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
          scheduled_emails: res
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleChange = (e) => {
    console.log('e.target', e.target)
    return this.setState({
      form_data: {
        ...this.state.form_data,
        [e.target.name]: e.target.value,
      }
    })
  }

  handleCheckbox(e) {
    if (e.target.checked) {
      return this.setState({
        form_data: {
          ...this.state.form_data,
          days_array: this.state.form_data.days_array.concat(e.target.name),
        }

      })
    } else {
      var index = this.state.form_data.days_array.indexOf(e.target.name)
      if (index !== -1) {
        this.state.form_data.days_array.splice(index, 1);
      }
    }
  }


  handleSubmit = e => {
    e.stopPropagation()
    const body = this.state.form_data
    return this.createGSTR1({ body })
  }


  createGSTR1 = data => {
    const endpoint = "/api/v1/schedule_mis_mails";
    //		const csrfToken = cookie.load("csrftoken");
    //		const token = cookie.load("token");
    const formData = new FormData();

    formData.append("data", JSON.stringify(data))


    let lookupOptions = {
      method: "POST",
      headers: {
        //				"X-CSRFToken": csrfToken,
        //				"Authorization": `token ${token}`
      },
      body: formData,
    };

    fetch(endpoint, lookupOptions)
      .then((res) => {
        if (res.status >= 400) {
          res.text().then(function (data) {
            console.log(data);
            alert(JSON.parse(data).Error);
            return console.log(data)
          });
        } else {
          alert("Success");
          return console.log(res.json())
        }
      })
      .catch(function (error) {
        console.log("error", error);
      });
  }


  componentDidMount() {
    this.load_companies();
    this.load_scheduled_list();
  }

  render() {
    const { scheduled_emails } = this.state
    const { loading } = this.state
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 150
        },

        {
          label: "From Email",
          field: "from_email",
          sort: "asc",
          width: 150
        },
        {
          label: "MIS",
          field: "mis_name",
          sort: "asc",
          width: 100
        },
        {
          label: "Daily",
          field: "is_daily",
          sort: "asc",
          width: 100
        },
        {
          label: "Days",
          field: "days",
          sort: "asc",
          width: 100
        },
        {
          label: "Company",
          field: "company_id__company_name",
          sort: "asc",
          width: 100
        }
      ],
      rows: scheduled_emails,
    };
    const { companies } = this.state
    return (
      <React.Fragment>

        <AvForm className="needs-validation" onSubmit={this.handleSubmit} >

          <div style={{ margin: "10% 2% 5% 2%" }}>
            <div className="card shadow card" style={{ borderRadius: "20px" }}>
              <div className="card-body row">
                <label style={{ marginRight: "1%", margin: '7px' }}><h5>List Of Emails :</h5></label>
                <div>
                  <select className="form-control" id="id_email" name="selected_email_id" value={this.selected_email_id} onChange={this.handleChange.bind(this)}>
                    <option value="0">Choose a Email ID</option>
                    <option value="suhas@atmsco.in">suhas@atmsco.in</option>
                    <option value="casuhasshinde@gmail.com">casuhasshinde@gmail.com</option>
                    <option value="vikas.pandey9323@gmail.com">vikas.pandey9323@gmail.com</option>
                  </select>
                </div>
                <label style={{ marginRight: "1%", margin: '7px' }}>Select MIS</label>
                <select className="form-control col-md-3" id="id_mis_name" name="selected_mis" value={this.selected_mis} onChange={this.handleChange.bind(this)}>
                  <option value="0">Choose a MIS</option>
                  <option value="financial_dashboard">Financial Dashboard</option>
                  <option value="liquidity_barometer">Liquidity Barometer</option>
                  <option value="profit_loss">Profit & Loss Account</option>
                  <option value="fund_flow">Fund Flow Statement</option>
                  <option value="provisional_cash_flow">Provisional Cashflow</option>
                  <option value="debtors_ageing">Debtors Ageing Report</option>
                  <option value="creditors_ageing">Creditors Ageing Report</option>
                  <option value="crucial_numbers">Crucial Numbers</option>
                </select>
                <label style={{ marginRight: "1%", margin: '7px' }}>Company</label>

                <select style={{ marginLeft: "1%" }} className="form-control col-md-3" id="cars" name="selected_company" value={this.selected_company} onChange={this.handleChange.bind(this)}>
                  <option value="0">Select Company</option>
                  {companies != null && companies.length > 0 ? companies.map((companyItem, index) => {
                    return (
                      <option value={companyItem.id}>{companyItem.company_name}</option>
                    )
                  })
                    :
                    <option value="1">No Companies Found</option>
                  }
                </select>



              </div>
              <br />
              <div style={{ marginLeft: "22%" }} className="row">
                <div className="form-check" style={{ marginLeft: "2%" }}>
                  <input type="checkbox" name="monday" className="form-check-input" id="exampleCheck1" value={this.monday} onChange={e => this.handleCheckbox(e)} />
                  <label class="form-check-label" for="exampleCheck1" style={{ color: "black" }}>Monday</label>
                </div>
                <div className="form-check" style={{ marginLeft: "2%" }}>
                  <input type="checkbox" name="tuesday" className="form-check-input" id="exampleCheck2" value={this.tuesday} onChange={e => this.handleCheckbox(e)} />
                  <label class="form-check-label" for="exampleCheck2" style={{ color: "black" }}>Tuesday</label>
                </div>
                <div className="form-check" style={{ marginLeft: "2%" }}>
                  <input type="checkbox" name="wednesday" className="form-check-input" id="exampleCheck3" value={this.wednesday} onChange={e => this.handleCheckbox(e)} />
                  <label class="form-check-label" for="exampleCheck3" style={{ color: "black" }}>Wednesday</label>
                </div>
                <div className="form-check" style={{ marginLeft: "2%" }}>
                  <input type="checkbox" name="thursday" className="form-check-input" id="exampleCheck4" value={this.thursday} onChange={e => this.handleCheckbox(e)} />
                  <label class="form-check-label" for="exampleCheck4" style={{ color: "black" }}>Thursday</label>
                </div>

                <div className="form-check" style={{ marginLeft: "2%" }}>
                  <input type="checkbox" name="friday" className="form-check-input" id="exampleCheck5" value={this.friday} onChange={e => this.handleCheckbox(e)} />
                  <label class="form-check-label" for="exampleCheck5" style={{ color: "black" }}>Friday</label>
                </div>

                <div className="form-check" style={{ marginLeft: "2%" }}>
                  <input type="checkbox" name="saturday" className="form-check-input" id="exampleCheck6" value={this.saturday} onChange={e => this.handleCheckbox(e)} />
                  <label class="form-check-label" for="exampleCheck6" style={{ color: "black" }}>Saturday</label>
                </div>

                <div className="form-check" style={{ marginLeft: "2%" }}>
                  <input type="checkbox" name="sunday" className="form-check-input" id="exampleCheck7" value={this.sunday} onChange={e => this.handleCheckbox(e)} />
                  <label class="form-check-label" for="exampleCheck7" style={{ color: "black" }}>Sunday</label>
                </div>

                <div className="form-check" style={{ marginLeft: "2%" }}>
                  <input type="checkbox" name="daily" className="form-check-input" id="exampleCheck8" value={this.daily} onChange={e => this.handleCheckbox(e)} />
                  <label class="form-check-label" for="exampleCheck8" style={{ color: "red" }}>Daily</label>
                </div>

              </div>
              <br />
              <div>
                <div style={{ marginLeft: "35%", marginBottom: "2%" }} className="row">




                </div>
                <button type="submit" style={{ marginLeft: "48%", marginBottom: "4%" }} className="btn btn-primary">Schedule</button>


              </div>
            </div>
            {loading ? <LoadingComponent /> :
              <div className="card shadow card" style={{ borderRadius: "20px", padding: "15px", }}>
                <MDBDataTable responsive striped bordered data={data} />
              </div>
            }

          </div>




        </AvForm>
      </React.Fragment>
    );
  }
}


export default EmailCard;
