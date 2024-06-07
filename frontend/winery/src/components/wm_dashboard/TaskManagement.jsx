import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { ListGroup, ListGroupItem, Button, Form, Input, Label, Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';

function TaskManagement() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            //const response = await axios.get(`/tasks/`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async () => {
        if (!newTask) return;
        try {
            //const response = await axios.post('/wine-prod/tasks', { description: newTask });
            setTasks([...tasks, response.data]);
            setNewTask('');
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const markTaskAsComplete = async (taskId) => {
        try {
            //await axios.patch(`/wine-prod/tasks/${taskId}`, { completed: true });
            //setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: true } : task));
        } catch (error) {
            console.error("Error marking task as complete:", error);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <CardHeader>
                            <h3 className="mb-0">Task Management</h3>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={(e) => { e.preventDefault(); addTask(); }}>
                                <Label for="newTask">Add New Task</Label>
                                <Input
                                    type="text"
                                    id="newTask"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Enter a new task description"
                                    className="mb-3"
                                />
                                <Button color="primary" type="submit" className="w-100">Add Task</Button>
                            </Form>
                            <ListGroup className="mt-4">
                                {tasks.map(task => (
                                    <ListGroupItem key={task.id} className="d-flex justify-content-between align-items-center">
                                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                            {task.description}
                                        </span>
                                        {!task.completed && (
                                            <Button color="success" onClick={() => markTaskAsComplete(task.id)}>
                                                Mark as Complete
                                            </Button>
                                        )}
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TaskManagement;
