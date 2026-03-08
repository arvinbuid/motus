import { forwardRef, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", variant = 'default', children, ...props }, ref) => {
        const variants = {
            default: 'bg-card',
            bordered: 'bg-card border border-border',
        };

        return (
            <div
                ref={ref}
                className={`rounded-md p-6 ${variants[variant]} ${className}`}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card';