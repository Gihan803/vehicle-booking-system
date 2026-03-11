const StatCard = ({ label, value, icon: Icon, iconColor }) => {
    return (
        <div className={`glass-card border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-center items-center text-center min-h-[130px] sm:min-h-[150px] group`}>
            {/* Full-height accent light on the left edge */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-[4px] sm:w-[6px] bg-current ${iconColor} opacity-70 group-hover:opacity-100 transition-opacity z-10`}
                style={{ filter: `drop-shadow(2px 0 10px currentColor)` }}
            />

            {/* Background watermark icon */}
            <Icon className={`absolute -bottom-4 -right-4 text-[5rem] sm:text-[6rem] opacity-[0.05] z-0 ${iconColor}`} />

            {/* Label */}
            <div className="text-slate-400 text-sm sm:text-base font-medium leading-snug relative z-10 w-full">
                {label}
            </div>

            {/* Value */}
            <div className="flex items-center justify-center mt-5 sm:mt-6 relative z-10 w-full">
                <div className={`text-4xl sm:text-5xl font-bold tracking-tight leading-none ${iconColor}`}>
                    {value}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
