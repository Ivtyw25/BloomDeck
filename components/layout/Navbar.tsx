'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { NAV_SECTIONS } from '@/lib/constants';
import StarBorder from '@/components/StarBorder';
import { LiquidButton } from '@/components/animate-ui/primitives/buttons/liquid';
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/primitives/buttons/ripple';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar: React.FC = () => {
    type SectionId = typeof NAV_SECTIONS[number]['id'];
    const [activeSection, setActiveSection] = useState<SectionId>(NAV_SECTIONS[0].id);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Refs for sliding animation
    const containerRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
        left: 0, width: 0, opacity: 0
    });

    useGSAP(() => {
        gsap.from(containerRef.current, {
            y: -20,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 1.5,
            ease: 'power4.out',
            delay: 0.3
        });
    }, { scope: containerRef });

    // Scroll Spy Logic
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            for (const section of NAV_SECTIONS) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sliding Indicator Logic
    useEffect(() => {
        if (navRef.current) {
            const activeLink = navRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement;
            if (activeLink) {
                setIndicatorStyle({
                    left: activeLink.offsetLeft,
                    width: activeLink.offsetWidth,
                    opacity: 1
                });
            }
        }
    }, [activeSection]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="fixed top-4 left-0 right-0 z-50 flex justify-center items-center px-4 md:px-8">
            <StarBorder className="w-full shadow-xl shadow-green-300/30 rounded-2xl px-4 py-3 md:px-6 md:py-3 transition-all duration-300" as='nav'>
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 shrink-0 group cursor-pointer">
                        <div className='rounded-md shadow-sm shadow-green-300/20 bg-green-100'>
                            <Image src="/logo.svg" alt="Gloom Deck Logo" width={35} height={35} className="w-8 h-8 object-contain" />
                        </div>
                        <span className="lg:text-xl text-lg font-bold font-heading text-text-main tracking-tight hidden sm:block md:mr-4 lg:mr-0">
                            BloomDeck
                        </span>
                    </div>

                    {/* Desktop Navigation - Centered & Animated */}
                    <div className="hidden md:flex relative items-center bg-white/40 p-1 rounded-xl border border-white/50" ref={navRef}>
                        {/* Sliding Background Pill */}
                        <div
                            className="absolute h-[calc(100%-8px)] top-1 bottom-1 bg-white border border-green-100/20 shadow-sm rounded-lg transition-all duration-300 ease-out"
                            style={{
                                left: indicatorStyle.left,
                                width: indicatorStyle.width,
                                opacity: indicatorStyle.opacity
                            }}
                        />

                        {NAV_SECTIONS.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    data-section={item.id}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                    className={`relative z-10 px-6 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                        ? 'text-gray-900 font-semibold'
                                        : 'text-text-muted hover:text-primary'
                                        }`}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        <LiquidButton
                            className="font-heading cursor-pointer px-5 py-2.5 text-xs lg:text-sm font-medium text-text-main rounded-xl shadow-sm shadow-green-400/20"
                        >
                            Log in
                        </LiquidButton>
                        <RippleButton className="font-heading cursor-pointer px-5 py-2.5 bg-primary text-white text-xs lg:text-sm rounded-xl hover:bg-green-500 shadow-md shadow-green-400/20">
                            Get Started
                            <RippleButtonRipples />
                        </RippleButton>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-text-main p-2 hover:bg-gray-100 rounded-xl"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2 animate-slide-in-right duration-300">
                        {NAV_SECTIONS.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => handleNavClick(e, item.id)}
                                className={`px-4 border border-green-100 py-3 rounded-xl text-sm font-medium ${activeSection === item.id
                                    ? 'text-primary bg-green-50'
                                    : 'text-text-muted hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="h-px bg-gray-100 my-2"></div>
                        <div className="flex gap-3">
                            <LiquidButton className="font-heading cursor-pointer flex-1 px-4 py-3 text-text-main rounded-xl font-medium text-sm shadow-sm shadow-green-400/10">
                                Log in
                            </LiquidButton>
                            <RippleButton className="font-heading cursor-pointer flex-1 px-4 py-3 bg-primary text-white hover:bg-green-500 rounded-xl font-medium text-sm shadow-md">
                                Get Started
                                <RippleButtonRipples />
                            </RippleButton>
                        </div>
                    </div>
                )}
            </StarBorder>
        </div>
    );
};
export default Navbar;