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


class SyncHistory extends React.Component {
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
        dataField: "company_name__company_name",
        text: "Company Name",
      },
      { id:"3",
        dataField: "sync_timedate",
        text: "Sync Date",
      },
      { id:"4",
        dataField: "sync_from_user",
        text: "Sync By",
      },
      { id:"5",
        dataField: "is_auto_sync",
        text: "Auto Sync Status",
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

        fetch("/api/v1/sync_history", lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res[0]['obj_list'])
            return this.setState({
            loading: false,
                data : res[0]['obj_list'],
                company_id : "",
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

  const {data, loading} = this.state

    return (
       <div className="page-content">
         <Container fluid>
         {loading ? <LoadingComponent /> :
         <Card>
            <CardBody>
            <CardTitle> Synchronization History </CardTitle>
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
                  <Col md="11" className="text-left">
                    </Col>
                    <Col md="1" className="text-left">
                        <ExportCSVButton className="btn btn-info" { ...props.csvProps }>Export</ExportCSVButton>
                    </Col>

                  </Row>



                    <hr />
                    <BootstrapTable { ...props.baseProps }filter={ filterFactory() }
              pagination={ paginationFactory() } />
                  </div>
                )
              }
            </ToolkitProvider>
            </CardBody>
            </Card>
            }
         </Container>

       </div>


    );
  }
}
export default SyncHistory;