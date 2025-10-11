import { Sns } from "@/components/icons";
import { cn } from "@/lib/cn";

const SNS_LINKS = [
  { href: "https://www.facebook.com/?locale=ko_KR", Icon: Sns.Facebook },
  { href: "https://x.com/", Icon: Sns.X },
  { href: "https://www.youtube.com/", Icon: Sns.Youtube },
  { href: "https://www.instagram.com/", Icon: Sns.Instagram },
];

export default function Footer() {
  const linkClass = "cursor-pointer transition-colors hover:text-white";
  const fontClass = "font-arial text-lg";

  return (
    <div className="bg-brand-nomad-black h-40">
      <div
        className={cn(
          "tablet:px-10 container-base pt-8 text-[#676767]",
          "mobile:justify-center flex flex-wrap justify-between gap-y-4 whitespace-nowrap",
          fontClass,
        )}
      >
        <p>©codeit - 2023</p>
        <div className="flex flex-1 justify-center gap-[30px] text-sm">
          <span className={cn(linkClass, fontClass)}>Privacy Policy</span>
          <span className={cn(linkClass, fontClass)}>FAQ</span>
        </div>
        <ol className="flex gap-3">
          {SNS_LINKS.map(({ href, Icon }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="block size-5">
                <Icon className="size-5" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
