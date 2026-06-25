import { motion } from 'motion/react';

const motionPreset = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

export const Card = ({ children, className = '', delay = 0, glass = true }) => {
  return (
    <motion.div
      initial={motionPreset.initial}
      animate={motionPreset.animate}
      transition={{ ...motionPreset.transition, delay }}
      className={`${glass ? 'v2-glass' : 'v2-card'} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const SectionLabel = ({ children, className = '' }) => (
  <p className={`v2-section-label ${className}`}>{children}</p>
);

export const DisplayTitle = ({ children, className = '', as: Tag = 'h2' }) => (
  <Tag className={`v2-display ${className}`}>{children}</Tag>
);

export const PriceText = ({ children, className = '', size = 'md' }) => (
  <span className={size === 'lg' ? `v2-price-lg ${className}` : `v2-price ${className}`}>
    {children}
  </span>
);

const buttonVariants = {
  primary: 'liquid-btn liquid-btn-gold',
  secondary: 'liquid-btn liquid-btn-secondary',
  outline: 'liquid-btn liquid-btn-outline',
  violet: 'liquid-btn liquid-btn-violet',
  ghost: 'liquid-btn liquid-btn-ghost',
};

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`w-full px-4 py-3.5 disabled:cursor-not-allowed disabled:opacity-45 ${buttonVariants[variant] || buttonVariants.primary} ${className}`}
    >
      <span className="liquid-btn-label">{children}</span>
    </motion.button>
  );
};

export const Input = ({ value, onChange, placeholder, label, className = '' }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="v2-section-label !ml-0">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="liquid-input"
      />
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onTabChange, variant = 'default' }) => {
  const isProduct = variant === 'product';

  return (
    <div className={`liquid-tab-track ${isProduct ? 'border-amber-200/20 dark:border-white/10' : ''}`}>
      {tabs.map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`relative z-10 flex-1 rounded-full py-2.5 transition-colors ${
              active
                ? isProduct
                  ? 'text-amber-900 dark:text-amber-100'
                  : 'text-zinc-900 dark:text-white'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {active && (
              <motion.span
                layoutId="v2-tab-pill"
                className={`absolute inset-0 ${
                  isProduct ? 'liquid-tab-pill liquid-tab-pill-gold' : 'liquid-tab-pill'
                }`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
              />
            )}
            <span className="liquid-tab-label">{tab}</span>
          </button>
        );
      })}
    </div>
  );
};

export const PageHero = ({ children, className = '', variant = 'stars' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`relative flex h-44 items-center justify-center overflow-hidden rounded-[2.25rem] border border-white/20 ${
      variant === 'premium' ? 'v2-hero-premium' : 'v2-hero-stars'
    } ${className}`}
    style={{
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    }}
  >
    {children}
  </motion.div>
);
