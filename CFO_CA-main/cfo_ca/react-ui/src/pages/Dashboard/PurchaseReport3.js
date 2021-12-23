import React from "react";
import ReactDOM from "react-dom";
import { Row, Col, Card, Label, Button,Container, Form,FormGroup, Input,Modal,
CardTitle, CardBody, CardSubtitle,
  } from "reactstrap";
import { Link } from "react-router-dom";
import LoadingComponent from './loadingComponent';


//Table
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search,CSVExport } from 'react-bootstrap-table2-toolkit';
import filterFactory, { numberFilter, Comparator } from 'react-bootstrap-table2-filter';

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


class PurchaseReport3 extends React.Component {
  constructor(props) {
      super(props);

  this.state = {
    modal_large: false,
    loading:false,

company_id : "",
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

        fetch("/api/v1/report_purchase3/"+`${this.props.company_id}`, lookups)
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
                company_id : `${this.props.company_id}`,
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
       <div className="">
         <Container fluid>
         <Card>
            <CardBody>
            <CardTitle> Report 3 </CardTitle>
            <br/>
            <h3>Matching Fields : </h3><p>GST No,Invoice No.</p>
            <h3>Non Matching Fields : </h3><p>Taxable Value</p>
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

       </div>


    );
  }
}
export default PurchaseReport3;