import React from "react";
import ReactDOM from "react-dom";
import { Row, Col, Card, Label, Button,Container, Form,FormGroup, Input,Modal,
CardTitle, CardBody, CardSubtitle,
  } from "reactstrap";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import cookie from "react-cookies";
import { CSVLink, CSVDownload } from "react-csv";
import LoadingComponent from './loadingComponent';



const csvDataSales = [
  ["Invoice Date","Invoice Number","State","Place of Supply","Invoice Type","Supplier GSTIN","IGST Amount","CGST Amount","SGST Amount","CESS Amount","Item Taxable Value","Total Transaction Value","Customer Billing Name"],
];

const csvDataPurchase = [
  ["Invoice Date","Invoice Number","State","Place of Supply","Invoice Type","Supplier GSTIN","IGST Amount","CGST Amount","SGST Amount","CESS Amount","Item Taxable Value","Total Transaction Value","Customer Billing Name"],
];


class GST1 extends React.Component {
  constructor(props) {
    super(props);
    this.handleAcceptedFiles = this.handleAcceptedFiles.bind(this);
    this.state = {
    selectedFiles: [],
     json_file: "",
     companies:[],
     company_id : "",
     selectedFiles_json : "",
     from_date : "",
     to_date : "",
     tolerance : "",
     csv_file : "",
     loading: false,
     visible: false,
     modal_standard: false,
     modal_standard2: false,
     };
     this.tog_standard = this.tog_standard.bind(this);
     this.tog_standard2 = this.tog_standard2.bind(this);
  }

// Modal Start
   tog_standard() {
    this.setState(prevState => ({
      modal_standard: !prevState.modal_standard
    }));
    this.removeBodyCss();
  }

  tog_standard2() {
    this.setState(prevState => ({
      modal_standard2: !prevState.modal_standard2
    }));
    this.removeBodyCss();
  }
  removeBodyCss() {
    document.body.classList.add("no_padding");
  }

    show() {
    this.setState({ visible: true });
  }
  hide() {
    this.setState({ visible: false });
  }

  //Modal End


