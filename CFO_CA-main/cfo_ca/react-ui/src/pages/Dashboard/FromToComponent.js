
import React, { useState } from "react";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody,CardTitle, Label, Button,Container, Form, FormGroup, Input, InputGroup,
  InputGroupAddon, Modal } from "reactstrap";

function FromToComponent() {
  const [inputList, setInputList] = useState([{from: "0", to: ""}]);
  const [newInputList, setNewInputList] = useState(0);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { from:"to", to: "" }]);
    console.log(JSON.stringify(inputList))

     {/*  setNewInputList([...newInputList, JSON.stringify(inputList)]);
     console.log(JSON.stringify(newInputList))
      */}
  };




  return (
    <div className="App">
    <br/>
        <br/>
      {inputList.map((x, i) => {
        return (

          <div className="">
          <Row>
          <Col lg="4" className="form-group">
                <Label htmlFor="name">From</Label>
                    <input
                      name="from"
                      placeholder="Enter From Range"
                      type="number"
                      className="form-control"
                      value={x.from}
                      onChange={e => handleInputChange(e, i)}
                    />
            </Col>
          <Col lg="4" className="form-group">
                <Label htmlFor="name">To</Label>
                    <input
                      className="ml10"
                      name="to"
                      type="number"
                      className="form-control"
                      placeholder="Enter To Range"
                      value={x.to}
                      onChange={e => handleInputChange(e, i)}
                    />
            </Col>

            <Col lg="2" className="form-group">
                <br/>
                {inputList.length !== 1 && <button
                className="btn btn-danger"
                onClick={() => handleRemoveClick(i)} style={{marginTop: "7px"}}>Remove</button>}
            </Col>
            <Col lg="2" className="form-group">
              <br/>
               {inputList.length - 1 === i && <button  className="btn btn-success"
               onClick={handleAddClick} style={{marginTop: "7px"}}>Add</button>}
            </Col>
            </Row>


            <div>


            </div>
          </div>
        );
      })}
      {/*
      <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
      */}

    </div>
  );
}

export default FromToComponent;
