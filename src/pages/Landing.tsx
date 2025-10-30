import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, BookOpen, Clock, Award, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FAQAccordion } from '@/components/FAQAccordion';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoginArea } from '@/components/auth/LoginArea';
import { MobileNav } from '@/components/MobileNav';
import { OverlayScrollbar } from '@/components/OverlayScrollbar';
import { useRTL } from '@/hooks/useRTL';

export function Landing() {
  useRTL();
  const { t } = useTranslation();

  return (
    <OverlayScrollbar className="h-screen">
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 md:gap-3">
              <img 
                src="/logo-h.png" 
                alt="Zaptalk Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
              />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              <LanguageSwitcher />
              <div className="hidden md:block">
                <LoginArea className="max-w-60" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-background to-orange-50 opacity-50" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Image - Shows first on mobile */}
            <div className="relative order-1 lg:order-2 w-full">
              <div className="relative z-10">
                <img 
                  src="/logo-f.png" 
                  alt="Zaptalk Mascot" 
                  className="w-full max-w-[300px] md:max-w-md mx-auto drop-shadow-2xl animate-float"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/4 -left-8 w-32 h-32 bg-purple-300 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="absolute bottom-1/4 -right-8 w-40 h-40 bg-orange-300 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
            </div>

            {/* Hero Text - Shows second on mobile, centered */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
              <div className="flex justify-center lg:inline-block">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  {t('app.tagline')}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                  {t('hero.title')}
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6 justify-center lg:justify-start">
                <Link to="/catalog" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600">
                    <BookOpen className="h-5 w-5" />
                    {t('hero.cta_free')}
                  </Button>
                </Link>
                <Link to="/catalog" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto gap-2 text-lg px-8 py-6 border-2 border-purple-300 hover:bg-purple-50"
                  >
                    <Zap className="h-5 w-5 fill-orange-500 text-orange-500" />
                    {t('hero.cta_unlock')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Zaptalk?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl hover:border-purple-300 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="h-16 w-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-400 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">5-Minute Lessons</h3>
                <p className="text-muted-foreground">
                  Perfect for busy schedules. Learn English in bite-sized chunks that fit your day.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="h-16 w-16 mx-auto bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white fill-current" />
                </div>
                <h3 className="text-xl font-bold">Bitcoin Payments</h3>
                <p className="text-muted-foreground">
                  Pay only for what you learn. No subscriptions. No hidden fees. Just sats.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl hover:border-purple-300 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="h-16 w-16 mx-auto bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">CEFR Standard</h3>
                <p className="text-muted-foreground">
                  Follow the globally recognized framework from A1 (beginner) to C2 (proficiency).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              {
                icon: BookOpen,
                title: 'Browse Lessons',
                description: 'Explore our catalog organized by CEFR levels (A1-C2). Start with free lessons to try it out.',
                color: 'from-purple-500 to-purple-400',
              },
              {
                icon: Zap,
                title: 'Unlock with Bitcoin',
                description: 'Found a lesson you like? Pay with Bitcoin Lightning Network. Instant access, no waiting.',
                color: 'from-orange-500 to-orange-400',
              },
              {
                icon: TrendingUp,
                title: 'Learn & Progress',
                description: 'Complete lessons, take quizzes, and track your progress. Build your skills step by step.',
                color: 'from-purple-600 to-pink-500',
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6 items-start group hover:translate-x-2 transition-transform duration-300">
                <div className={`h-14 w-14 flex-shrink-0 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <FAQAccordion />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20">
              <img 
                src="/logo-h.png" 
                alt="" 
                className="h-48 w-48 object-contain"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Try your first lesson free. No credit card required.
              </p>
              <Link to="/catalog">
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
                  <BookOpen className="h-5 w-5" />
                  Browse Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

  {/* Footer */}
  <footer className="hidden md:block border-t py-12 px-4 bg-gradient-to-b from-background to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo-h.png" 
                  alt="Zaptalk Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  {t('app.name')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Learn English with Bitcoin. Pay per lesson, no subscriptions.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/catalog" className="hover:text-primary transition-colors">
                    Browse Catalog
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/ZapTalk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://sbc.om"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    About SBC
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider">Company</h3>
              <p className="text-sm text-muted-foreground">
                Developed by{' '}
                <a
                  href="https://sbc.om"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  SBC
                </a>
              </p>
              <p className="text-xs text-muted-foreground">
                Building the future of Bitcoin-powered education
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SBC. All rights reserved. Powered by Bitcoin Lightning Network.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNav />
      </div>
    </OverlayScrollbar>
  );
}
