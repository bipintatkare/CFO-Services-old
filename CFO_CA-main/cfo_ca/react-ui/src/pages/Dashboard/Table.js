
import React, { useState } from "react";
import { MDBDataTable } from "mdbreact";

    const data = {
      columns: [
        {
          label: "Company Name",
          field: "companyName",
          sort: "asc",
          width: 150
        },
        {
          label: "XYZ",
          field: "xyz",
          sort: "asc",
          width: 270
        },
        {
          label: "<30",
          field: "range1",
          sort: "asc",
          width: 200
        },
        {
          label: "40>",
          field: "range2",
          sort: "asc",
          width: 100
        },
        {
          label: "<60 & 80>",
          field: "range3",
          sort: "asc",
          width: 150
        },

      ],
      rows: [

        {
          companyName: "Cara Stevens",
          xyz: "Sales Assistant",
          range1: "New York",
          range2: "46",
          range3: "2011/12/06",
        },

        {
          companyName: "Donna Snider",
          xyz: "Customer Support",
          range1: "New York",
          range2: "27",
          range3: "2011/01/25",
        }
      ]
    };

function Tablemain() {
  const [inputList, setInputList] = useState([{ from: "", to: "" }]);

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
    setInputList([...inputList, { from: "", to: "" }]);
  };


  return (
    <div className="App">
      {inputList.map((x, i) => {
        return (
          <div className="box">
            <input
              name="from"
              placeholder="Enter From Range"
              value={x.from}
              onChange={e => handleInputChange(e, i)}
            />
            <input
              className="ml10"
              name="to"
              placeholder="Enter To Range"
              value={x.to}
              onChange={e => handleInputChange(e, i)}
            />
            <div className="btn-box">
              {inputList.length !== 1 && <button
                className="mr10"
                onClick={() => handleRemoveClick(i)}>Remove</button>}
              {inputList.length - 1 === i && <button onClick={handleAddClick}>Add</button>}
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
      <MDBDataTable responsive bordered data={inputList} />
    </div>
  );
}

export default Tablemain;