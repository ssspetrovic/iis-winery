import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardHeader } from 'reactstrap';

function AnalyticsReports () {
    const [productionData, setProductionData] = useState([]);
    const [qualityData, setQualityData] = useState([]);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            //const productionResponse = await axios.get('/analytics/production'); // Replace with your API endpoint
            //setProductionData(productionResponse.data);

            //const qualityResponse = await axios.get('/analytics/quality'); // Replace with your API endpoint
            //setQualityData(qualityResponse.data);
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        }
    };

    const productionChartOptions = {
        labels: productionData.map(data => data.date),
        datasets: [
            {
                label: 'Production Volume',
                data: productionData.map(data => data.volume),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    };

    const qualityChartOptions = {
        labels: qualityData.map(data => data.date),
        datasets: [
            {
                label: 'Quality Metric',
                data: qualityData.map(data => data.metric),
                borderColor: 'rgba(153,102,255,1)',
                backgroundColor: 'rgba(153,102,255,0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div>
            <Card className="mb-4">
                <CardHeader>Production Volume Over Time</CardHeader>
                <CardBody>
                    <Line data={productionChartOptions} />
                </CardBody>
            </Card>
            <Card className="mb-4">
                <CardHeader>Quality Metrics Over Time</CardHeader>
                <CardBody>
                    <Line data={qualityChartOptions} />
                </CardBody>
            </Card>
        </div>
    );
};

export default AnalyticsReports;
