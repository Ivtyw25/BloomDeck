'use client'
import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Flashcard from '@/components/ui/HeroFlashCards';
import { HERO_FLASHCARDS } from '@/lib/constants';
import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/primitives/buttons/ripple';
import SplitText from '@/components/SplitText';
import TextType from '@/components/TextType';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero: React.FC = () => {
    const flashcardsRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Headline Animation: Subtle slide up
        tl.from(headlineRef.current, {
            y: 20,
            opacity: 0,
            duration: 1,
            delay: 0.3
        });

        // Flashcards Animation: "Dealing Cards" Effect
        if (flashcardsRef.current) {
            tl.from(flashcardsRef.current.children, {
                y: 100, // Start from below
                scale: 0.5, // Start small
                opacity: 0,
                rotation: 0, // Start with 0 rotation and spin to final state
                duration: 1,
                stagger: {
                    each: 0.1,
                    from: "center" // Animate from center outwards
                },
                ease: "back.out(1.5)" // Elastic bounce effect
            }, "-=0.4");
        }

    }, { scope: headlineRef });

    return (
        <section id="home" className="relative w-full overflow-x-hidden min-h-screen pt-32 pb-12">
            <BubbleBackground className="flex lg:items-center lg:justify-center sm:items-start sm:justify-start absolute inset-0 " />

            {/* Main Container */}
            <div className="container mx-auto px-6 relative z-10">
                <div className="lg:pl-10 flex flex-col lg:flex-row lg:items-center lg:gap-12">

                    {/* Left Content - Headline */}
                    <div ref={headlineRef} className="w-full lg:w-5/12 space-y-8 text-center lg:text-left mb-16 lg:mb-0 relative z-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/50 text-gray-900 rounded-full text-sm font-semibold tracking-wide border border-primary/20 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-green-600" />
                            <span className='font-sans font-medium'>Smart Learning Evolved</span>
                        </div>

                        <SplitText className="font-heading text-5xl lg:text-6xl font-bold text-text-main leading-[1.15]" duration={0.25} delay={70}>
                            Master any subject with <span className="text-primary relative inline-block">
                                BloomDeck
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </SplitText>
                        <TextType
                            text={["Create, share, and study flashcards with our intuitive platform.", "Boost your retention with spaced repetition and gamified learning modes."]}
                            className="text-lg font-sans lg:text-md text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0"
                            as='p'
                            pauseDuration={3000}
                            showCursor={false}
                            startOnVisible={true}
                            initialDelay={500} />
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 -mt-6">
                            <Link href="/dashboard">
                                <RippleButton className=" group px-8 py-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-green-500 flex items-center gap-2 cursor-pointer">
                                    Start Learning Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    <RippleButtonRipples />
                                </RippleButton>
                            </Link>
                        </div>
                    </div>

                    {/* Right Content - Desktop Scattered Flashcards */}
                    <div className="hidden lg:block lg:w-7/12 relative h-[600px]">
                        <div ref={flashcardsRef} className="relative w-full h-full">
                            {HERO_FLASHCARDS.map((card, index) => {
                                // Define positions for scattered look using Tailwind classes
                                let positionClasses = '';

                                switch (index) {
                                    case 0: // Top Left
                                        // lg: top-left corner
                                        positionClasses = 'lg:top-0 lg:left-0 xl:top-[5%] xl:left-[5%] z-10 -rotate-[15deg]';
                                        break;
                                    case 1: // Top Right
                                        // lg: top-right corner, slight offset
                                        positionClasses = 'lg:top-4 lg:right-0 xl:top-[10%] xl:right-[5%] z-20 rotate-[10deg]';
                                        break;
                                    case 2: // Bottom Left
                                        // lg: bottom-left corner, slight offset
                                        positionClasses = 'lg:bottom-4 lg:left-0 xl:bottom-[10%] xl:left-[10%] z-30 -rotate-[8deg]';
                                        break;
                                    case 3: // Bottom Right
                                        // lg: bottom-right corner
                                        positionClasses = 'lg:bottom-0 lg:right-0 xl:bottom-[5%] xl:right-[10%] z-20 rotate-[12deg]';
                                        break;
                                }

                                return (
                                    <div
                                        key={card.id}
                                        className={`absolute w-72 hover:z-50 hover:scale-110 cursor-pointer ${positionClasses}`}
                                    >
                                        <div className={`transform transition-transform duration-300 ease-out group-hover:scale-110`}>
                                            <Flashcard data={card} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;