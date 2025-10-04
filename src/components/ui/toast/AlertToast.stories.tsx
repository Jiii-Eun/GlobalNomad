import type { Meta, StoryObj } from "@storybook/react";

import { useToast } from "@/components/provider/ToastProvider";

import AlertToast from "./AlertToast";
import { ALERT_CONFIG } from "./constants";

const meta: Meta<typeof AlertToast> = {
  title: "Components/Toast/AlertToast",
  component: AlertToast,
};
export default meta;

type Story = StoryObj<typeof AlertToast>;

const ToastWrapper = ({ variant }: { variant: keyof typeof ALERT_CONFIG }) => {
  const { openToast } = useToast();

  return (
    <button
      className="rounded bg-green-900 px-4 py-2 text-white"
      onClick={() => openToast(<AlertToast variant={variant} />)}
    >
      Open {variant}
    </button>
  );
};

export const Password: Story = {
  render: () => <ToastWrapper variant="password" />,
};
