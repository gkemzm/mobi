// utils/campaignForm.ts
import type {
  Campaign,
  CampaignFormErrors,
  CampaignFormValues,
  CampaignModalType,
} from "@/types/campaign";

const pad = (value: number) => String(value).padStart(2, "0");

export const getInitialCampaignForm = (): CampaignFormValues => ({
  name: "",
  platform: "",
  budget: "",
  spend: "",
  startDate: "",
  endDate: "",
});

export const generateCampaignId = () => {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mi = pad(now.getMinutes());
  const ss = pad(now.getSeconds());

  return `CMP-${yyyy}${mm}${dd}${hh}${mi}${ss}`;
};

export const validateCampaignForm = (
  values: CampaignFormValues
): CampaignFormErrors => {
  const errors: CampaignFormErrors = {};

  const trimmedName = values.name.trim();
  const budget = Number(values.budget);
  const spend = Number(values.spend);

  if (!trimmedName) {
    errors.name = "캠페인명을 입력해주세요.";
  } else if (trimmedName.length < 2 || trimmedName.length > 100) {
    errors.name = "캠페인명은 2자 이상 100자 이하로 입력해주세요.";
  }

  if (!values.platform) {
    errors.platform = "광고 매체를 선택해주세요.";
  }

  if (!values.budget) {
    errors.budget = "예산을 입력해주세요.";
  } else if (!Number.isInteger(budget)) {
    errors.budget = "예산은 정수로 입력해주세요.";
  } else if (budget < 100 || budget > 1_000_000_000) {
    errors.budget = "예산은 100원 이상 10억 원 이하로 입력해주세요.";
  }

  if (values.spend === "") {
    errors.spend = "집행 금액을 입력해주세요.";
  } else if (!Number.isInteger(spend)) {
    errors.spend = "집행 금액은 정수로 입력해주세요.";
  } else if (spend < 0 || spend > 1_000_000_000) {
    errors.spend = "집행 금액은 0원 이상 10억 원 이하로 입력해주세요.";
  } else if (values.budget && spend > budget) {
    errors.spend = "집행 금액은 예산을 초과할 수 없습니다.";
  }

  if (!values.startDate) {
    errors.startDate = "시작일을 선택해주세요.";
  }

  if (!values.endDate) {
    errors.endDate = "종료일을 선택해주세요.";
  } else if (values.startDate && values.endDate < values.startDate) {
    errors.endDate = "종료일은 시작일 이후여야 합니다.";
  }

  return errors;
};

export const createCampaignFromForm = (
  values: CampaignFormValues
): CampaignModalType => ({
  id: generateCampaignId(),
  name: values.name.trim(),
  platform: values.platform as Campaign["platform"],
  status: "active",
  budget: Number(values.budget),
  spend: Number(values.spend),
  startDate: values.startDate,
  endDate: values.endDate,
});

export const removeNonNumeric = (value: string) => value.replace(/[^0-9]/g, "");

export const formatNumberWithComma = (value: string) => {
  const numeric = removeNonNumeric(value);

  if (!numeric) return "";

  return Number(numeric).toLocaleString("ko-KR");
};
