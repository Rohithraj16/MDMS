import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDanger = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" onClick={onCancel}>
            {cancelText}
          </button>

          <button
            type="button"
            className={isDanger ? "confirm-dialog__danger" : ""}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}