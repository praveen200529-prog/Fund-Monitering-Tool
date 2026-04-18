import React from 'react';
import { HiOutlineExclamation } from 'react-icons/hi';

export default function DeleteConfirm({ itemName, onConfirm, onCancel }) {
  return (
    <>
      <div className="delete-confirm">
        <div className="delete-confirm-icon">
          <HiOutlineExclamation />
        </div>
        <h3>Delete {itemName || 'this record'}?</h3>
        <p>This action cannot be undone. Are you sure you want to proceed?</p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </>
  );
}
