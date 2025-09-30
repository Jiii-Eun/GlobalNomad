declare module "*.svg" {
  import * as React from "react";

  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

// import Logo from "@/assets/logo.svg";

// export default function Header() {
//   return <Logo className="h-8 w-8 text-blue-500" />;
// }
