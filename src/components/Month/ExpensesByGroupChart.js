import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import Loader from '../../components/Loader';

import MonthService from '../../service/MonthService';
import { numberToCurrency } from '../../helpers/currency';
import { colors } from '../../helpers/colors';

const cardStyle = {
  marginTop: '2rem',
};

const defaultState = {
  isLoaded: false,
  groupSums: [],
};

const prepareChartData = (groupSums) => {
  return Object.keys(groupSums).map((group) => {
    return { name: group, value: groupSums[group] };
  });
};

class ExpensesByGroupChart extends Component {
  state = { ...defaultState };

  componentDidMount() {
    this.getChartData();
  }

  getChartData = async () => {
    const { user, startDate, endDate } = this.props;
    MonthService.getChartData(user.auth_token, startDate, endDate).then(
      (result) => {
        this.setState({
          groupSums: result.groupSums,
          isLoaded: true,
        });
      }
    );
  };

  render() {
    const { isLoaded, groupSums } = this.state;
    if (!isLoaded) return <Loader />;

    const chartData = prepareChartData(groupSums);
    return (
      <>
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle className='card-title' tag='h2'>
              Expenses
            </CardTitle>
          </CardHeader>
          <CardBody className='card-body'>
            <PieChart width={225} height={250}>
              <Pie data={chartData} cx='50%' cy='50%' outerRadius={110}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % 8]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  return numberToCurrency.format(value);
                }}
              />
            </PieChart>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default ExpensesByGroupChart;
