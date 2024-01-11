export default function Loader({ width = "w-5", height = "h-5" }: { width?: string, height?: string }) {
    return (
        <span className={`relative loader before:box-border before:absolute before:inset-0 before:rounded-full before:border-2 before:border-solid before:border-primary-500 before:content-[''] after:box-border after:absolute after:rounded-full after:border-2 after:border-solid after:content-[''] after:inset-[1px] after:border-primary-300 ${width} ${height}`}></span>
    );
}