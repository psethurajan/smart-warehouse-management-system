import { MdClose } from "react-icons/md";

// Simple reusable modal used for all "Add / Edit" forms across the app
const Modal = ({ title, onClose, children }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
