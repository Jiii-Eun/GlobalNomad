// RTL/Vitest 방식
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import Button from "../Button";
import { Primary, Secondary } from "../Button.stories";
import "@testing-library/jest-dom";

test("Primary 버튼이 렌더링된다", async () => {
  render(<Button {...Primary.args} />);
  expect(await screen.findByText("Primary Button")).toBeInTheDocument();
});

test("Secondary 버튼 클릭 이벤트가 발생한다", async () => {
  const handleClick = vi.fn();
  render(<Button {...Secondary.args} onClick={handleClick} />);
  fireEvent.click(screen.getByText("Secondary Button"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
