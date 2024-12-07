export default function VerticalDivider(props: {className?: string;}) {
    return <div className={`h-8 w-[0.5px] bg-gray-500 bg-opacity-50 ${props.className}`}></div>
}