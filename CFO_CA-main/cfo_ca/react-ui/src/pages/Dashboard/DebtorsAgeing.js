import React, { Component } from 'react';
import { Row, Col, Card, CardBody,CardTitle, Label, Button,Container, UncontrolledDropdown, UncontrolledTooltip,
 Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup,
  InputGroupAddon, Modal } from "reactstrap";
import { Link } from "react-router-dom";
import Collaps from "./collapsable";
import SearchFilter from "./SearchFilter"
import DynamicForm from "./DynamicForm";
import FromToComponent from "./FromToComponent";
import LoadingComponent from './loadingComponent';


//Table
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search,CSVExport } from 'react-bootstrap-table2-toolkit';
import filterFactory, { numberFilter, Comparator } from 'react-bootstrap-table2-filter';

//Simple bar
import SimpleBar from "simplebar-react";

const Grater_than="<";
const Smaller_than=">";
const { ExportCSVButton } = CSVExport;

const csvData = [
  ["firstname", "lastname", "email"],
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"]
];


class DebtorsAgeing extends Component {
    constructor(props) {
        super(props);
        this.state = {
data:[],
rows: [],
visible: false,
modal_large: false,
loading:true,

 datamain: [
      {
        id:"1",
        dataField: "id",
        text: "Id",
      },
      { id:"3",
        dataField: "customer_name",
        text: "Customer Name",
      },
      { id:"2",
        dataField: "amount",
        text: "Amount",

      },

      {
        dataField: "days",
        text: "Days",
      },


    ],
    current: {}
        }
this.tog_large = this.tog_large.bind(this);
    }

    removeBodyCss() {
    document.body.classList.add("no_padding");
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



handleAddRow = () => {
    const item = {
      name: ""
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

  handleAddRowNested = () => {
    const item1 = {
      name1: ""
    };
    this.setState({
      rows1: [...this.state.rows1, item1]
    });
  };
  handleRemoveRow = (e, idx) => {
    if (typeof (idx) != "undefined")
      document.getElementById("addr" + idx).style.display = "none";
  };
  handleRemoveRowNested = (e, idx) => {
    document.getElementById("nested" + idx).style.display = "none";
  };

  handleParentData = (e,f) => {
     if (f==null){
     console.log("e")
     console.log(e)
     this.setState({
company_id: e,
})

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
        console.log("{this.state.company_id}")

fetch("/api/v1/mis_dar/"+`${e}`, lookups)
//        fetch("/api/v1/mis_dar/2")
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()

        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
            loading: false,
                data : res[0].ageing
            })

        })
        .catch(err => {
            console.log(err)
        })
     }else{
     this.setState({
from_date: e,
to_date: f,
})

this.load_details_date_range(e,f);
     }

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

        fetch("/api/v1/mis_dar/"+`${this.props.match.params.id}`, lookups)
//        fetch("/api/v1/mis_dar/2")
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()

        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
            loading: false,
                data : res[0].ageing
            })

        })
        .catch(err => {
            console.log(err)
        })
    }

        componentDidMount(){
        this.load_companies()

    }
handleParentData = (e,f) => {
     if (f==null){
     console.log("e")
     console.log(e)
     this.setState({
company_id: e,
})

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
        console.log("{this.state.company_id}")

fetch("/api/v1/mis_dar/"+`${e}`, lookups)
//        fetch("/api/v1/mis_dar/2")
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()

        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
            loading: false,
                data : res[0].ageing
            })

        })
        .catch(err => {
            console.log(err)
        })
     }else{
     this.setState({
from_date: e,
to_date: f,
})

this.load_details_date_range(e,f);
     }

  }



//for dynamic data in  input field

  onSubmit = model => {
    let datamain = [];
    if (model.id) {
      datamain = this.state.datamain.filter(d => {
        return d.id != model.id;
      });
    } else {
      model.id = +new Date();
      datamain = this.state.datamain.slice();
    }

    this.setState({
      datamain: [model, ...datamain],
      current: {} // todo
    });
  };

  onEdit = id => {
    let record = this.state.datamain.find(d => {
      return d.id == id;
    });
    //alert(JSON.stringify(record));
    this.setState({
      current: record
    });
  };

  onNewClick = e => {
    this.setState({
      current: {}
    });
  };

//endfor dynamic data in  input field




    render() {
    const {data,loading} = this.state
    //for dynamic data in  input field
            let datamain = this.state.datamain.map(d => {
      return (
        <tr key={d.id}>
          <td>{d.dataField}</td>
          <td>{d.text}</td>

          <td>
            <button className="btn btn-primary"
              onClick={() => {
                this.onEdit(d.id);
              }}
            >
              edit
            </button>
          </td>
        </tr>
      );
    });
    //endfor dynamic data in  input field
        return (
            <React.Fragment>
            <div className="page-content">
                    <Container fluid>
            <SearchFilter mis_id="2" company_id ={this.props.match.params.id} handleData={this.handleParentData}/>



                                <Card>
                                   <center><h2 style={{marginTop:"2%"}}>Debtors Ageing Report</h2></center>
                                  <Container>
                                  <br/>

                                       <br/>

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
                                                  Add New Filter Column
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
                                                      {/* For Dynamic Input Field */}

                                                            {/*
                                                            <div className="form-actions">

                                                              <button onClick={this.onNewClick} type="submit">
                                                                NEW
                                                              </button>
                                                            </div>
                                                             <BootstrapTable
                                                            keyField="id"
                                                            data={data}
                                                            columns={this.state.datamain}
                                                            striped
                                                            hover
                                                            filter={ filterFactory() }
                                                             pagination={ paginationFactory() }
                                                          />

                                                            */}
                                                            <FromToComponent/>

                                                            <hr/>
                                                             {/*
                                                            <DynamicForm
                                                              key={this.state.current.id}
                                                              className="form"

                                                              defaultValues={this.state.current}
                                                              model={[
                                                                { key: "dataField", label: "Column Name ", props: { required: true } },
                                                                { key: "text", label: "Filter Type " },

                                                              ]}
                                                              onSubmit={model => {
                                                                this.onSubmit(model);
                                                              }}
                                                            />

                                                            <table border="1" className="table">
                                                              <tbody>{datamain}</tbody>
                                                            </table>

                                                             For Dynamic Input Field */}
                                              </div>
                                            </Modal>
                                        <Card>


                                          <ToolkitProvider
                                              keyField="id"
                                              data={data}
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
                                                    <Col md="6" className="text-right">
                                                            <button
                                                                type="button"
                                                                onClick={this.tog_large}
                                                                className="btn btn-info waves-effect waves-light"
                                                                data-toggle="modal"
                                                                data-target=".bs-example-modal-lg"
                                                              >
                                                               + Add New Filter Column
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
                                          </Card>
                                    </Container>
                            </Card>
                            </Container>
                            </div>

            </React.Fragment>
        );
    }
}

export default DebtorsAgeing;