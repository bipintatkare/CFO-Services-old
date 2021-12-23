import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button,Container, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import LoadingComponent from './loadingComponent';
import Select from "react-select";
import makeAnimated from 'react-select/animated';


const optionGroup = [
	{
		label: "Company List",
                
        
		options: [
            

			{ label: "Company A", value: "Company A" },
            
			// { label: obj.company_name, value: obj.id },
			
		]
	},
];


class CompanyMapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
        selectedMulti: null,
        }
        this.handleMulti = this.handleMulti.bind(this);
    }

    handleMulti = selectedMulti => {
		this.setState({ selectedMulti });
	};


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


    fetch(process.env.REACT_APP_BASEURL_BACKEND+"/api/v1/company-mapping", lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response company list",res[0]['obj_list'])
            var Item = res[0]['obj_list'];

            for(var key in Item) {
                var obj = Item[key];  
                              
                optionGroup[0].options.push(obj)
                
                // optionGroup[0].options.push(result)
                console.log(obj);
                
            }
            var result = optionGroup[0].options.map(obj => ({ label: obj.company_name,value: obj.id }));
            console.log(result);
            console.log(optionGroup)
            
        
            return this.setState({
                data : res[0]['obj_list'],
                loading: false,
                optionGroup : result,
            })
        })
    }
    componentDidMount(){
        this.load_data()
    }



    render() {
    const { selectedMulti } = this.state;
        return (
            <React.Fragment>
            <div className="page-content">
            <Row>
            <Col md="8">
                <Container fluid>
                    <Card>
                         <CardBody>
                            <center><h2>Company Mapping</h2></center>

                            <FormGroup className="select2-container">
                                <label className="control-label">Group Name</label>
                                <input className="form-control" type="text" defaultValue="" />
                            </FormGroup>

                            <FormGroup className="select2-container">
                                <label className="control-label">Company Name</label>
                                <Select
                                    value={selectedMulti}
                                    isMulti={true}
                                    onChange={this.handleMulti}
                                    options={optionGroup}
                                    classNamePrefix="select2-selection"
                                />
                            </FormGroup>
                            <center>
                                <Button color="primary" type="submit">Submit</Button>
                            </center>

                        </CardBody>
                    </Card>
                </Container>
            </Col>
            </Row>
            </div>

            </React.Fragment>
        );
    }
}

export default CompanyMapping;