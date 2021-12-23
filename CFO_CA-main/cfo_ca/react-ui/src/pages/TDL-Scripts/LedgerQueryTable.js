import React, { Component } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { Row, Col, Card, CardBody, Button, Input } from "reactstrap";
import { withRouter } from 'react-router';

import "./datatables.scss";
import LoadingComponent from '../Dashboard/loadingComponent';
import Select from 'react-select';

class LedgerQueryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ledgers_data: [],
      options: [],
      selected_companies: [],
      params: "?"
    };
  }

  handleRowClick(ledger_id) {
    console.log(ledger_id);
  }

  handleOnEmailButtonClick() { // Based on script_id, send email
    console.log("Click on handleOnEmailButtonClick()");
    this.setState({ loading: true});
    fetch(process.env.REACT_APP_BASEURL_BACKEND + "/api/v1/email_data/"+ `${this.state.script_id}/` + `${this.state.params}`)
      .then(res => {
        if (res.status > 400) {
          return console.log("Something went wrong")
        }
        return res.json()
      })
      .then(data => {
        console.log(data);
        return this.setState({ loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      })
  }

  handleOnSubmibButtonClick() {
    console.log("On Button Click!")
    this.setState({ loading: true});
    fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/query_data/' + `${this.state.script_id}/` + `${this.state.params}`)
      .then(res => {
        if (res.status > 400) {
          return console.log("Something went wrong")
        }
        return res.json()
      })
      .then(data => {
        let ledgers_data = data.map(
          (ledger, i) => {
            return {
              clickEvent: () => this.handleRowClick(ledger.id),
              name: ledger.name,
              under: ledger.under.name,
              opening_balance: ledger.opening_balance,
              closing_balance: ledger.closing_balance,
              company_name: ledger.company_name
            };
        });
        return this.setState({ ledgers_data: ledgers_data, loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      })
    }
 
  componentDidMount() {
    console.log(parseInt(this.props.match.params.script_id));
    this.setState({ script_id: parseInt(this.props.match.params.script_id) }); 

    fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/company_list/')
      .then(res => {
          if (res.status > 400) {
              return null
          }
          return res.json()
      })
      .then(companies => {
        let options = companies.map((company) => {
          return {
            "value": company.id,
            "label" :  company.company_name
          }
        })
          return this.setState({ options: options })
      })
      .catch(err => {
          console.log(err);
      })
  }

  handleChange = selectedOption => {
    if (selectedOption !== null) {
        var company_list = selectedOption.map((company) => {
            return company.value;
        }); 
        this.setState({
          selected_companies: company_list,
          params: this.state.params + "company=" + company_list.join("&company=") 
        });
        
    }
  };

  handleDateChange(e) {
    console.log(e.target.name);
    this.setState({
      [e.target.name]: e.target.value,
      params: this.state.params + "&" + e.target.name + "=" + e.target.value 

    })
  }

  render() {

    const { ledgers_data, loading, selectedOption, default_company_list, options } = this.state

    const data = {
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
          width: 150
        },

        {
          label: "Under",
          field: "under",
          sort: "asc",
          width: 150
        },
        {
          label: "Opening Balance",
          field: "opening_balance",
          sort: "asc",
        },
        {
          label: "Closing Balance",
          field: "closing_balance",
          sort: "asc",
          width: 150
        },
        {
          label: "Company",
          field: "company_name",
          sort: "asc",
          width: 150
        }
      ],

      rows: ledgers_data
    };
    return (
      <React.Fragment>
        <div className="">
          {loading ? <LoadingComponent /> :
          <div className="container-fluid">
              <Card>
                <CardBody>
                  <Row> 
                      <Col md={4}>
                          <label className="col-form-label">Select companies</label>

                          <Select isMulti value={selectedOption} onChange={this.handleChange} options={options} defaultValue={default_company_list}  />
                      </Col>
                      <Col md={2}>
                        <label className="col-form-label">From</label>

                        <Input
                          name="from"
                          type="Date"
                          value={this.state.from}
                          onChange={this.handleDateChange.bind(this)}
                          />
                      </Col>
                      <Col md={2}>
                        <label className="col-form-label">To</label>
                        <Input
                          name="to"
                          type="Date"
                          value={this.state.to}
                          onChange={this.handleDateChange.bind(this)}
                          />
                      </Col>
                      <Col md={1}></Col>
                      <Col md={1}>
                        <Button className="btn btn-rounded .w-lg btn-default" onClick={ () => { this.handleOnSubmibButtonClick(); }}>
                            Search
                        </Button>
                      </Col>
                      <Col md={1}>
                        <Button className="btn btn-rounded .w-lg btn-default" onClick={ () => { this.handleOnEmailButtonClick(); }}>
                            Email
                        </Button>
                      </Col>
                      <Col md={1}>
                        <Button className="btn btn-rounded .w-lg btn-default">
                          <a href={process.env.REACT_APP_BASEURL_BACKEND + `/api/v1/export_data/${this.state.script_id}/${this.state.params}`} download
                          style={{"color":"inherit", "text-decoration": "inherit"}} target="_blank">
                            Export
                          </a>
                        </Button>
                      </Col>
                  </Row> 
                </CardBody>
              </Card>
                <Row>
                  <Col className="col-12">
                    <Card>
                      <CardBody>
                        <MDBDataTableV5 responsive striped bordered data={data} />
                      </CardBody>
                    </Card>
                  </Col>
              </Row>
          </div>
          }
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(LedgerQueryTable);
