import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import InputForm from './form';
import './map.css';

export default function ModalPopup({ data, error, onSubmit, isOpen, toggle }) {
    const [dataFilled, setFilled] = useState(true);
    
    useEffect(() => {
        const isFilled = data.every((elem) => elem.value != null);
        setFilled(isFilled);
    }, [data]);
    
    return (
        <Modal show={isOpen} onHide={toggle} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Marker</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <InputForm
                    data={data}
                />
            </Modal.Body>
            <div className="error-message">{error}</div>
            <Modal.Footer>
                <button id="submit-btn" onClick={onSubmit} disabled={!dataFilled}>Add</button>
            </Modal.Footer>
        </Modal>
    );
}