import { WhatsappLogo } from "@phosphor-icons/react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function WhatsAppShortcut(){
    const route = useRouter();
    const [phone, setPhone] = useState<string>("");
    const getAdministratorPhone = useCallback(async () => {
        return await axios.get(`${process.env.API_URL}/general?get=whatsapp`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { phone } = res.data as { phone: string };
                    const formattedPhone = `https://wa.me/${phone.charAt(0).replace('0', '62')}` + phone.slice(1);
                    setPhone(formattedPhone);
                }
            })
    }, [])

    useEffect(() => {
        getAdministratorPhone();
    }, [getAdministratorPhone]);

    return <div className="p-4 bg-green-500 text-white rounded-full fixed bottom-8 right-8 flex items-center gap-4 cursor-pointer group" onClick={() => route.push(phone)}>
        <span className="hidden md:group-hover:flex">Butuh Bantuan?</span>
        <WhatsappLogo size={32}/>
    </div>
    // return <div className="absolute right-8 bottom-8">
    //     <div className="relative overflow-hidden rounded-full bg-green-500 transition-all duration-200 hover:w-56 p-2 cursor-pointer flex items-center justify-end group text-white">
    //         <div className="absolute right-4 flex items-center font-semibold text-lg opacity-0 transform translate-x-4 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-10 whitespace-nowrap">
    //             <span>Butuh Bantuan?</span>
    //         </div>
    //         <div className="flex items-center justify-center w-14 h-14">
    //             <WhatsappLogo size={32} />
    //         </div>
    //     </div>
    // </div>
}