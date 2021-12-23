import React, { Component } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { withRouter } from 'react-router';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import "./datatables.scss";
import LoadingComponent from '../Dashboard/loadingComponent';

class ThreadList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  handleRowClick(thread_id) {
    if (this.props.redirect_perticular) {
      this.props.history.push(`/thread-wise-task/${thread_id}`)
    } else {
      this.props.history.push(`/update-thread/${thread_id}`)
    }
  }

  componentDidMount() {
    // MeetingThreads
    fetch(process.env.REACT_APP_BASEURL_BACKEND + '/mom/meeting-threads/')
      .then(res => {
        if (res.status > 400) {
          return console.log("Something went wrong")
        }
        return res.json()
      })
      .then(meeting_threads => {
        let data_meeting_threads = meeting_threads.map(
          (thread, i) => {
            return {
              clickEvent: () => this.handleRowClick(thread.id),
              title: thread.title,
              organizer_name: thread.organizer_name,
              created_at: thread.created_at,
              summary: thread.summary,
              company_name: thread.company_name,
              task_status: thread.task_status
            };
          });
        return this.setState({ meeting_threads: data_meeting_threads, loading: false });
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {

    const { meeting_threads, loading } = this.state

    const data = {
      columns: [
        {
          label: "Thread Title",
          field: "title",
          sort: "asc",
          width: 150
        },
        {
          label: "Completed tasks",
          field: "task_status",
          width: 100
        },
        {
          label: "Organizer",
          field: "organizer_name",
          sort: "asc",
          width: 150
        },
        {
          label: "Company",
          field: "company_name",
          sort: "asc",
        },
        {
          label: "Summary",
          field: "summary",
          sort: "asc",
          width: 400
        }
      ],

      rows: meeting_threads
    };
    return (
      <React.Fragment>
        <div className="">
          {loading ? <LoadingComponent /> :
          <div className="container-fluid">

            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <CardTitle>Thread Entries </CardTitle>
                    <CardSubtitle className="mb-3">
                      Below are the thread entries.
                  </CardSubtitle>

                    <MDBDataTableV5 responsive striped bordered data={data} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          }
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ThreadList);
