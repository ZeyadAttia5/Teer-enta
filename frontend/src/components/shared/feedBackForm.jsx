import React, { useState } from 'react';
import { Form, Rate, Input, Button, Card } from 'antd';

const { TextArea } = Input;

// Generic Feedback Form Component
const FeedbackForm = ({ entity, onSubmit }) => {
    const [feedback, setFeedback] = useState({ rating: 0, comment: '' });

    // Handle rating change
    const handleRatingChange = (newRating) => {
        setFeedback((prev) => ({
            ...prev,
            rating: newRating,
        }));
    };

    // Handle comment change
    const handleCommentChange = (e) => {
        setFeedback((prev) => ({
            ...prev,
            comment: e.target.value,
        }));
    };

    // Call the provided handleSubmit function on form submission
    const handleSubmit = () => {
        console.log(`Submission entity id: ${entity._id}`)
        onSubmit({
            entityId: entity._id,
            rating: feedback.rating,
            comment: feedback.comment,
        });
    };

    return (
        <Form onFinish={handleSubmit} layout="vertical">
            <Card title={`${entity?.name}`} style={{ marginBottom: '20px' }}>
                <Form.Item label={`Rate your experience with this ${entity?.name}`}>
                    <Rate
                        value={feedback.rating}
                        onChange={handleRatingChange}
                    />
                </Form.Item>
                <Form.Item label="Provide a comment:">
                    <TextArea
                        rows={3}
                        value={feedback.comment}
                        onChange={handleCommentChange}
                        placeholder="Write your comment here..."
                    />
                </Form.Item>
            </Card>
            <Form.Item>
                <Button type="danger" className="bg-blue-950 hover:bg-black text-white" htmlType="submit">
                    Submit Feedback
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FeedbackForm;
