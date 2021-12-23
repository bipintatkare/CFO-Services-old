import React from "react";
import ReactDOM from "react-dom";
import { Row, Col, Card, Label, Button,Container, Form,FormGroup, Input,Modal,
CardTitle, CardBody, CardSubtitle,
  } from "reactstrap";

//Table
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search,CSVExport } from 'react-bootstrap-table2-toolkit';
import filterFactory, { numberFilter, Comparator } from 'react-bootstrap-table2-filter';
import { Link } from "react-router-dom";
import LoadingComponent from './loadingComponent';

const { ExportCSVButton } = CSVExport;
const data = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];

const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];


class ReportMain extends React.Component {
  constructor(props) {
      super(props);

  this.state = {
    modal_large: false,
    loading:true,
    datamain: [
      {
        id:"1",
        dataField: "id",
        text: "Id",
      },
      { id:"2",
        dataField: "gstr1_invoice__gstr1__gst_no",
        text: "GST Number",
      },
      { id:"3",
        dataField: "gstr1_invoice__gstr1__customer_billing_name",
        text: "Billing Name",
      },
      { id:"4",
        dataField: "gstr1_invoice__invoice_no",
        text: "Invoice Number",
      },
      { id:"5",
        dataField: "gstr1_invoice__invoice_date",
        text: "Invoice Date",
      },
      { id:"6",
        dataField: "gstr1_invoice__total_value",
        text: "Invoice Amount",
      },
      { id:"7",
        dataField: "txval",
        text: "Taxable Value",
      },
      { id:"8",
        dataField: "camt",
        text: "CGST",
      },
      { id:"9",
        dataField: "samt",
        text: "SGST",
      },
      { id:"10",
        dataField: "iamt",
        text: "IGST",
      },


    ],
    data : [],
  }
      this.tog_large = this.tog_large.bind(this);

  }
  removeBodyCss() {
    document.body.classList.add("no_padding");
  }

   load_data = () => {
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

        fetch("/api/v1/gst_r1/"+`${this.props.match.params.company_id}`, lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res[0]['obj_list'])
            return this.setState({
                data : res[0]['obj_list'],
                loading: false,
                company_id : `${this.props.match.params.company_id}`,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

   componentDidMount(){
        this.load_data()
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

  render() {
  {console.log("{data}")}
  {console.log({data})}
    const {company_id,loading} = this.state

    return (
       <div className="page-content">
         <Container fluid>
         <Card>
            <CardBody>
            <CardTitle> GSTR-1 Uploaded Data </CardTitle>
            {/*<br/>
            <CardSubtitle> Table Content from GST 1 </CardSubtitle>
            <br/>*/}
            <ToolkitProvider
              keyField="id"
              data={this.state.data}
              columns={this.state.datamain}
              exportCSV
              striped
              hover
            >
              {
                props => (
                  <div>
                  <Row>
                    <Col md="6" className="text-left">
                        <ExportCSVButton className="btn btn-info" { ...props.csvProps }>Export</ExportCSVButton>
                    </Col>
                    <Col md="6"  className="text-right">
                          <button
                            type="button"
                            onClick={this.tog_large}
                            className="btn btn-info waves-effect waves-light"
                            data-toggle="modal"
                            data-target=".bs-example-modal-lg"
                          >
                            View Reports
                        </button>



                      </Col>

                  </Row>



                    <hr />
                    {loading ? <LoadingComponent /> :
                        <BootstrapTable { ...props.baseProps }filter={ filterFactory() }
                          pagination={ paginationFactory() } />
                    }
                  </div>
                )
              }
            </ToolkitProvider>
            </CardBody>
            </Card>
         </Container>
         <Modal
                          size="lg"
                          isOpen={this.state.modal_large}
                          toggle={this.tog_large}
                        >
                          <div className="modal-header">
                            <h5
                              className="modal-title mt-0"
                              id="myLargeModalLabel"
                            >
                              GSTR-1 Reports
                          </h5>
                            <button
                              onClick={() =>
                                this.setState({ modal_large: false })
                              }
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                          <p> Reports Ready For Download </p>

                          <Row className="text-center">
                            <Col md="2">
                                <Link to={{pathname: `/report-1/${company_id}`}} activeClassName="active">
                                    <Button className="btn btn-primary"> Report 1</Button>
                                </Link>
                            </Col>


                            <Col md="2">
                                 <Link to={{pathname: `/report-2/${company_id}`}} activeClassName="active">
                                     <Button className="btn btn-info"> Report 2</Button>
                                 </Link>
                            </Col>

                            <Col md="2">
                                <Link to={{pathname: `/report-3/${company_id}`}} activeClassName="active">
                                    <Button className="btn btn-warning"> Report 3</Button>
                                </Link>
                            </Col>

                            <Col md="2">
                                <Link to={{pathname: `/report-4/${company_id}`}} activeClassName="active">
                                    <Button className="btn btn-success"> Report 4</Button>
                                </Link>
                            </Col>
                            <Col md="2">
                                <Link to={{pathname: `/report-5/${company_id}`}} activeClassName="active">
                                    <Button className="btn btn-danger"> Report 5</Button>
                                </Link>
                            </Col>
                          </Row>

                          </div>
                        </Modal>
       </div>


    );
  }
}
export default ReportMain;