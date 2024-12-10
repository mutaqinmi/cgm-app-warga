import StatusChip from "./status-chip";

export default function UserListFeeItem(props: {name: string; address: string; status: string}) {
    return <tr className="text-center border-b border-b-gray-200">
        <td className="text-nowrap">{props.name}</td>
        <td className="text-nowrap">{props.address}</td>
        <td className="text-nowrap">
            <StatusChip status={props.status}/>
        </td>
    </tr>
}