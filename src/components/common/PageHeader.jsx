import React from 'react';

const PageHeader = ({ title, description, rightContent, children }) => {
    return (
        <div className="mb-6 md:mb-8 text-center md:text-left relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-accent mb-2">
                        {title}
                    </h1>
                    <p className="text-sm md:text-base text-text-muted max-w-2xl font-light">
                        {description}
                    </p>
                    {children && (
                        <div className="mt-4">
                            {children}
                        </div>
                    )}
                </div>
                {rightContent && (
                    <div className="flex items-center gap-4 justify-center md:justify-end shrink-0">
                        {rightContent}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
