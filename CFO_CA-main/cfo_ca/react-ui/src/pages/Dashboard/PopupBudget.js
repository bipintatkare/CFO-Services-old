import React, { Component,useState  } from 'react';
import { Row, Col, Card, CardBody, Button, UncontrolledDropdown,Label, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import Popup from "reactjs-popup";
import Modal from 'react-modal';
import { AvForm, AvField } from "availity-reactstrap-validation";



const Popupforweekend =()=>{
const [modalIsOpen, setModalIsOpen] = useState(false)

return(
                            <div className='App'>
      <button className="btn btn-warning" style={{marginLeft:"2%",height:"100%",fontSize:"12px", width:"170px"}} onClick={() => setModalIsOpen(true)}>Budget</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            background: "rgba(0, 0, 0, 0.5)",

          },

          content: {

            marginTop: '200px',
            marginLeft: '300px',
            marginRight: '200px',
            marginBottom: '150px'
          }
        }}
        // shouldCloseOnOverlayClick={false}
      >
      <div>
        <h2>Budget</h2>
        <hr/>

        <h4>Till Date</h4>
        <hr/>

        <AvForm className="needs-validation">
            <Row>
                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Sales Budget</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Gross Margin Target</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Nett Profit Target</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>
 <Col md="12">
                  <h4>Current Month</h4>
        <hr/>
</Col>
                         <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Sales Budget</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Gross Margin Target</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Nett Profit Target</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="12">
                  <h4>Expense Budget(Till Date)</h4>
        <hr/>
</Col>
                         <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Budget1</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Budget2</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Budget3</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                 <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Budget4</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>


                <Col md="12">
                  <h4>Expense Budget(Current Month)</h4>
        <hr/>
</Col>
                         <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Budget1</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Budget2</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Budget3</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>

                 <Col md="6">
                    <FormGroup>
                        <Label htmlFor="validationCustom01">Budget4</Label>
                        <AvField
                          name="Field"
                          placeholder="Field"
                          type="text"
                          errorMessage="Enter Field Field"
                          className="form-control"
                          validate={{ required: { value: true } }}
                          id="validationCustom01"
                        />
                    </FormGroup>
                </Col>
            </Row>
        </AvForm>




      <div>
        <br/>
        <center>
            <Button> Submit </Button>
        </center>
        </div>
        </div>
      </Modal>
    </div>
    );
    }

export default Popupforweekend;