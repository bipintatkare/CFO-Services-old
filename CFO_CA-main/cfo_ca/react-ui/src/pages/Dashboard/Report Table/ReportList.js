import React from "react";
import DataTable from "react-data-table-component";
import tableData from "./TableData";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Input, Container } from "reactstrap";

const columns = [
  {
    name: "Title",
    selector: "title",
    sortable: true
  },
  {
    name: "Directior",
    selector: "director",
    sortable: true
  },
  {
    name: "Runtime (m)",
    selector: "runtime",
    sortable: true,
    right: true
  }
];

const conditionalRowStyles = [
  {
    when: row => row.alert,
    style: {
      backgroundColor: "#90ee90",
      userSelect: "none"
    }
  }
];

function ReportList() {
  const [data, setData] = React.useState(tableData);

  const handleRowClicked = row => {
    const updatedData = data.map(item => {
      if (row.id !== item.id) {
        return item;
      }

      return {
        ...item,
        toggleSelected: !item.toggleSelected
      };
    });

    setData(updatedData);
  };

  return (
    <React.Fragment>
    <div className="page-content">
        <Container fluid>
 <Card>
     
        <CardBody>
        <CardTitle>Form</CardTitle>
<Col
          md={12}
          className="form-group align-self-center">
          <Col className="form-group row">
            <label style={{fontSize: "15px"}} className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
          <Input className="col-sm-10" type="text"  name="new_title" placeholder="Enter Your Remark" />
          </div>
          </Col>

          <Col className="row">
          <label style={{fontSize: "15px"}} className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
          <Input className="col-sm-10" type="text" name="new_title" placeholder="Enter Your Remark" />
          </div>
          </Col>
          
            <br/>
            <Col className="row">
          <label style={{fontSize: "15px"}} className="col-sm-2 col-form-label">Choose</label>
          <div className="col-sm-10">
          <select className="form-control col-sm-10">
          <option>Select</option>
          <option>Large select</option>
          <option>Small select</option>
          </select>
          </div>
          </Col>
         
          <br/>
          <Col className="row">
          <label style={{fontSize: "15px"}} className="col-sm-2 col-form-label">Date and Time</label>
          <div className="col-sm-10">
          <Input className="form-control col-sm-6" type="datetime-local" defaultValue="2019-08-19T13:45:00" id="example-datetime-local-input" />
          </div>
          </Col> 

          </Col>                
          </CardBody>
          </Card>      

        <Card>
        <CardBody>
        <CardTitle>Table Data</CardTitle>
      <DataTable
        title="TableData"
        columns={columns}
        data={data}
        defaultSortField="title"
        pagination
        onRowClicked={handleRowClicked}
        conditionalRowStyles={conditionalRowStyles}
      />
      </CardBody>
      </Card>
      </Container>
                </div>
            </React.Fragment>
  );
}

export default ReportList;