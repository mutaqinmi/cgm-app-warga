export default function Card(props: {className?: string; title: string; header: string; subtitle: any}){
    return <div className={`w-full bg-white p-4 flex gap-4 items-center rounded-lg ${props.className}`}>
        <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500">{props.title}</span>
            <span className="text-2xl font-semibold">{props.header}</span>
            <span className="text-xs md:text-sm">{props.subtitle}</span>
        </div>
    </div>
}