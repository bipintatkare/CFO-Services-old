import React, { Component } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { Row, Col, Card, CardBody, Button, Input } from "reactstrap";
import { withRouter } from 'react-router';

import "./datatables.scss";
import LoadingComponent from '../Dashboard/loadingComponent';
import Select from 'react-select';

class VouchersQueryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      voucher_items_data: [],
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
    this.setState({ loading: true });
    fetch(process.env.REACT_APP_BASEURL_BACKEND + "/api/v1/email_data/" + `${this.state.script_id}/` + `${this.state.params}`)
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
    this.setState({ loading: true });
    fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/query_data/' + `${this.state.script_id}/` + `${this.state.params}`)
      .then(res => {
        if (res.status > 400) {
          return console.log("Something went wrong")
        }
        return res.json()
      })
      .then(data => {
        console.log(data);
        let voucher_items_data = data.map(
          (voucher_item, i) => {
            return {
              clickEvent: () => this.handleRowClick(voucher_item.id),
              voucher_id: voucher_item.voucher_id.id,
              ledger_name: voucher_item.ledger_name_temp,
              type: voucher_item.type,
              amount: voucher_item.amt,
              type_name: voucher_item.voucher_id.type_name,
              voucher_date: voucher_item.voucher_id.voucher_date,
              company_name: voucher_item.voucher_id.company_name,
            };
          });
        return this.setState({ voucher_items_data: voucher_items_data, loading: false });
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
            "label": company.company_name
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
      });
    }
    this.setState({
      selected_companies: company_list,
      params: this.state.params + "&company=" + company_list.join("&company=")
    });
  };

  handleDateChange(e) {
    console.log(e.target.name);
    this.setState({
      [e.target.name]: e.target.value,
      params: this.state.params + "&" + e.target.name + "=" + e.target.value
    })
  }

  render() {

    const { voucher_items_data, loading, selectedOption, options, default_company_list } = this.state

    const data = {
      columns: [
        {
          label: "Voucher ID",
          field: "voucher_id",
          sort: "asc",
          width: 150
        },
        {
          label: "Type",
          field: "type",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
          width: 150
        },
        {
          label: "Type Name",
          field: "type_name",
          sort: "asc",
          width: 150
        },
        {
          label: "Ledger Name",
          field: "ledger_name",
          sort: "asc",
          width: 150
        },
        {
          label: "Company",
          field: "company_name",
          sort: "asc",
          width: 150
        },
        {
          label: "Voucher Date",
          field: "voucher_date",
          sort: "asc",
          width: 150
        },
      ],

      rows: voucher_items_data
    };
    return (
      <React.Fragment>
        <div className="">
          {loading ? <LoadingComponent /> :
            <div className="container-fluid">
              <Card>
                <CardBody>
                  <Row>
                    {(() => {
                      if (this.props.match.params.script_id === 12) {
                        return (
                          <>
                            <Col md={4}>
                              <label className="col-form-label">Select companies</label>
                              <Select isMulti value={selectedOption} onChange={this.handleChange} options={options} defaultValue={default_company_list} />
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
                          </>
                        )
                      }
                    })}
                    <Col md={9}></Col>
                    <Col md={1}>
                      <Button className="btn btn-rounded .w-lg btn-default" onClick={() => { this.handleOnSubmibButtonClick(); }}>
                        Search</Button>
                    </Col>
                    <Col md={1}>
                      <Button className="btn btn-rounded .w-lg btn-default" onClick={() => { this.handleOnEmailButtonClick(); }}>
                        Email</Button>
                    </Col>
                    <Col md={1}>
                      <Button className="btn btn-rounded .w-lg btn-default">
                        <a href={process.env.REACT_APP_BASEURL_BACKEND + `/api/v1/export_data/${this.state.script_id}/${this.state.params}`} download
                          style={{ "color": "inherit", "text-decoration": "inherit" }} target="_blank">
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

export default withRouter(VouchersQueryTable);
