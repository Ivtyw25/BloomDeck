import React from "react";

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-surface font-sans text-text-main">
            <main className="max-w-5xl mx-auto px-6 py-20 space-y-24">

                {/* Header / Introduction */}
                <section className="space-y-6 text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 font-heading">
                        Bloom Deck Design System
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        A nature-inspired palette derived from your provided image, matched with clean typography and consistent spacing.
                    </p>
                </section>

                {/* Color Palette Display */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-semibold font-heading">Core Palette</h2>
                        <span className="text-sm text-text-muted">Extracted from image</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div className="space-y-3 group cursor-pointer">
                            <div className="h-32 rounded-2xl bg-green-100 shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="px-1">
                                <p className="font-semibold text-gray-900">Lightest</p>
                                <p className="text-sm text-text-muted font-mono uppercase">#EAEF9D</p>
                                <p className="text-xs text-text-muted mt-1">Backgrounds / Subtle</p>
                            </div>
                        </div>

                        <div className="space-y-3 group cursor-pointer">
                            <div className="h-32 rounded-2xl bg-green-200 shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="px-1">
                                <p className="font-semibold text-gray-900">Light</p>
                                <p className="text-sm text-text-muted font-mono uppercase">#C1D95C</p>
                                <p className="text-xs text-text-muted mt-1">Accents</p>
                            </div>
                        </div>

                        <div className="space-y-3 group cursor-pointer">
                            <div className="h-32 rounded-2xl bg-green-300 shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="px-1">
                                <p className="font-semibold text-gray-900">Mid</p>
                                <p className="text-sm text-text-muted font-mono uppercase">#80B155</p>
                                <p className="text-xs text-text-muted mt-1">Secondary Interactions</p>
                            </div>
                        </div>

                        <div className="space-y-3 group cursor-pointer">
                            <div className="h-32 rounded-2xl bg-primary shadow-lg shadow-green-400/20 ring-1 ring-black/5 group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="px-1">
                                <p className="font-semibold text-primary">Primary</p>
                                <p className="text-sm text-text-muted font-mono uppercase">#498428</p>
                                <p className="text-xs text-text-muted mt-1">Brand Color / CTAs</p>
                            </div>
                        </div>

                        <div className="space-y-3 group cursor-pointer">
                            <div className="h-32 rounded-2xl bg-green-500 shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="px-1">
                                <p className="font-semibold text-gray-900">Dark</p>
                                <p className="text-sm text-text-muted font-mono uppercase">#336A29</p>
                                <p className="text-xs text-text-muted mt-1">Hover States</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography Scale */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-semibold font-heading">Typography Scale</h2>
                        <span className="text-sm text-text-muted">Varela Round (Headings) & Poppins (Body)</span>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline border-b border-gray-100 pb-4">
                            <span className="text-sm text-text-muted font-mono">text-5xl font-heading font-bold</span>
                            <div className="md:col-span-2">
                                <h1 className="text-5xl font-bold font-heading">Display Heading</h1>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline border-b border-gray-100 pb-4">
                            <span className="text-sm text-text-muted font-mono">text-4xl font-heading font-bold</span>
                            <div className="md:col-span-2">
                                <h2 className="text-4xl font-bold font-heading">Section Title</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline border-b border-gray-100 pb-4">
                            <span className="text-sm text-text-muted font-mono">text-2xl font-heading font-semibold</span>
                            <div className="md:col-span-2">
                                <h3 className="text-2xl font-semibold font-heading">Card Headline</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline border-b border-gray-100 pb-4">
                            <span className="text-sm text-text-muted font-mono">text-xl font-heading font-medium</span>
                            <div className="md:col-span-2">
                                <h4 className="text-xl font-medium font-heading">Subtitle Text</h4>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline border-b border-gray-100 pb-4">
                            <span className="text-sm text-text-muted font-mono">text-base</span>
                            <div className="md:col-span-2">
                                <p className="text-base text-gray-700">
                                    Base body text. The quick brown fox jumps over the lazy dog. Used for primary content blocks and descriptions.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline">
                            <span className="text-sm text-text-muted font-mono">text-sm text-text-muted</span>
                            <div className="md:col-span-2">
                                <p className="text-sm text-text-muted">
                                    Small text. Used for captions, helper text, and secondary information.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Text Colors */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-semibold font-heading">Text Colors</h2>
                        <span className="text-sm text-text-muted">Readability & Hierarchy</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-text-main">Main Text</p>
                            <div className="flex justify-between items-center text-xs text-text-muted font-mono border-t border-gray-200 pt-2">
                                <span>text-text-main</span>
                                <span>Gray 900</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-text-muted">Muted Text</p>
                            <div className="flex justify-between items-center text-xs text-text-muted font-mono border-t border-gray-200 pt-2">
                                <span>text-text-muted</span>
                                <span>Gray 500</span>
                            </div>
                        </div>
                        <div className="space-y-2 p-6 bg-gray-900 rounded-lg -m-6 md:m-0">
                            <p className="text-3xl font-bold text-text-inverted">Inverted</p>
                            <div className="flex justify-between items-center text-xs text-gray-400 font-mono border-t border-gray-700 pt-2">
                                <span>text-text-inverted</span>
                                <span>White</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-primary">Primary Text</p>
                            <div className="flex justify-between items-center text-xs text-text-muted font-mono border-t border-gray-200 pt-2">
                                <span>text-primary</span>
                                <span>Green 400</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-error">Error Text</p>
                            <div className="flex justify-between items-center text-xs text-text-muted font-mono border-t border-gray-200 pt-2">
                                <span>text-error</span>
                                <span>Red 500</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Shadows & Elevation */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-semibold font-heading">Shadows & Elevation</h2>
                        <span className="text-sm text-text-muted">Depth perception</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-4">
                        <div className="bg-white h-32 rounded-xl flex items-center justify-center shadow-xs border border-gray-50">
                            <span className="text-sm font-medium text-gray-500">shadow-xs</span>
                        </div>
                        <div className="bg-white h-32 rounded-xl flex items-center justify-center shadow-sm border border-gray-50">
                            <span className="text-sm font-medium text-gray-500">shadow-sm</span>
                        </div>
                        <div className="bg-white h-32 rounded-xl flex items-center justify-center shadow-md border border-gray-50">
                            <span className="text-sm font-medium text-gray-500">shadow-md</span>
                        </div>
                        <div className="bg-white h-32 rounded-xl flex items-center justify-center shadow-lg border border-gray-50">
                            <span className="text-sm font-medium text-gray-500">shadow-lg</span>
                        </div>
                    </div>
                </section>

                {/* Semantic Usage Examples */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-semibold font-heading">Semantic Application</h2>
                        <span className="text-sm text-text-muted">How we use these colors</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Component 1: Card */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50">
                            <div className="inline-flex items-center justify-center p-2 bg-green-100 text-green-500 rounded-lg mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Primary Action</h3>
                            <p className="text-text-muted mb-6 leading-relaxed">
                                This card demonstrates the primary action color. We use <span className="font-mono text-primary font-medium">#498428</span> for the main button to draw attention, and softer grays for the text to maintain readability.
                            </p>
                            <div className="flex gap-3">
                                <button className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors shadow-sm shadow-green-900/10">
                                    Get Started
                                </button>
                                <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* Component 2: Secondary / Alert */}
                        <div className="space-y-6">
                            <div className="p-6 bg-green-50 rounded-xl border border-green-100 flex gap-4">
                                <div className="shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 font-bold">!</div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 font-heading">Success State</h4>
                                    <p className="text-gray-600 mt-1">
                                        We use the lightest green <span className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-gray-200">#EAEF9D</span> as a subtle background for positive messages or secondary surfaces.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl border border-gray-200 space-y-4">
                                <h4 className="font-semibold text-gray-900 font-heading">Typography Contrast</h4>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                </div>
                                <p className="text-sm text-text-muted">
                                    Text uses <span className="font-bold">Poppins</span> for body text and <span className="font-heading font-bold">Varela Round</span> for headings.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
