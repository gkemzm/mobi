"use client";

import { useEffect, useState } from "react";
import type {
  Campaign,
  CampaignFormErrors,
  CampaignFormValues,
  CampaignPlatform,
} from "@/types/marketing";
import {
  createCampaignFromForm,
  formatNumberWithComma,
  getInitialCampaignForm,
  removeNonNumeric,
  validateCampaignForm,
} from "./util";
import classes from "./campaignAddModal..module.scss";

interface CampaignAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (campaign: Campaign) => void;
}

const PLATFORM_OPTIONS: CampaignPlatform[] = ["Google", "Meta", "Naver"];

const CampaignAddModal = ({
  open,
  onClose,
  onSubmit,
}: CampaignAddModalProps) => {
  const [form, setForm] = useState<CampaignFormValues>(
    getInitialCampaignForm()
  );
  const [errors, setErrors] = useState<CampaignFormErrors>({});

  useEffect(() => {
    if (!open) {
      setForm(getInitialCampaignForm());
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const handleChange = <T extends keyof CampaignFormValues>(
    key: T,
    value: CampaignFormValues[T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleSubmit = () => {
    const nextErrors = validateCampaignForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const newCampaign = createCampaignFromForm(form);
    onSubmit(newCampaign);
    onClose();
  };

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <div className={classes.header}>
          <div className={classes.titleWrap}>
            <div className={classes.iconBox}>＋</div>
            <h2 className={classes.title}>캠페인 등록</h2>
          </div>

          <button
            type="button"
            className={classes.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={classes.body}>
          <div className={classes.field}>
            <label className={classes.label}>
              캠페인명 <span className={classes.required}>*</span>
            </label>
            <input
              type="text"
              className={`${classes.input} ${
                errors.name ? classes.errorInput : ""
              }`}
              placeholder="캠페인명을 입력하세요"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <p className={classes.errorText}>{errors.name}</p>}
          </div>

          <div className={classes.field}>
            <label className={classes.label}>
              광고 매체 <span className={classes.required}>*</span>
            </label>
            <div className={classes.platformGroup}>
              {PLATFORM_OPTIONS.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  className={`${classes.platformButton} ${
                    form.platform === platform ? classes.platformActive : ""
                  }`}
                  onClick={() => handleChange("platform", platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
            {errors.platform && (
              <p className={classes.errorText}>{errors.platform}</p>
            )}
          </div>

          <div className={classes.row}>
            <div className={classes.field}>
              <label className={classes.label}>
                예산 <span className={classes.required}>*</span>
              </label>

              <div className={classes.inputWrap}>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`${classes.input} ${
                    errors.budget ? classes.errorInput : ""
                  }`}
                  placeholder="0"
                  value={formatNumberWithComma(form.budget)}
                  onChange={(e) =>
                    handleChange("budget", removeNonNumeric(e.target.value))
                  }
                />
                <span className={classes.unit}>원</span>
              </div>

              {errors.budget && (
                <p className={classes.errorText}>{errors.budget}</p>
              )}
            </div>

            <div className={classes.field}>
              <label className={classes.label}>
                집행금액 <span className={classes.required}>*</span>
              </label>

              <div className={classes.inputWrap}>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`${classes.input} ${
                    errors.spend ? classes.errorInput : ""
                  }`}
                  placeholder="0"
                  value={formatNumberWithComma(form.spend)}
                  onChange={(e) =>
                    handleChange("spend", removeNonNumeric(e.target.value))
                  }
                />
                <span className={classes.unit}>원</span>
              </div>

              {errors.spend && (
                <p className={classes.errorText}>{errors.spend}</p>
              )}
            </div>
          </div>

          <div className={classes.row}>
            <div className={classes.field}>
              <label className={classes.label}>
                집행 시작일 <span className={classes.required}>*</span>
              </label>
              <input
                type="date"
                className={`${classes.input} ${
                  errors.startDate ? classes.errorInput : ""
                }`}
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
              {errors.startDate && (
                <p className={classes.errorText}>{errors.startDate}</p>
              )}
            </div>

            <div className={classes.field}>
              <label className={classes.label}>
                집행 종료일 <span className={classes.required}>*</span>
              </label>
              <input
                type="date"
                className={`${classes.input} ${
                  errors.endDate ? classes.errorInput : ""
                }`}
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
              {errors.endDate && (
                <p className={classes.errorText}>{errors.endDate}</p>
              )}
            </div>
          </div>
        </div>

        <div className={classes.footer}>
          <button
            type="button"
            className={classes.cancelButton}
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className={classes.submitButton}
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignAddModal;
