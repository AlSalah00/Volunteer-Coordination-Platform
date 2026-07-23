import InstagramIcon from "../assets/instagram.svg?react";
import LinkedInIcon  from "../assets/linkedin.svg?react";
import XIcon         from "../assets/x.svg?react";

const socials = [
  { icon: XIcon,         label: "X",         href: "#" },
  { icon: InstagramIcon, label: "Instagram",  href: "#" },
  { icon: LinkedInIcon,  label: "LinkedIn",   href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy",    href: "#" },
  { label: "Terms of Service",  href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-purple-600">
      <div
        className="mx-auto max-w-7xl px-8 md:px-16 lg:px-32 py-12
                   flex flex-col md:flex-row md:items-end md:justify-between gap-10"
      >
        {/* Left: wordmark + email + socials */}
        <div className="flex flex-col gap-5">
          <span
            className="text-4xl font-semibold text-purple-300 leading-none"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Benevolentia
          </span>

          <a
            href="mailto:info@benevolentia.org"
            className="text-sm text-purple-50 hover:text-white
                       transition-colors duration-200 w-fit"
          >
            info@benevolentia.org
          </a>

          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Right: legal links + copyright */}
        <div className="flex flex-col md:items-end gap-3">
          <nav className="flex flex-col md:items-end gap-2">
            {legalLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-purple-50 hover:text-white
                           transition-colors duration-200 w-fit"
              >
                {label}
              </a>
            ))}
          </nav>

          <p className="text-xs text-purple-50/60 mt-1">
            © {year} Benevolentia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}