    load_companies = () => {
        const token = cookie.load("token")
        const csrf  = cookie.load("csrftoken")

        const lookups = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                 'Accept': 'application/json',
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
            }
        }

        fetch(process.env.REACT_APP_BASEURL_BACKEND+"/api/v1/company_list/", lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
                companies : res,
                company_id : `${this.props.match.params.company_id}`,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleAcceptedFiles = files => {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: this.formatBytes(file.size),
      })
    );


              this.setState({ selectedFiles_json: files[0].file});
              this.setState({ selectedFiles: files });

  };

       handleChange = (e) => {
        console.log('e.target', e.target)
        return this.setState({
            [e.target.name]: e.target.value
        })
    }

  uploadFile = (e) => {
		console.log('e.target.files', e.target.files)
		const format = e.target.files[0].type.split("/")[1]
console.log('e.target.files', format)
			if(format === "json"){
				console.log("inside if")
				this.setState({
					json_file: e.target.files[0],
				})
			}else if(format === "vnd.ms-excel"){
				console.log("inside csv_file")
				this.setState({
					csv_file: e.target.files[0],
				})
			}
			else if(format != "vnd.ms-excel" || format != "json"){
				alert("Only Json/csv File is accepted");
			}

	}



  uploadFile225 = (e) => {
		console.log('e.target.files', e.target.files)
		const format = e.target.files[0].type.split("/")[1]
console.log('e.target.files', format)
			if(format === "json"){
				console.log("inside if")
				this.setState({
					json_file: e.target.files[0],
				})
			}else if(format === "vnd.ms-excel"){
				console.log("inside csv_file")
				this.setState({
					csv_file: e.target.files[0],
				})
			}
			else if(format != "vnd.ms-excel" || format != "json"){
				alert("Only Json/csv File is accepted");
			}

	}

	handleSubmit = e => {
		e.stopPropagation()
		const detail = {}

		const body = this.state

		detail["company_id"] = `${this.props.match.params.company_id}`

		return this.createGSTR1({detail,body})
	}

	handleSubmit2 = e => {
		e.stopPropagation()
		const detail = {}

		const body = this.state

		detail["company_id"] = `${this.props.match.params.company_id}`

		return this.createGSTR2({detail,body})
	}


	createGSTR1 = data => {
		const endpoint = process.env.REACT_APP_BASEURL_BACKEND+"/api/v1/gst_r1/"+`${this.props.match.params.company_id}`;
		const csrfToken = cookie.load("csrftoken");
		const token = cookie.load("token");
		const formData = new FormData();

		formData.append("data", JSON.stringify(data))
		formData.append("json_file", this.state.json_file)
		formData.append("csv_file", this.state.csv_file)  

		let lookupOptions = {
			method: "POST",
			headers: {
				"X-CSRFToken": csrfToken,
				"Authorization": `token ${token}`
			},
			body: formData,
		};
		this.setState({
					loading: true,
				});

		fetch(endpoint, lookupOptions)
		.then( (res) => {
			if(res.status >= 400){
			this.setState({
					loading: false,
				})
			alert("Something Went wrong");

				return console.log(res.json())
			}else{
			this.setState({
					loading: false,
				})
			alert("Success");

				 console.log(res.json());
				return console.log("res.json()")
			}
		})
		.catch(function (error) {
			console.log("error", error);
		});
	}
	createGSTR2 = data => {
		const endpoint = process.env.REACT_APP_BASEURL_BACKEND+"/api/v1/gst_r2/"+`${this.props.match.params.company_id}`;
		const csrfToken = cookie.load("csrftoken");
		const token = cookie.load("token");
		const formData = new FormData();

		formData.append("data", JSON.stringify(data))
		formData.append("json_file", this.state.json_file)
		formData.append("csv_file", this.state.csv_file)

		let lookupOptions = {
			method: "POST",
			headers: {
				"X-CSRFToken": csrfToken,
				"Authorization": `token ${token}`
			},
			body: formData,
		};
		this.setState({
					loading: true,
				});

		fetch(endpoint, lookupOptions)
		.then( (res) => {
			if(res.status >= 400){
			this.setState({
					loading: false,
				})
			alert("Something Went wrong");

				return console.log(res.json())
			}else{
			this.setState({
					loading: false,
				})
			alert("Success");

				 console.log(res.json());
				return console.log("res.json()")
			}
		})
		.catch(function (error) {
			console.log("error", error);
		});
	}

	   componentDidMount(){
        this.load_companies()
    }

  /**
   * Formats the size
   */
  formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };


  render() {
  const {companies} = this.state
   const {company_id} = this.state
   {console.log("this.props.company_id")}
   {console.log(company_id)}
   const {loading} = this.state
    return (

    <div className="page-content">
         <Container fluid>

            {loading ? <LoadingComponent /> :   <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>


                    <Form>

                     {/* Start Dropzone */}


                      <div
                        className="dropzone-previews mt-3"
                        id="file-previews"
                      >
                        {this.state.selectedFiles.map((f, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="80"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          );
                        })}
                      </div>

                      {/* End Dropzone */}

                      <Row>
                        <Col md="10">
                            <h1>GST R1 Form  </h1>
                            <br/>
                        </Col>
                        <Col md="2">
                                 <CSVLink
                                 data={csvDataSales}
                                 filename={"sample-file.csv"}
                                 className="btn btn-primary">Download Sample CSV</CSVLink>
                        </Col>
                      </Row>


                      <AvForm className="needs-validation" onSubmit={this.handleSubmit} >
                                            <Row>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom01">Taxable Value Tolerance(+/-)</Label>
                                                        <AvField
                                                          name="tolerance"
                                                          placeholder="(+/-)"
                                                          type="text"
                                                          value={this.tolerance}
                                                            onChange={this.handleChange.bind(this)}
                                                          errorMessage="Enter First Field"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="validationCustom01"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom02">From Date</Label>
                                                        <AvField
                                                          name="from_date"
                                                          placeholder="01/03/2019"
                                                          type="date"
                                                          value={this.from_date}
                                                            onChange={this.handleChange.bind(this)}
                                                          errorMessage="Enter Valid Date"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="validationCustom02"
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom02">To Date</Label>
                                                        <AvField
                                                          name="to_date"
                                                          type="date"
                                                          errorMessage="Enter Valid Date"
                                                            value={this.to_date}
                                                            onChange={this.handleChange.bind(this)}
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="validationCustom02"
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                                            Match First 4 digit of Invoice No.
                                                        </label>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck2" />
                                                        <label className="form-check-label" htmlFor="defaultCheck2">
                                                            Match First 2 digit of Invoice No.

                                                        </label>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck3" />
                                                        <label className="form-check-label" htmlFor="defaultCheck3">
                                                            Match Last 4 digit of Invoice No.
                                                        </label>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck4" />
                                                        <label className="form-check-label" htmlFor="defaultCheck4">
                                                           Match Last 2 digit of Invoice No.
                                                        </label>
                                                    </div>
                                                </Col>


                                            </Row>
                                            <br/>
                                            <Row>
                                                <Col md="4">
                                                    <div className="form-group row">
                                                        <label className="col-md-3 col-form-label">Current Company</label>
                                                        <div className="col-md-7">
                                                            <select className="form-control" value={company_id}>
                                                                 {companies!=null && companies.length > 0? companies.map((companyItem,index)=>{
                                                        return(
                                                             <option value={companyItem.id}>{companyItem.company_name}</option>
                                                        )
                                            })
                                             :
                                             <option value="0">No Companies Found</option>
                                            }
                                                 </select>
                                                        </div>
                                                    </div>
                                                </Col>
 <Col md="4">
                                                    <div className="form-group row">
                                                            <label className="col-md-4 col-form-label">Choose GST CSV File </label>
                                                            <div className="col-md-8">
                                                                <Input
                                                                 type="file"
											onChange={this.uploadFile}
											errorMessage="Please select a file."
											validate={{
												required: { value: true },
											}}
                                                                 />
                                                            </div>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-group row">
                                                            <label className="col-md-4 col-form-label">Choose GST JSON File </label>
                                                            <div className="col-md-8">
                                                                <Input
                                                                 type="file"
											onChange={this.uploadFile}
											errorMessage="Please select a file."
											validate={{
												required: { value: false },
											}}
                                                                 />
                                                            </div>
                                                    </div>
                                                </Col>

                                            </Row>

                                                <div className="text-center mt-4">

                                                {/*<button
                                                    type="button"
                                                    onClick={this.tog_standard}
                                                    className="btn btn-primary waves-effect waves-light"
                                                    data-toggle="modal"
                                                    data-target="#myModal"
                                                  >
                                                    Submit
                                                </button>*/}

                       <button type="submit" className="btn btn-primary waves-effect waves-light">Submit</button>

                      <span>{'\u0020 '} </span>
                <Link to={`/gst-reports-main/`+`${this.props.match.params.company_id}`} activeClassName="active">
                         <button type="button" className="btn btn-primary waves-effect waves-light">Next ></button>
                      </Link>

                    </div>


                                        </AvForm>
                    </Form>



                  </CardBody>
                </Card>
              </Col>

                        {/* Do not restructure modal place. Yes, you. */}
                        <Modal
                          isOpen={this.state.modal_standard}
                          toggle={this.tog_standard}
                        >
                          <div className="modal-header">
                            <h5 className="modal-title mt-0" id="myModalLabel">
                              Confirmation
                          </h5>
                            <button
                              type="button"
                              onClick={() =>
                                this.setState({ modal_standard: false })
                              }
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <h5>Data already exist for selected Date Range!!</h5>

                            <p>
                              Update Details - will update old data (previous data may get deleted)
                              Merge Details - will add new entries (previous data will not be affected)
                          </p>
                          </div>
                          <div className="modal-footer">


                          <button
                              type="button"
                              className="btn btn-success waves-effect"
                              data-dismiss="modal"
                            >
                              Update Details
                          </button>

                            <button
                              type="button"
                              className="btn btn-success waves-effect waves-light"
                            >
                              Merge Details
                          </button>
{/*
                          <button
                              type="button"
                              onClick={this.tog_standard}
                              className="btn btn-secondary waves-effect"
                              data-dismiss="modal"
                            >
                              Close
                          </button>*/}
                          </div>
                        </Modal>
                         {/* End modal */}


                  <Col className="col-12">
                <Card>
                  <CardBody>


                    <Form>

                     {/* Start Dropzone */}


                      <div
                        className="dropzone-previews mt-3"
                        id="file-previews"
                      >
                        {this.state.selectedFiles.map((f, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="80"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          );
                        })}
                      </div>

                      {/* End Dropzone */}

                      <Row>
                        <Col md="10">
                            <h1>GST 2A Form  </h1>
                            <br/>
                        </Col>
                        <Col md="2">
                                 <CSVLink
                                 data={csvDataSales}
                                 filename={"sample-file.csv"}
                                 className="btn btn-primary">Download Sample CSV</CSVLink>
                        </Col>
                      </Row>


                      <AvForm className="needs-validation" onSubmit={this.handleSubmit2} >
                                            <Row>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom01">Taxable Value Tolerance(+/-)</Label>
                                                        <AvField
                                                          name="tolerance"
                                                          placeholder="(+/-)"
                                                          type="text"
                                                          value={this.tolerance}
                                                            onChange={this.handleChange.bind(this)}
                                                          errorMessage="Enter First Field"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="validationCustom01"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom02">From Date</Label>
                                                        <AvField
                                                          name="from_date"
                                                          placeholder="01/03/2019"
                                                          type="date"
                                                          value={this.from_date}
                                                            onChange={this.handleChange.bind(this)}
                                                          errorMessage="Enter Valid Date"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="validationCustom02"
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label htmlFor="validationCustom02">To Date</Label>
                                                        <AvField
                                                          name="to_date"
                                                          type="date"
                                                          errorMessage="Enter Valid Date"
                                                            value={this.to_date}
                                                            onChange={this.handleChange.bind(this)}
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="validationCustom02"
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck11" />
                                                        <label className="form-check-label" htmlFor="defaultCheck11">
                                                            Match First 4 digit of Invoice No.
                                                        </label>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck21" />
                                                        <label className="form-check-label" htmlFor="defaultCheck21">
                                                            Match First 2 digit of Invoice No.

                                                        </label>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck31" />
                                                        <label className="form-check-label" htmlFor="defaultCheck31">
                                                            Match Last 4 digit of Invoice No.
                                                        </label>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck41" />
                                                        <label className="form-check-label" htmlFor="defaultCheck41">
                                                           Match Last 2 digit of Invoice No.
                                                        </label>
                                                    </div>
                                                </Col>


                                            </Row>
                                            <br/>
                                            <Row>
                                                <Col md="4">
                                                    <div className="form-group row">
                                                        <label className="col-md-3 col-form-label">Current Company</label>
                                                        <div className="col-md-7">
                                                            <select className="form-control" value={company_id}>
                                                                 {companies!=null && companies.length > 0? companies.map((companyItem,index)=>{
                                                        return(
                                                             <option value={companyItem.id}>{companyItem.company_name}</option>
                                                        )
                                            })
                                             :
                                             <option value="0">No Companies Found</option>
                                            }
                                                 </select>
                                                        </div>
                                                    </div>
                                                </Col>
 <Col md="4">
                                                    <div className="form-group row">
                                                            <label className="col-md-4 col-form-label">Choose GST CSV File </label>
                                                            <div className="col-md-8">
                                                                <Input
                                                                 type="file"
											onChange={this.uploadFile}
											errorMessage="Please select a file."
											validate={{
												required: { value: true },
											}}
                                                                 />
                                                            </div>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="form-group row">
                                                            <label className="col-md-4 col-form-label">Choose GST JSON File </label>
                                                            <div className="col-md-8">
                                                                <Input
                                                                 type="file"
											onChange={this.uploadFile}
											errorMessage="Please select a file."
											validate={{
												required: { value: false },
											}}
                                                                 />
                                                            </div>
                                                    </div>
                                                </Col>

                                            </Row>

                                                <div className="text-center mt-4">

                                                {/*<button
                                                    type="button"
                                                    onClick={this.tog_standard}
                                                    className="btn btn-primary waves-effect waves-light"
                                                    data-toggle="modal"
                                                    data-target="#myModal"
                                                  >
                                                    Submit
                                                </button>*/}

                       <button type="submit" className="btn btn-primary waves-effect waves-light">Submit</button>

                      <span>{'\u0020 '} </span>
                <Link to={`/purchase-gst-reports-main/`+`${this.props.match.params.company_id}`} activeClassName="active">
                         <button type="button" className="btn btn-primary waves-effect waves-light">Next ></button>
                      </Link>

                    </div>

                                        </AvForm>
                    </Form>



                  </CardBody>
                </Card>
              </Col>
            </Row>
            }
         </Container>
      </div>





    );
  }
}
export default GST1;