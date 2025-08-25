import React from "react";
import Image from "next/image";
import {
  Button,
  Card,
  CardImage,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Status,
  Typography,
  Input,
  Badge,
  Avatar,
  Carousel,
  CarouselItem,
  Navbar,
  Footer,
  Hero,
  ThemeSelector,
  ColorSelector,
} from "@/components/ui";
import ThemeWrapper from "@/components/ui/ThemeWrapper";

export default function ComponentsPage() {
  const navbarMenuItems = [
    { label: "Home", href: "#", active: true },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Integrations", href: "#" },
        { label: "API", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-primary-background text-text-primary font-primary">
        {/* Theme Selector */}
        <section className="mb-16 p-8">
          <div className="max-w-4xl mx-auto">
            <ThemeSelector />
          </div>
        </section>

        {/* Color Selector */}
        <section className="mb-16 p-8">
          <div className="max-w-4xl mx-auto">
            <ColorSelector />
          </div>
        </section>

        {/* Navbar Demo */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8 text-center"
          >
            Navigation Components
          </Typography>

          {/* Navbar Variants */}
          <div className="space-y-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Navbar Variants</CardTitle>
                <CardDescription>다양한 네비게이션 바 스타일</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Default Navbar */}
                <div>
                  <Typography variant="h6" weight="medium" className="mb-3">
                    Default Navbar
                  </Typography>
                  <div className="border border-primary-borderSecondary rounded-lg overflow-hidden">
                    <Navbar menuItems={navbarMenuItems} />
                  </div>
                </div>

                {/* Transparent Navbar */}
                <div>
                  <Typography variant="h6" weight="medium" className="mb-3">
                    Transparent Navbar
                  </Typography>
                  <div className="border border-primary-borderSecondary rounded-lg overflow-hidden bg-gradient-to-r from-primary-surface to-primary-surfaceSecondary">
                    <Navbar variant="transparent" menuItems={navbarMenuItems} />
                  </div>
                </div>

                {/* Elevated Navbar */}
                <div>
                  <Typography variant="h6" weight="medium" className="mb-3">
                    Elevated Navbar
                  </Typography>
                  <div className="border border-primary-borderSecondary rounded-lg overflow-hidden">
                    <Navbar variant="elevated" menuItems={navbarMenuItems} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Hero Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8 text-center"
          >
            Hero Sections
          </Typography>

          <div className="space-y-16">
            {/* Default Hero */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Default Hero</CardTitle>
                <CardDescription>기본 히어로 섹션</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-primary-borderSecondary rounded-lg overflow-hidden">
                  <Hero
                    title="Build something amazing"
                    subtitle="Welcome to Weave"
                    description="Create beautiful, responsive websites with our powerful design system. Start building your next project today with confidence."
                    primaryAction={{
                      label: "Get Started",
                      href: "#",
                      variant: "primary",
                    }}
                    secondaryAction={{
                      label: "Learn More",
                      href: "#",
                      variant: "secondary",
                    }}
                    image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
                    imageAlt="Design workspace"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Centered Hero */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Centered Hero</CardTitle>
                <CardDescription>중앙 정렬 히어로 섹션</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-primary-borderSecondary rounded-lg overflow-hidden">
                  <Hero
                    variant="centered"
                    title="Transform your workflow"
                    subtitle="Powerful Design Tools"
                    description="Streamline your design process with our comprehensive toolkit. Collaborate seamlessly with your team."
                    primaryAction={{
                      label: "Start Free Trial",
                      href: "#",
                      variant: "primary",
                    }}
                    secondaryAction={{
                      label: "View Demo",
                      href: "#",
                      variant: "ghost",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Split Hero */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Split Hero</CardTitle>
                <CardDescription>분할 레이아웃 히어로 섹션</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-primary-borderSecondary rounded-lg overflow-hidden">
                  <Hero
                    variant="split"
                    title="Design with confidence"
                    subtitle="Professional Tools"
                    description="Access industry-leading design tools and templates. Create stunning visuals that captivate your audience."
                    primaryAction={{
                      label: "Explore Templates",
                      href: "#",
                      variant: "primary",
                    }}
                    secondaryAction={{
                      label: "Watch Tutorial",
                      href: "#",
                      variant: "secondary",
                    }}
                    image="https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop"
                    imageAlt="Design interface"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8 text-center"
          >
            Footer Components
          </Typography>

          <div className="space-y-8">
            {/* Default Footer */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Default Footer</CardTitle>
                <CardDescription>기본 푸터 스타일</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-primary-borderSecondary rounded-lg overflow-hidden">
                  <Footer
                    links={footerLinks}
                    socialLinks={socialLinks}
                    copyright="© 2024 Weave. All rights reserved."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Minimal Footer */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Minimal Footer</CardTitle>
                <CardDescription>미니멀 푸터 스타일</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-primary-borderSecondary rounded-lg overflow-hidden bg-primary-background">
                  <Footer
                    variant="minimal"
                    links={footerLinks.slice(0, 2)}
                    socialLinks={socialLinks}
                    copyright="© 2024 Weave. All rights reserved."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Buttons
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Primary Buttons</CardTitle>
                <CardDescription>
                  기본 액션을 위한 버튼들 (선택 색상1 적용)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="primary" size="lg">
                    Large
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" loading>
                    Loading
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Secondary Buttons</CardTitle>
                <CardDescription>
                  보조 액션을 위한 버튼들 (기본 색상, 투명 배경, 그림자 효과)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" size="sm">
                    Small
                  </Button>
                  <Button variant="secondary" size="md">
                    Medium
                  </Button>
                  <Button variant="secondary" size="lg">
                    Large
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" loading>
                    Loading
                  </Button>
                  <Button variant="secondary" disabled>
                    Disabled
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Other Button Variants</CardTitle>
                <CardDescription>다양한 버튼 스타일</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost" size="md">
                    Ghost
                  </Button>
                  <Button variant="danger" size="md">
                    Danger
                  </Button>
                  <Button variant="gradient" size="md">
                    Gradient
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost" loading>
                    Loading
                  </Button>
                  <Button variant="danger" disabled>
                    Disabled
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Status Indicators Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Status Indicators
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
                <CardDescription>상태를 나타내는 배지들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <span className="badge-primary-weave px-2 py-1 text-xs rounded-md font-medium">
                    Primary
                  </span>
                  <span className="badge-secondary-weave px-2 py-1 text-xs rounded-md font-medium">
                    Secondary
                  </span>
                  <span className="badge-accent-weave px-2 py-1 text-xs rounded-md font-medium">
                    Accent
                  </span>
                  <span className="badge-gray-weave px-2 py-1 text-xs rounded-md font-medium">
                    Default
                  </span>
                  <span className="badge-secondary-weave px-2 py-1 text-xs rounded-md font-medium">
                    Success
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Status Pills</CardTitle>
                <CardDescription>둥근 모서리의 상태 표시</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Status type="success" variant="pill">
                    Active
                  </Status>
                  <Status type="warning" variant="pill">
                    Pending
                  </Status>
                  <Status type="error" variant="pill">
                    Failed
                  </Status>
                  <Status type="info" variant="pill">
                    Draft
                  </Status>
                  <Status type="progress" variant="pill">
                    Processing
                  </Status>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Status Dots</CardTitle>
                <CardDescription>점으로 상태 표시</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Status type="success" variant="dot">
                    Online
                  </Status>
                  <Status type="warning" variant="dot">
                    Away
                  </Status>
                  <Status type="error" variant="dot">
                    Offline
                  </Status>
                  <Status type="info" variant="dot">
                    Busy
                  </Status>
                  <Status type="progress" variant="dot">
                    Typing
                  </Status>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Typography
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Text Sizes</CardTitle>
                <CardDescription>다양한 텍스트 크기</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Typography size="xs">Extra Small Text (13px)</Typography>
                <Typography size="sm">Small Text (15px)</Typography>
                <Typography size="base">Base Text (16px)</Typography>
                <Typography size="lg">Large Text (21px)</Typography>
                <Typography size="xl">Extra Large Text (24px)</Typography>
                <Typography size="2xl">2XL Text (32px)</Typography>
                <Typography size="3xl">3XL Text (48px)</Typography>
                <Typography size="4xl">4XL Text (56px)</Typography>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Text Colors</CardTitle>
                <CardDescription>다양한 텍스트 색상</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Typography color="primary">Primary Text</Typography>
                <Typography color="secondary">Secondary Text</Typography>
                <Typography color="tertiary">Tertiary Text</Typography>
                <Typography color="accent">Accent Text</Typography>
                <Typography color="muted">Muted Text</Typography>
                <Typography color="gradient" size="lg" weight="semibold">
                  Gradient Text
                </Typography>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Input Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Form Inputs
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Basic Inputs</CardTitle>
                <CardDescription>기본 입력 필드들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter your name" />
                <Input placeholder="Enter your email" type="email" />
                <Input placeholder="Enter your password" type="password" />
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Input with Labels</CardTitle>
                <CardDescription>라벨이 있는 입력 필드들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Full Name" placeholder="John Doe" />
                <Input
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                />
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                />
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Input States</CardTitle>
                <CardDescription>다양한 상태의 입력 필드들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Normal input" />
                <Input placeholder="Disabled input" disabled />
                <Input
                  placeholder="Error input"
                  error="This field is required"
                />
                <Input
                  placeholder="With helper text"
                  helperText="This is helpful information"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Badges
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Badge Variants</CardTitle>
                <CardDescription>
                  다양한 배지 스타일 (그라디언트 색상 적용)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Badge Sizes</CardTitle>
                <CardDescription>다양한 배지 크기</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Badge Examples</CardTitle>
                <CardDescription>실제 사용 예시</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">New</Badge>
                  <Badge variant="secondary">Draft</Badge>
                  <Badge variant="accent">Beta</Badge>
                  <Badge variant="outline">Critical</Badge>
                  <Badge variant="destructive">Error</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Avatars Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Avatars
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Avatar Sizes</CardTitle>
                <CardDescription>다양한 아바타 크기</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar size="sm" fallback="JD" />
                  <Avatar size="md" fallback="JD" />
                  <Avatar size="lg" fallback="JD" />
                  <Avatar size="xl" fallback="JD" />
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Avatar with Images</CardTitle>
                <CardDescription>이미지가 있는 아바타</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    size="md"
                    src="https://github.com/shadcn.png"
                    alt="User"
                  />
                  <Avatar size="md" fallback="CN" />
                  <Avatar size="md" fallback="AB" />
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Avatar Examples</CardTitle>
                <CardDescription>실제 사용 예시</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" fallback="JD" />
                  <div>
                    <Typography size="sm" weight="medium">
                      John Doe
                    </Typography>
                    <Typography size="xs" color="secondary">
                      Software Engineer
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar size="sm" fallback="JS" />
                  <div>
                    <Typography size="sm" weight="medium">
                      Jane Smith
                    </Typography>
                    <Typography size="xs" color="secondary">
                      Product Manager
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Cards
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>기본 카드 스타일</CardDescription>
              </CardHeader>
              <CardContent>
                <Typography color="secondary">
                  이 카드는 투명한 배경과 테두리를 가집니다.
                </Typography>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>그림자가 있는 카드</CardDescription>
              </CardHeader>
              <CardContent>
                <Typography color="secondary">
                  이 카드는 배경색과 그림자를 가집니다.
                </Typography>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>강조된 테두리 카드</CardDescription>
              </CardHeader>
              <CardContent>
                <Typography color="secondary">
                  이 카드는 강조된 테두리를 가집니다.
                </Typography>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>
            <Card variant="elevated" interactive>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>
                  포커스 가능한 카드 (브랜드 Secondary 그라데이션)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Typography color="secondary">
                  이 카드는 포커스 시 브랜드 Secondary 그라데이션으로
                  강조됩니다.
                </Typography>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Image Cards */}
          <div className="mt-8">
            <Typography
              variant="h3"
              size="xl"
              weight="semibold"
              className="mb-6"
            >
              Image Cards
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card variant="elevated">
                <CardImage
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop"
                  alt="Nature"
                />
                <CardHeader>
                  <CardTitle>Nature Photography</CardTitle>
                  <CardDescription>아름다운 자연 풍경</CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography color="secondary">
                    자연의 아름다움을 담은 사진입니다.
                  </Typography>
                </CardContent>
                <CardFooter>
                  <Button variant="primary" size="sm">
                    View Details
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="elevated">
                <CardImage
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
                  alt="City"
                />
                <CardHeader>
                  <CardTitle>Urban Landscape</CardTitle>
                  <CardDescription>현대적인 도시 풍경</CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography color="secondary">
                    도시의 활기찬 모습을 담은 사진입니다.
                  </Typography>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" size="sm">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="elevated">
                <CardImage
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop"
                  alt="Forest"
                />
                <CardHeader>
                  <CardTitle>Forest Path</CardTitle>
                  <CardDescription>평화로운 숲길</CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography color="secondary">
                    평화롭고 고요한 숲의 모습입니다.
                  </Typography>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" size="sm">
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Carousel
          </Typography>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Basic Carousel</CardTitle>
                <CardDescription>기본 캐러셀 기능</CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full">
                  <CarouselItem>
                    <div className="h-48 bg-gradient-to-br from-[#0143b1] to-[#42a8e4] rounded-lg flex items-center justify-center">
                      <Typography size="xl" weight="bold" color="accent">
                        Primary Slide
                      </Typography>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="h-48 bg-gradient-to-br from-[#4ecdc4] to-[#45b7d1] rounded-lg flex items-center justify-center">
                      <Typography size="xl" weight="bold" color="accent">
                        Secondary Slide
                      </Typography>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="h-48 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-lg flex items-center justify-center">
                      <Typography size="xl" weight="bold" color="accent">
                        Accent Slide
                      </Typography>
                    </div>
                  </CarouselItem>
                </Carousel>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Auto-Play Carousel</CardTitle>
                <CardDescription>자동 재생 캐러셀</CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel autoPlay interval={2000} className="w-full">
                  <CarouselItem>
                    <div className="h-48 bg-gradient-to-br from-[#0143b1] to-[#42a8e4] rounded-lg flex items-center justify-center">
                      <Typography size="xl" weight="bold" color="accent">
                        Auto Primary
                      </Typography>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="h-48 bg-gradient-to-br from-[#4ecdc4] to-[#45b7d1] rounded-lg flex items-center justify-center">
                      <Typography size="xl" weight="bold" color="accent">
                        Auto Secondary
                      </Typography>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="h-48 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-lg flex items-center justify-center">
                      <Typography size="xl" weight="bold" color="accent">
                        Auto Accent
                      </Typography>
                    </div>
                  </CarouselItem>
                </Carousel>
              </CardContent>
            </Card>
          </div>

          {/* Image Carousel */}
          <div className="mt-8">
            <Typography
              variant="h3"
              size="xl"
              weight="semibold"
              className="mb-6"
            >
              Image Carousel
            </Typography>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
                <CardDescription>이미지 갤러리 캐러셀</CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full">
                  <CarouselItem>
                    <Image
                      src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
                      alt="Nature"
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <Image
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
                      alt="City"
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <Image
                      src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
                      alt="Forest"
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </CarouselItem>
                </Carousel>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Color Palette
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Primary Colors</CardTitle>
                <CardDescription>주요 색상들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-background border border-primary-border rounded"></div>
                  <Typography size="sm">Background</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-surface border border-primary-border rounded"></div>
                  <Typography size="sm">Surface</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-border rounded"></div>
                  <Typography size="sm">Border</Typography>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Status Colors</CardTitle>
                <CardDescription>상태 색상들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-status-success rounded"></div>
                  <Typography size="sm">Success</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-status-warning rounded"></div>
                  <Typography size="sm">Warning</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-status-error rounded"></div>
                  <Typography size="sm">Error</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-status-info rounded"></div>
                  <Typography size="sm">Info</Typography>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>브랜드 키 컬러</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#0143b1] to-[#42a8e4] rounded"></div>
                  <Typography size="sm">Primary Blue</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] rounded"></div>
                  <Typography size="sm">Secondary Teal</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] rounded"></div>
                  <Typography size="sm">Accent Pink</Typography>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Accent Colors</CardTitle>
                <CardDescription>기타 강조 색상들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent-yellow rounded"></div>
                  <Typography size="sm">Yellow</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent-orange rounded"></div>
                  <Typography size="sm">Orange</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent-blue rounded"></div>
                  <Typography size="sm">Blue</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent-purple rounded"></div>
                  <Typography size="sm">Purple</Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent-green rounded"></div>
                  <Typography size="sm">Green</Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="mb-16">
          <Typography
            variant="h2"
            size="2xl"
            weight="semibold"
            className="mb-8"
          >
            Spacing System
          </Typography>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Spacing Scale</CardTitle>
              <CardDescription>일관된 간격 시스템</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-[#0143b1] to-[#42a8e4] rounded"></div>
                  <Typography size="sm">xs (4px)</Typography>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] rounded"></div>
                  <Typography size="sm">sm (8px)</Typography>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] rounded"></div>
                  <Typography size="sm">md (12px)</Typography>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0143b1] to-[#42a8e4] rounded"></div>
                  <Typography size="sm">lg (16px)</Typography>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] rounded"></div>
                  <Typography size="sm">xl (24px)</Typography>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] rounded"></div>
                  <Typography size="sm">2xl (32px)</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ThemeWrapper>
  );
}
