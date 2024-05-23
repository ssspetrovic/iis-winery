import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import "../../assets/styles.css";

const ContractSigningPage = () => {
    const { token } = useParams();
    const [partnership, setPartnership] = useState(null);
    const [partner, setPartner] = useState(null);
    const [signature, setSignature] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPartnership = async () => {
            try {
                const response = await axios.get(`partnerships/${token}/`);
                setPartnership(response.data);
            } catch (error) {
                console.error("Error fetching partnership data:", error);
            }
        };

        fetchPartnership();
    }, [token]);

    useEffect(() => {
        const fetchPartner = async (partnerId) => {
            try {
                const response = await axios.get(`/partnerships/partners/${partnerId}/`);
                setPartner(response.data);
            } catch (error) {
                console.error("Error fetching partner data:", error);
            }
        };

        if (partnership && partnership.partner) {
            fetchPartner(partnership.partner);
        }
    }, [partnership]);

    const handleSignContract = async () => {
        if (signature !== partner.name) {
            setError(`Signature must be the partner's name: ${partner.name}`);
            return;
        }

        try {
            await axios.post(`/partnerships/${token}/sign/`, { signature });
            setMessage('Thank you for signing the contract!');
            setError('');
        } catch (error) {
            console.error("Error signing contract:", error);
            setMessage('Error signing contract. Please try again later.');
        }
    };

    if (!partnership || !partner) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="contract-container">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="contract-box">
                        <h1 className="text-center">Sign Contract</h1>
                        <div className="contract-details text-center">
                            <h2>Contract Details:</h2>
                            <p><strong>Partnership Agreement</strong></p>
                            <p className="text-start">
                                This Partnership Agreement ("Agreement") is entered into as of {new Date().toLocaleDateString()}, by and between:
                                <br />
                                - Winery Name: IISWinery
                                <br />
                                - Partner Name: {partner.name}
                            </p>
                            <p className="text-start">
                                The parties agree to the terms and conditions outlined in this Agreement to promote mutual business interests.
                            </p>
                            <p><strong>Terms and Conditions:</strong></p>
                            <p className="text-start">{partnership.terms}</p>
                            <p><strong>Contract start date: {partnership.start_date}</strong></p>
                            <p><strong>Contract end date: {partnership.end_date}</strong></p>

                        </div>
                        <Form className="signature-form" onSubmit={(e) => { e.preventDefault(); handleSignContract(); }}>
                            <FormGroup>
                                <Label for="signature">Your Signature:</Label>
                                <Input
                                    type="text"
                                    id="signature"
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <Button type="submit" color="primary" className="sign-btn">Sign Contract</Button>
                        </Form>
                        {message && <Alert color="success">{message}</Alert>}
                        {error && <Alert color="danger">{error}</Alert>}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ContractSigningPage;