import type { Meta, StoryObj } from "@storybook/react";

import { useToast } from "@/components/provider/ToastProvider";
import Button from "@/components/ui/button/Button";

import AlertToast from ".";
import { ALERT_CONFIG } from "./alertConfig";

const meta: Meta<typeof AlertToast> = {
  title: "Components/Toast/AlertToast",
  component: AlertToast,
};
export default meta;

type Story = StoryObj<typeof AlertToast>;

const ToastWrapper = ({ variant }: { variant: keyof typeof ALERT_CONFIG }) => {
  const { openToast } = useToast();

  return (
    <Button onClick={() => openToast(<AlertToast variant={variant} />)}>Open {variant}</Button>
  );
};

export const Password: Story = {
  render: () => <ToastWrapper variant="password" />,
};
