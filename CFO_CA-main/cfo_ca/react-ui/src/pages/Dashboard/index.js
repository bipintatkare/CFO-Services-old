import React, { Component } from "react";
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

//import Charts
import StackedColumnChart from "./StackedColumnChart";
import { MDBDataTable } from "mdbreact";

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";
// es5

// es6
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import LoadingComponent from './loadingComponent';


// Pages Components
import LatestTranaction from "./LatestTranaction";
import FromToComponent from "./FromToComponentNew";
import DashboardMsipage from "./Msipage.js"
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Table
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';


//i18n
import { withNamespaces } from 'react-i18next';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        loading:false,

        };
        this.togglemodal.bind(this);
    }

    togglemodal = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

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


    render() {
    const {data, loading} = this.state

        return (
            <React.Fragment>
                <div className="page-content">
                 {loading ? <LoadingComponent /> :

                    <Container fluid>


                        {/* Render Breadcrumb
                        <Breadcrumbs breadcrumbItem={this.props.t('Dashboard')} />*/}
                        <h3>DASHBOARD</h3>
                        
                        <Row>
                            <Col lg="12">
                                <LatestTranaction />
                            </Col>


                        </Row>
                    </Container>
                 }
                </div>

            </React.Fragment>
        );
    }
}

export default withNamespaces()(Dashboard);
