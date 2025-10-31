export interface ToastAction {
  label: string;
  primary?: boolean;
  actionKey?: string;
}

export interface ToastConfigItem {
  size?: "sm" | "lg";
  message: string;
  icon?: React.ReactNode | string;
  autoClose?: boolean;
  btnAlign?: "start" | "center" | "end";
  buttons?: ToastAction[];
  redirectTo?: string;
}

export const TOAST_CONFIG: Record<string, ToastConfigItem> = {
  password: {
    message: "비밀번호가 일치하지 않습니다.",
  },
  email: {
    message: "이미 사용중인 이메일입니다.",
  },
  signup: {
    message: "가입이 완료되었습니다!",
  },
  register: {
    message: "체험 등록이 완료되었습니다!",
  },
  update: {
    message: "체험 수정이 완료되었습니다!",
    buttons: [{ label: "확인", primary: true, actionKey: "redirect" }],
    redirectTo: "/me/activities",
  },
  reserveDone: {
    message: "예약이 완료되었습니다.",
    btnAlign: "center",
    buttons: [
      { label: "예약 내역", actionKey: "redirect" },
      { label: "확인", primary: true },
    ],
    redirectTo: "/me/reservations",
  },
  reserveReject: {
    message: "이미 예약된 체험입니다.",
    btnAlign: "center",
    buttons: [
      { label: "예약 내역", actionKey: "redirect" },
      { label: "확인", primary: true },
    ],
    redirectTo: "/me/reservations",
  },
  isCancel: {
    size: "sm",
    icon: "check",
    message: "예약을 취소하시겠어요?",
    btnAlign: "center",
    autoClose: false,
    buttons: [{ label: "아니오" }, { label: "취소하기", primary: true, actionKey: "confirm" }],
  },
  trueCancel: {
    size: "sm",
    icon: "check",
    btnAlign: "center",
    message: "취소가 완료되었습니다.",
  },
  falseCancel: {
    size: "sm",
    icon: "error",
    btnAlign: "center",
    message: "취소에 실패했습니다.",
  },
  isDelete: {
    size: "sm",
    icon: "check",
    message: "체험을 삭제하시겠어요?",
    btnAlign: "center",
    autoClose: false,
    buttons: [{ label: "아니오" }, { label: "삭제하기", primary: true, actionKey: "confirm" }],
  },
  trueDelete: {
    size: "sm",
    icon: "check",
    btnAlign: "center",
    message: "삭제가 완료되었습니다.",
  },
  falseDelete: {
    size: "sm",
    icon: "error",
    btnAlign: "center",
    message: "삭제에 실패했습니다.",
  },
};
