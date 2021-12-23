import React, { Component } from "react";
import DynamicForm from "./DynamicForm";

class App extends Component {
  state = {
    datamain: [
      {
        id: 1,
        dataField: "a",
        text: 29,
      },
      {
        id: 2,
        dataField: "b",
        text: 35,
      },
      {
        id: 3,
        dataField: "c",
        text: 42,

      }
    ],
    current: {}
  };

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

  render() {
    let datamain = this.state.datamain.map(d => {
      return (
        <tr key={d.id}>
          <td>{d.dataField}</td>
          <td>{d.text}</td>

          <td>
            <button
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

    return (
      <div className="App">
        <div className="form-actions">
          <button onClick={this.onNewClick} type="submit">
            NEW
          </button>
        </div>
        <DynamicForm
          key={this.state.current.id}
          className="form"
          title="Registration"
          defaultValues={this.state.current}
          model={[
            { key: "dataField", label: "dataField", props: { required: true } },
            { key: "text", label: "text" },

          ]}
          onSubmit={model => {
            this.onSubmit(model);
          }}
        />

        <table border="1">
          <tbody>{datamain}</tbody>
        </table>
      </div>
    );
  }
}

export default App;