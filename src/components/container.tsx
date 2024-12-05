export default function Container(props: {className?: string; onClick?: () => void; children: React.ReactNode}){
    return <div className={`bg-white p-4 md:p-8 rounded-lg ${props.className}`} onClick={props.onClick}>
        {props.children}
    </div>
}