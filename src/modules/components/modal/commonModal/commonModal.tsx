"use client";

import { ReactNode } from "react";
import classes from "./commonModal.module.scss";

interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
}

const CommonModal = ({
  open,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = 720,
}: CommonModalProps) => {
  if (!open) return null;

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div
        className={classes.modal}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.header}>
          <div className={classes.titleWrap}>
            {icon && <div className={classes.iconBox}>{icon}</div>}
            {title && <h2 className={classes.title}>{title}</h2>}
          </div>

          <button
            type="button"
            className={classes.closeButton}
            onClick={onClose}
            aria-label="모달 닫기"
          >
            ×
          </button>
        </div>

        <div className={classes.body}>{children}</div>

        {footer && <div>{footer}</div>}
      </div>
    </div>
  );
};

export default CommonModal;
