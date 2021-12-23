import React, { Component,useState  } from 'react';
import { Row, Col, Card, CardBody, Button, UncontrolledDropdown,
 UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Form, FormGroup, Input, InputGroup, InputGroupAddon, Label } from "reactstrap";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import Popup from "reactjs-popup";
import Modal from 'react-modal';




class Popupforweekend extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state={
            companies:[],
            from_date : "",
            to_date : "",
            modalIsOpen : false,
            email : "vikas.pandey9323@gmail.com",
        }
    }
     onSubmit(e) {
        e.preventDefault();
         alert(this.state.from_date);
         alert(this.state.to_date);

    }

     send_mail = (inputValue) => {
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

        fetch("/api/v1/send_mail/"+`${this.state.email}`, lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res);
alert(res.Success);
            return this.setState({
                data_received : res
            })


        })
        .catch(err => {
            console.log(err)
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
        this.load_companies()
    }



       render() {

        return(
                            <div className='App'>
      <Button className=" btn" style={{width: "100%"}} onClick={() =>   this.setState({
            modalIsOpen: true,
        })}>Schedule Email <i className="mdi mdi-email-box"></i></Button>
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={() =>   this.setState({
            modalIsOpen: false,
        })}
        style={{
          overlay: {
            background: "rgba(0, 0, 0, 0.5)",

          },

          content: {
            color: 'orange',
            marginTop: '100px',
            marginLeft: '300px',
            marginRight: '200px',
            marginBottom: '350px'
          }
        }}
        // shouldCloseOnOverlayClick={false}
      >
      <div>
<h2>Send Email</h2>
         <div className="form-group">
                <Label style={{color:"black"}}> Enter Email:  </Label>
                <Input value={this.email} onChange={this.handleChange.bind(this)} name="email" type="email" />
              </div>


        <div>
        <br/>
        <center>
          <button className="btn btn-primary" onClick={()=> {
          this.send_mail();
          this.setState({
            modalIsOpen: false,
        })

          } }>Send</button></center>
        </div>
        </div>
      </Modal>
    </div>
    );
    }




    }




export default Popupforweekend;