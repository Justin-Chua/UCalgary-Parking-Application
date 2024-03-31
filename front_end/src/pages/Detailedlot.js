import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function DetailedLot() {
    // Dummy data for demonstration
    const [parkingStalls, setParkingStalls] = useState([]);
    const totalStalls = 112; // Total number of stalls

    useEffect(() => {
        // Generate dummy data for demonstration
        const generateParkingStalls = () => {
            const newStalls = [];
            for (let i = 1; i <= totalStalls; i++) {
                newStalls.push({ id: i, available: Math.random() < 0.5 });
            }
            setParkingStalls(newStalls);
        };

        generateParkingStalls();
    }, []);

    const renderParkingStalls = () => {
        // For multiple groups
        const stallsPerGroup = 14;
        const totalGroups = Math.ceil(parkingStalls.length / stallsPerGroup);

        const groups = [];

        for (let groupIndex = 0; groupIndex < totalGroups; groupIndex++) {
            const startIdx = groupIndex * stallsPerGroup;
            const endIdx = Math.min(startIdx + stallsPerGroup, parkingStalls.length);
            const groupStalls = parkingStalls.slice(startIdx, endIdx);

            const groupRows = [];

            for (let rowIndex = 0; rowIndex < Math.ceil(groupStalls.length / 2); rowIndex++) {
                const rowStalls = groupStalls.slice(rowIndex * 2, rowIndex * 2 + 2);
                const rowButtons = rowStalls.map(stall => (
                    <Button 
                        key={stall.id} 
                        variant={stall.available ? 'success' : 'danger'} 
                        disabled={!stall.available}
                        style={{ width: '90px', height: '100px', margin: '1px', borderRight: '2px solid yellow' }}
                    >
                        {stall.id}
                    </Button>
                ));
                groupRows.push(
                    <Row key={rowIndex} className="mb-0" style={{ borderBottom: '1px solid yellow', height: 'auto', width: '200px' }}>
                        {rowButtons}
                    </Row>
                );
            }

            let marginLeft = 0;
            let marginRight = 0;

            // Calculate margin dynamically for centering based on the number of groups
            const totalMargin = 8 - totalGroups;
            marginLeft = marginRight = totalMargin * 20; // Adjust as needed

            groups.push(
                <Col key={groupIndex} style={{ marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, marginBottom: '20px' }}>
                    <Container>
                        {groupRows}
                    </Container>
                </Col>
            );
        }

        return groups;
    };

    return (
        <div style={{ backgroundColor: '#262625', minHeight: '100vh', padding: '20px' }}>
            <Container fluid className="d-flex align-items-start justify-content-center">
                <Row>
                    {renderParkingStalls()}
                </Row>
            </Container>
        </div>
    );
}

export default DetailedLot;
