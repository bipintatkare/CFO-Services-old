import React, { Component,useState } from 'react';
import { Row, Col, Card, CardBody, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown,
DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import Popup from "reactjs-popup";
import Modal from 'react-modal';
import Popupforweekend from './PopupComponent';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import LoadingComponent from './loadingComponent';


//Simple bar
import SimpleBar from "simplebar-react";


const padd = {
      padding:"10px",
    };


class SearchFilter extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state={
            companies:[],
            from_date : "",
            to_date : "",
            company_id : "",
            loading:true,
        }
    }

  handleChangeCompanies = (event) => {
  console.log("event.target.value")
  console.log(event.target.value)
    this.setState({ company_id: event.target.value });
    this.props.handleData(event.target.value,null)
  };
 onSubmit(e) {
        e.preventDefault();

              this.props.handleData(this.state.from_date,this.state.to_date)
              this.setState({
                loading: false,
                })

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

        fetch("/api/v1/company_list/", lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
                companies : res
            })
        })
        .catch(err => {
            console.log(err)
        })
    }


     handleChange = (e) => {
        console.log('e.target', e.target)
        return this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount(){
       this.setState({
            company_id: this.props.company_id,
        })
        this.load_companies()
    }

    render() {
    const {mis_id} = this.props
        const {companies} = this.state
        const {date} = this.state
        const {company_id} = this.state

        return(

<Row>
                 <Col md="12">
                    <Card>
                    <CardBody>
                    <Row>
                        <Col md="2" sm="6" xs="6" style={padd}>
                            <input value={this.date} onChange={this.handleChange.bind(this)} name="date" type="month" className="form-control "/>
                        </Col>

                        <Col md="1" style={padd}>
                        <center>
                           <button onClick={this.onSubmit} type="button" class="btn btn-success">Search</button>
                        </center>
                        </Col>
                        <Col md="3"  style={padd}>
                         <center>
                         <Popupforweekend/>
                        </center>
                        </Col>

                        <Col md="4" style={padd}><center>
                            <select onChange={this.handleChangeCompanies} className="btn btn-secondary" value={company_id}>
                             {companies!=null && companies.length > 0? companies.map((companyItem,index)=>{
                                return(
                                     <option value={companyItem.id}>{companyItem.company_name}</option>
                                      )
                                        })
                                         :
                                         <option value="0">No Companies Found</option>
                                        }
                      </select>
                      </center>
                         </Col>


                    </Row>
                    </CardBody>
                    </Card>
                 </Col>

</Row>


)
    }


    }

    export default SearchFilter;
