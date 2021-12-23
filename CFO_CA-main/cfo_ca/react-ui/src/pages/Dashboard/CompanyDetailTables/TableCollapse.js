import React, { Component } from 'react';
import { Row, Col, Card, CardBody,CardTitle, Label, Button,Container, UncontrolledDropdown, UncontrolledTooltip,
 Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup,
  InputGroupAddon, Modal } from "reactstrap";
import { Link } from "react-router-dom";
import SearchFilter from "../SearchFilter"


class TableCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {
         data : [
                {id : 1, date : "2014-04-18", total : 121.0, status : "Shipped", name : "A"},
                {id : 2, date : "2014-04-21", total : 121.0, status : "Not Shipped", name : "B"},
                {id : 2, date : "2014-04-21", total : 121.0, status : "Not Shipped", name : "B"},
                {id : 3, date : "2014-04-21", total : 121.0, status : "Not Shipped", name : "B"},
                {id : 4, date : "2014-08-09", total : 121.0, status : "Not Shipped", name : "C"},
                {id : 5, date : "2014-04-24", total : 121.0, status : "Shipped", name : "D"},
                {id : 6, date : "2014-04-26", total : 121.0, status : "Shipped", name : "E"},
            ],
            expandedRows : []

        }
    }

      handleRowClick(rowId) {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

        const newExpandedRows = isRowCurrentlyExpanded ?
			currentExpandedRows.filter(id => id !== rowId) :
			currentExpandedRows.concat(rowId);

        this.setState({expandedRows : newExpandedRows});
    }

    renderItem(item) {
        const clickCallback = () => this.handleRowClick(item.id);

        const itemRows = [
			<tr onClick={clickCallback} key={"row-data-" + item.id}>
			    <td>{item.date}</td>
			    <td>{item.total}</td>
			    <td>{item.status}</td>
			</tr>
        ];

        if(this.state.expandedRows.includes(item.id)) {
            itemRows.push(
                <tr key={"row-expanded-" + item.id}>
                    <td>{item.name}</td>
                    <td>{item.points}</td>
                    <td>{item.percent}</td>
                </tr>
            );
        }

        return itemRows;
    }

    render() {
     let allItemRows = [];

        this.state.data.forEach(item => {
            const perItemRows = this.renderItem(item);
            allItemRows = allItemRows.concat(perItemRows);
        });
        return (
            <React.Fragment>
            <div className="page-content">
                    <Container fluid>
                     <SearchFilter/>
                     <Card>
                        <CardBody>
                            <CardTitle>
                                <center>
                                    Table Collapse
                                </center>
                            </CardTitle>
                            <CardBody>
                                <table className="table table table-bordered">
                                    <thead className="thead-dark">
                                        <tr>
                                          <th scope="col"><center> Date </center></th>
                                          <th scope="col"><center> Total  </center></th>
                                          <th scope="col"><center>Status </center></th>
                                        </tr>
                                     </thead>
                                    {allItemRows}
                                </table>

                            </CardBody>
                        </CardBody>
                     </Card>


                    </Container>
            </div>

            </React.Fragment>
        );
    }
}

export default TableCollapse;