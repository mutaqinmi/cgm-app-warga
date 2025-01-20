'use client';
import NavigationBar from "@/components/navigation-bar";
import { CaretRight, Check, Eye, EyeSlash, Pencil } from "@phosphor-icons/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import { create } from "zustand";
import * as schema from "@/database/schema";
import Form from "next/form";
import WhatsAppShortcut from "@/components/whatsapp-shortcut";
import * as dateConvert from "@/lib/date-converter";

interface ComponentState {
    userData: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[],
    profileSelectedIndex: number,
    showOldPassword: boolean,
    showNewPassword: boolean,
    showConfirmPassword: boolean,
    showEditPhone: boolean,
    setUserData: (data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => void,
    setProfileSelectedIndex: (index: number) => void,
    setShowOldPassword: (show: boolean) => void,
    setShowNewPassword: (show: boolean) => void,
    setShowConfirmPassword: (show: boolean) => void,
    setShowEditPhone: (show: boolean) => void,
}

const useComponent = create<ComponentState>((set) => {
    return {
        userData: [],
        profileSelectedIndex: 0,
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
        showEditPhone: false,
        setUserData: (data) => set({ userData: data }),
        setProfileSelectedIndex: (index) => set({ profileSelectedIndex: index }),
        setShowOldPassword: (show) => set({ showOldPassword: show }),
        setShowNewPassword: (show) => set({ showNewPassword: show }),
        setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
        setShowEditPhone: (show) => set({ showEditPhone: show }),
    }
})

export default function Tentang(){
    const component = useComponent();

    const refresh = useCallback(() => {
        if(typeof window !== 'undefined'){
            const user_id = localStorage.getItem("user_id");
            getUserData(parseInt(user_id!));
        }
    }, []);

    const getUserData = useCallback(async (user_id: number) => {
        return await axios.get(`${process.env.API_URL}/warga?user_id=${user_id}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setUserData(data);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
    }, []);

    const updateUserPhone = useCallback(async (user_id: number, phone: string) => {
        return await axios.patch(`${process.env.API_URL}/warga?edit=phone`, { user_id, phone }, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    refresh();
                    component.setShowEditPhone(false);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
    }, [refresh]);

    const updateUserPassword = useCallback(async (user_id: number, old_password: string, new_password: string) => {
        return await axios.patch(`${process.env.API_URL}/warga?edit=password`, { user_id, old_password, new_password }, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    refresh();
                    location.reload();
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                alert(message);
            })
    }, [refresh]);

    const updatePhoneHandler = (e: React.FormEvent<HTMLFormElement>) => {e.preventDefault(); updateUserPhone(e.currentTarget.user_id.value, e.currentTarget.phone.value);}
    const updatePasswordHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(e.currentTarget.new_password.value !== e.currentTarget.confirm_password.value){
            e.currentTarget.confirm_password.setCustomValidity("Kata Sandi tidak cocok");
            return;
        }

        updateUserPassword(e.currentTarget.user_id.value, e.currentTarget.old_password.value, e.currentTarget.new_password.value);
    }

    useEffect(() => {
        refresh();
    }, [refresh]);

    return <NavigationBar sidebarIndex={2}>
        {!component.userData.length ? <div className="w-full h-screen flex flex-col gap-8 justify-center items-center text-center">
            <span>Iuran bulan {dateConvert.toString(`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`)} belum diatur oleh Admin. Segera hubungi Admin untuk bantuan.</span>
        </div> : <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 flex flex-col gap-8 rounded-lg p-4 h-fit bg-white">
                <ul>
                    <li className={`flex justify-between items-center gap-4 p-3 cursor-pointer ${component.profileSelectedIndex === 0 ? 'font-semibold' : 'font-normal'}`} onClick={() => component.setProfileSelectedIndex(0)}>
                        <span>Profil</span>
                        {component.profileSelectedIndex === 0 ? <CaretRight/> : null}
                    </li>
                    <li className={`flex justify-between items-center gap-4 p-3 cursor-pointer ${component.profileSelectedIndex === 1 ? 'font-semibold' : 'font-normal'}`} onClick={() => component.setProfileSelectedIndex(1)}>
                        <span>Ubah Kata Sandi</span>
                        {component.profileSelectedIndex === 1 ? <CaretRight/> : null}
                    </li>
                </ul>
            </div>
            <div className="col-span-1 md:col-span-3 p-4 h-fit bg-white flex flex-col gap-4 rounded-lg">
                {component.profileSelectedIndex === 0 ? <>
                    <h1 className="text-2xl font-semibold">Profil</h1>
                    <div>
                        <h2 className="font-semibold">Nama</h2>
                        <span>{component.userData[0]?.name}</span>
                    </div>
                    <div>
                        <h2 className="font-semibold">Alamat</h2>
                        <span>{component.userData[0]?.address}</span>
                    </div>
                    <div>
                        <h2 className="font-semibold">Domisili</h2>
                        <span>RT. {component.userData[0]?.rt}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold">No. Telepon</h2>
                        <div className="flex gap-2 items-center">
                            {component.showEditPhone ? <Form action={''} className="flex gap-2 items-center" formMethod="POST" onSubmit={updatePhoneHandler}>
                                <input type="hidden" name="user_id" id="user_id" defaultValue={component.userData[0]?.user_id!} />
                                <input type="tel" name="phone" id="phone" className="w-full px-3 p-2 border border-slate-400 outline-none rounded-lg" defaultValue={component.userData[0]?.phone!}/>
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg flex gap-2 items-center">
                                    <Check/>
                                </button>
                            </Form> :
                            <div className="flex gap-2 items-center">
                                <span>{component.userData[0]?.phone}</span>
                                <button className="p-2 bg-blue-500 text-white rounded-lg flex gap-2 items-center" onClick={() => component.setShowEditPhone(true)}>
                                    <span className="text-xs">Edit</span>
                                    <Pencil/>
                                </button>
                            </div>}
                        </div>
                    </div>
                </> : <>
                    <h1 className="text-2xl font-semibold">Ubah Kata Sandi</h1>
                    <Form action={''} formMethod="POST" onSubmit={updatePasswordHandler} className="flex flex-col gap-4">
                        <input type="hidden" name="user_id" defaultValue={component.userData[0]?.user_id!}/>
                        <div className="relative">
                            <input type={component.showOldPassword ? 'text' : 'password'} name="old_password" id="old_password" placeholder="Masukkan Kata Sandi Lama" className="w-full px-3 p-2 border border-slate-400 outline-none rounded-lg" />
                            {component.showOldPassword ? <Eye className="absolute top-1/2 -translate-y-1/2 right-4" onClick={() => component.setShowOldPassword(false)}/> : <EyeSlash className="absolute top-1/2 -translate-y-1/2 right-4" onClick={() => component.setShowOldPassword(true)}/>}
                        </div>
                        <div className="w-full h-[0.5px] bg-gray-500 bg-opacity-50 my-2"></div>
                        <div className="relative">
                            <input type={component.showNewPassword ? 'text' : 'password'} name="new_password" id="new_password" placeholder="Masukkan Kata Sandi Baru" className="w-full px-3 p-2 border border-slate-400 outline-none rounded-lg" />
                            {component.showNewPassword ? <Eye className="absolute top-1/2 -translate-y-1/2 right-4" onClick={() => component.setShowNewPassword(false)}/> : <EyeSlash className="absolute top-1/2 -translate-y-1/2 right-4" onClick={() => component.setShowNewPassword(true)}/>}
                        </div>
                        <div className="relative">
                            <input type={component.showConfirmPassword ? 'text' : 'password'} name="confirm_password" id="confirm_password" placeholder="Konfirmasi Kata Sandi" className="w-full px-3 p-2 border border-slate-400 outline-none rounded-lg" />
                            {component.showConfirmPassword ? <Eye className="absolute top-1/2 -translate-y-1/2 right-4" onClick={() => component.setShowConfirmPassword(false)}/> : <EyeSlash className="absolute top-1/2 -translate-y-1/2 right-4" onClick={() => component.setShowConfirmPassword(true)}/>}
                        </div>
                        <button type="submit" className="p-3 bg-blue-500 text-white rounded-lg">Ubah Kata Sandi</button>
                    </Form>
                </>}
            </div>
        </div>}
        <WhatsAppShortcut/>
    </NavigationBar>
}