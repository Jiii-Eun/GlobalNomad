export interface AlertAction {
  label: string;
  primary?: boolean;
  actionKey?: string;
}

export interface AlertConfigItem {
  size?: "sm" | "lg";
  message: string;
  icon?: React.ReactNode | boolean;
  autoClose?: boolean;
  btnAlign?: "start" | "center" | "end";
  buttons?: AlertAction[];
  redirectTo?: string;
}

export const ALERT_CONFIG: Record<string, AlertConfigItem> = {
  password: {
    message: "비밀번호가 일치하지 않습니다.",
  },
  email: {
    message: "이미 사용중인 이메일입니다.",
  },
  signup: {
    message: "가입이 완료되었습니다!",
  },
  // 페이지 이동 추가
  reserveDone: {
    message: "예약이 완료되었습니다.",
    btnAlign: "center",
    buttons: [
      { label: "예약 내역", actionKey: "redirect" },
      { label: "확인", primary: true },
    ],
    redirectTo: "/mypage/reservations",
  },
  cancel: {
    message: "취소가 완료되었습니다.",
  },
  delete: {
    message: "삭제가 완료되었습니다.",
  },
  isCancel: {
    size: "sm",
    icon: true,
    message: "예약을 취소하시겠어요?",
    autoClose: false,
    buttons: [{ label: "아니오" }, { label: "취소하기", primary: true }],
  },
  isDelete: {
    size: "sm",
    icon: true,
    message: "체험을 삭제하시겠어요?",
    autoClose: false,
    buttons: [{ label: "아니오" }, { label: "삭제하기", primary: true }],
  },
};
