import React from 'react';
import { motion } from 'framer-motion';

interface SegmentedControlProps {
    options: { label: string; value: string; activeClass?: string }[];
    value: string;
    onChange: (value: string) => void;
    layoutId?: string;
}

export function SegmentedControl({ options, value, onChange, layoutId = 'segmented-control' }: SegmentedControlProps) {
    return (
        <div className={`bg-surface-subtle p-1 rounded-xl inline-flex items-center relative`}>
            {options.map((option, index) => (
                <React.Fragment key={option.value}>
                    <button
                        onClick={() => onChange(option.value)}
                        className={`cursor-pointer relative z-10 px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-350 ${value === option.value
                            ? (option.activeClass || 'text-primary')
                            : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        {value === option.value && (
                            <motion.div
                                layoutId={layoutId}
                                className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg -z-10"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        {option.label}
                    </button>
                    {index < options.length - 1 && <div className="w-px h-4 bg-gray-300 mx-1"></div>}
                </React.Fragment>
            ))}
        </div>
    );
}
