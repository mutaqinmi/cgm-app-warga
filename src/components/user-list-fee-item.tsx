import StatusChip from "./status-chip";

export default function UserListFeeItem(props: {name: string; address: string; status: string}) {
    return <tr className="text-center border-b border-b-gray-200">
        <td className="py-3">{props.name}</td>
        <td className="py-3">{props.address}</td>
        <td className="py-3">
            <StatusChip status={props.status}/>
        </td>
    </tr>
}