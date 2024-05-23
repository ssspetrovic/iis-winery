import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

const SendContract = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [terms, setTerms] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendContract = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/partnerships/create/', {
        partner: partnerId,
        start_date: startDate,
        end_date: endDate,
        terms: terms,
      });
      setSuccessMessage('Contract sent successfully');
      setErrorMessage('');
      // Optionally redirect after success
      setTimeout(() => {
        navigate('/view-partners');
      }, 2000);
    } catch (error) {
      setErrorMessage('Error sending contract. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center">Send Contract</h1>
          <Form onSubmit={handleSendContract}>
            <FormGroup>
              <Label for="terms">Terms</Label>
              <Input
                type="textarea"
                name="terms"
                id="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input
                type="date"
                name="startDate"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input
                type="date"
                name="endDate"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </FormGroup>
            {successMessage && <Alert color="success">{successMessage}</Alert>}
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            <Button type="submit" color="primary" className="mt-4">
              Send Contract
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SendContract;
