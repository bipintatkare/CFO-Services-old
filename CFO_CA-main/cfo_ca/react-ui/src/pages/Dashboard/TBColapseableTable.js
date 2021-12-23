import React, { Component } from "react";
import { Card, CardBody, CardTitle, Media, Table } from "reactstrap";
import { Link } from "react-router-dom";
import { Collapse } from 'react-collapse';



class TBCollabse extends Component {
    constructor(props) {
        super(props);
        this.state = {
         data: [
      {
        id: "1",
        States: "many",
        Purpose: "web",
        Tags: [
          {
            Key: "Name",
            Value: "server1"
          }
        ]
      },
      {
        id: "2",
        States: "Single",
        Purpose: "App",
        Tags: [
          {
            Key: "Name",
            Value: "server2"
          },
          {
            Key: "env",
            Value: "qa"
          }
        ]
      },
      {
        id: "3",
        States: "None",
        Purpose: "DB",
        Tags: [
          {
            Key: "env",
            Value: "qa"
          },
          {
            Key: "Name",
            Value: "server3"
          }
        ]
      }
    ]
        };
    }

    render() {
    const { data } = this.state;
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <CardTitle className="mb-5">
                            Activity
                        </CardTitle>
                        <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">States</th>
            <th scope="col">Env</th>
            <th scope="col">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map(info => (
            <tr>
              <th scope="row">{info.id}</th>
              <td>{info.States}</td>
              {info.Tags.filter(env => env.Key === "env").map(e => (
                <td>{e.Value}</td>
              ))}
<td>{info.Tags.filter(env => env.Key === "env").map(e => e.Value).join(' ')}</td>
            </tr>
          ))}
        </tbody>
      </Table>



                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default TBCollabse;
