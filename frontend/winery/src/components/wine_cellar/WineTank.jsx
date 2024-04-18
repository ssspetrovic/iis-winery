import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Progress } from 'reactstrap';

const WineTank = ({ wineTank }) => {
  const { tank_id, capacity, current_volume } = wineTank;

  // Calculate the progress percentage
  const progress = (current_volume / capacity) * 100;

  return (
    <Card className="mb-3">
      <CardImg top width="100%" src="../images/barrel_template.png"/>
      <CardBody>
        <CardTitle className="font-weight-bold">{tank_id}</CardTitle>
        <CardText>
          <strong>Capacity:</strong> {capacity} liters
        </CardText>
        <CardText>
          <strong>Current Volume:</strong>
          <Progress value={progress} />
        </CardText>
      </CardBody>
    </Card>
  );
};

export default WineTank;
