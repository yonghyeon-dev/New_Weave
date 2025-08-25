import React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "./";
import Image from "next/image";

export interface FooterProps {
  className?: string;
  logo?: React.ReactNode;
  links?: FooterLinkGroup[];
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  variant?: "default" | "minimal";
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      className,
      logo,
      links = [],
      socialLinks = [],
      copyright = "© 2024 Weave. All rights reserved.",
      variant = "default",
    },
    ref
  ) => {
    const variants = {
      default: "bg-primary-surface border-t border-primary-borderSecondary",
      minimal: "bg-transparent border-t border-primary-borderSecondary",
    };

    return (
      <footer ref={ref} className={cn("w-full", variants[variant], className)}>
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-1">
              {logo || (
                <div className="flex items-center space-x-2 mb-4">
                  <Image
                    src="/logo.png"
                    alt="Weave Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="text-text-primary font-semibold text-lg">
                    Weave
                  </span>
                </div>
              )}
              <Typography color="secondary" className="mb-4">
                Building the future of collaborative design with powerful tools
                and seamless workflows.
              </Typography>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="text-text-secondary hover:text-text-primary transition-colors duration-fast"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Link Groups */}
            {links.map((group, groupIndex) => (
              <div key={groupIndex}>
                <Typography variant="h6" weight="semibold" className="mb-4">
                  {group.title}
                </Typography>
                <ul className="space-y-3">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-text-secondary hover:text-text-primary transition-colors duration-fast text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="border-t border-primary-borderSecondary mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Typography color="secondary" size="sm">
                {copyright}
              </Typography>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary transition-colors duration-fast text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary transition-colors duration-fast text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary transition-colors duration-fast text-sm"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = "Footer";

export default Footer;
