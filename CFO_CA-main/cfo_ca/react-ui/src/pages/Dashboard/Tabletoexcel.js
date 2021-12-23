import React, {Component} from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

class Test extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>
                <table id="table-to-xls">
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Age</th>
                    </tr>
                    <tr>
                        <td>Vikas</td>
                        <td>Panchey</td>
                        <td>50</td>
                    </tr>
                    <tr>
                        <td>Tanmay</td>
                        <td>Sonawane</td>
                        <td>94</td>
                    </tr>
                </table>

            </div>
        );
    }
}

export default Test