import React, { Component } from 'react';
import { DataTableSkeleton, Pagination } from 'carbon-components-react';
import AlertsTable from './AlertsTable';
import elasticsearch from 'elasticsearch';

class Alerts extends Component {
  state = {
    rows: [],
    totalItems: 0,
    firstRowIndex: 0,
    currentPageSize: 10,
    loading: true,
  };

  setCurrentPageSize = pageSize => {
    this.setState({ currentPageSize: pageSize });
  };
  setFirstRowIndex = index => {
    this.setState({ firstRowIndex: index });
  };

  componentDidMount() {
    //const alertData=ALERTS;
    const client = new elasticsearch.Client({
      host: 'https://elastic:pwd12345@5.10.108.247:9200',
      apiVersion: '7.6', // use the same version of your Elasticsearch instance
    });
    client.search(
      {
        index: 'automataactivity',
        size: 100,
        body: {
          query: {
            bool: {
              must: [
                {
                  term: {
                    'automata_status.keyword': {
                      value: 'Exception',
                    },
                  },
                },
                {
                  term: {
                    active: {
                      value: true,
                    },
                  },
                },
                {
                  range: {
                    last_status_changed: {
                      gte: '2020-10-01T18:30:00.000Z',
                      lte: '2020-10-10T18:30:00.000Z',
                    },
                  },
                },
              ],
            },
          },
        },
      },
      (err, result) => {
        if (err) console.log(err);
        if (result) {
          let alertArray = [];
          let alert = {};
          result.hits.hits.forEach(function(element) {
            alert['id'] = element._source.incident_id;
            alert['priority'] = element._source.automata_priority;
            alert['automataName'] = element._source.automata_name;
            alert['jobId'] = element._source.job_id;
            alert['duration'] = 10;
            alert['sessionNo'] = 1;
            alert['status'] = element._source.automata_status;
            alert['updatedOn'] = element._source.last_status_changed;
            alert['errorInfo'] = element._source.automata_info;
            alertArray.push(alert);
            alert = {};
          });
          console.log('Alerts', alertArray);
          this.setState({ rows: alertArray });
          this.setState({ totalItems: alertArray.length });
          this.setState({ loading: false });
          console.log(this.state.rows);
        }
      }
    );
  }
  render() {
    const { rows } = this.state.rows;
    //var totalItems = rows.length;
    //const setTotalItems = () => {totalItems=rows.totalItems;};
    // var setCurrentPageSize = (pageSize) => { currentPageSize = pageSize };
    //var setFirstRowIndex = (index) => { firstRowIndex = index };

    //const headers=this.state.alerts.headers;
    const headers = [
      {
        key: 'id',
        header: 'Incident #',
      },
      {
        key: 'priority',
        header: 'Priority',
      },
      {
        key: 'process',
        header: 'Process Name',
      },
      {
        key: 'jobId',
        header: 'Job ID',
      },
      {
        key: 'duration',
        header: 'Duration (mins)',
      },
      {
        key: 'sessionNo',
        header: 'Session #',
      },
      {
        key: 'status',
        header: 'Status',
      },
      {
        key: 'updatedOn',
        header: 'Updated On',
      },
      {},
    ];

    if (this.state.loading) {
      return (
        <div>
          <DataTableSkeleton
            columnCount={headers.length + 1}
            rowCount={10}
            headers={headers}
          />
        </div>
      );
    } else {
      return (
        <div>
          <AlertsTable
            headers={headers}
            rows={this.state.rows.slice(
              this.state.firstRowIndex,
              this.state.firstRowIndex + this.state.currentPageSize
            )}
          />
          <Pagination
            totalItems={this.state.totalItems}
            backwardText="Previous page"
            forwardText="Next page"
            pageSize={this.state.currentPageSize}
            pageSizes={[5, 10, 15, 25]}
            itemsPerPageText="Items per page"
            onChange={({ page, pageSize }) => {
              if (pageSize !== this.state.currentPageSize) {
                this.setState({ currentPageSize: pageSize });
              }
              //setFirstRowIndex(pageSize * (page - 1));
              let newFirstRowIndex = pageSize * (page - 1);
              this.setState({ firstRowIndex: newFirstRowIndex });
            }}
          />
        </div>
      );
    }
  }
}
export default Alerts;
