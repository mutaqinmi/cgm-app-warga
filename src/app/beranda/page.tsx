'use client';
import ChoiceChip from "@/components/choice-chip";
import Container from "@/components/container";
import FeeListItem from "@/components/fee-list-item";
import NavigationBar from "@/components/navigation-bar";
import UnpaidTransaction from "@/components/unpaid-transaction";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { create } from "zustand";
import * as schema from '@/database/schema';
import numberFormatter from "@/lib/formatter";
import LoadingAnimation from "@/components/loading-animation";
import PaginationWidget from "@/components/pagination";
import * as dateConvert from "@/lib/date-converter";
import StatusChip from "@/components/status-chip";
import { CaretRight } from "@phosphor-icons/react";
import PaymentPopup from "@/components/payment-popup";
import WhatsAppShortcut from "@/components/whatsapp-shortcut";

interface ComponentState {
    userData: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[],
    paymentsList: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[],
    undonePayments: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[],
    monthList: string[],
    showContextMenu: boolean,
    filterStatusIndex: number,
    showEditUserPopup: boolean,
    showPaymentPopup: boolean,
    selectedPaymentID: number,
    feeList: schema.feesType[],
    feeListPagination: number,
    feesCount: number,
    setUserData: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => void,
    setPaymentsList: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => void,
    setUndonePayments: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => void,
    setMonthList: (value: string[]) => void,
    setShowContextMenu: (value: boolean) => void,
    setFilterStatusIndex: (value: number) => void,
    setShowEditUserPopup: (value: boolean) => void,
    setShowPaymentPopup: (data: boolean) => void,
    setSelectedPaymentID: (data: number) => void,
    setFeeList: (feeList: schema.feesType[]) => void,
    setFeeListPagination: (feeListPagination: number) => void,
    setFeesCount: (feesCount: number) => void,
}

const useComponent = create<ComponentState>((set) => {
    return {
        userData: [],
        paymentsList: [],
        undonePayments: [],
        undonePaymentsCount: 0,
        undonePaymentsPagination: 1,
        monthList: [],
        showContextMenu: false,
        filterStatusIndex: 0,
        showEditUserPopup: false,
        showPaymentPopup: false,
        selectedPaymentID: 0,
        feeList: [],
        feeListPagination: 1,
        feesCount: 0,
        setUserData: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => set({ userData: value }),
        setPaymentsList: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => set({ paymentsList: value }),
        setUndonePayments: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => set({ undonePayments: value }),
        setMonthList: (value: string[]) => set({ monthList: value }),
        setShowContextMenu: (value: boolean) => set({ showContextMenu: value }),
        setFilterStatusIndex: (value: number) => set({ filterStatusIndex: value }),
        setShowEditUserPopup: (value: boolean) => set({ showEditUserPopup: value }),
        setShowPaymentPopup: (data) => set(() => ({ showPaymentPopup: data })),
        setSelectedPaymentID: (data) => set(() => ({ selectedPaymentID: data })),
        setFeeList: (feeList: schema.feesType[]) => set(() => ({ feeList: feeList })),
        setFeeListPagination: (feeListPagination: number) => set(() => ({ feeListPagination: feeListPagination })),
        setFeesCount: (feesCount: number) => set(() => ({ feesCount: feesCount })),
    }
})

export default function Page(){
    const component = useComponent();
    const route = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getUserData = useCallback(async (user_id: number) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/warga?user_id=${user_id}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setUserData(data);
                    component.setPaymentsList(data);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getUndonePaymentsFilteredData = useCallback(async (user_id: number) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/warga/fees?user_id=${user_id}&filtered=true`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setUndonePayments(data);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getStatusFilteredData = useCallback(async (user_id: number, status: string) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/warga/fees?user_id=${user_id}&status=${status}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setPaymentsList(data);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getAllFees = useCallback(async (pagination: number) => {    
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/warga/fees?page=${pagination}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data, count } = res.data as { data: schema.feesType[], count: number };
                    component.setFeeList(data);
                    component.setFeesCount(count);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getFeeByMonth = useCallback(async (month: string, year: string) => {        
        if(month === '' || year === '') return getAllFees(component.feeListPagination);
        
        return await axios.get(`${process.env.API_URL}/warga/fees?month=${month}&year=${year}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: schema.feesType[] };
                    component.setFeeList(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
    }, [getAllFees]);

    const getHistoryByDate = useCallback(async (user_id: number, date: string) => {
        return await axios.get(`${process.env.API_URL}/warga?user_id=${user_id}&date=${date}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setPaymentsList(data);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
    }, []);

    const totalUndoneAmount = component.undonePayments.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.fees.fee_amount!;
    }, 0);

    const groupByYear = (data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => {
        return data.reduce((acc, item) => {
            const year = item.fees.fee_date!.split('-')[0];
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(item);
            return acc;
        }, {} as { [key: string]: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] });
    };

    const groupData = groupByYear(component.paymentsList);
    const StatusFilteredDataHandler = (user_id: number, status: string) => {
        if(status === 'Semua'){
            return getUserData(user_id);
        }

        return getStatusFilteredData(user_id, status);
    };
    const dateFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => getFeeByMonth(e.currentTarget.value.split('-')[1], e.currentTarget.value.split('-')[0]);
    const feeListPaginationHandler = (pagination: number) => getAllFees(pagination);
    const paymentStatus = (status: string) => {
        if(status === 'done') return 'bg-green-500';
        if(status === 'pending') return 'bg-yellow-500';
        if(status === 'undone') return 'bg-red-500';
    }
    const dateHistoryFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => getHistoryByDate(component.userData[0].user_id, e.currentTarget.value);

    const refresh = useCallback(() => {
        if(typeof window !== 'undefined'){
            const user_id = localStorage.getItem("user_id");

            getUserData(parseInt(user_id!));
            getUndonePaymentsFilteredData(parseInt(user_id!));
            getAllFees(component.feeListPagination);
        }
    }, [getUserData, getUndonePaymentsFilteredData, getAllFees])
 
    useEffect(() => {
        refresh();
    }, [refresh]);
        
    return isLoading ? <LoadingAnimation/> : component.userData ? <NavigationBar sidebarIndex={0}>
        {!component.userData.length ? <div className="w-full h-screen flex flex-col gap-8 justify-center items-center text-center">
            <span>Iuran bulan {dateConvert.toString(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`)} belum diatur oleh Admin. Segera hubungi Admin untuk bantuan.</span>
        </div> : <>
            {/* <div className="w-full mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <Card title="Iuran Bulan Ini" header="Rp. 55000" subtitle={<StatusChip status={component.userData[0]?.payments.payment_description!}/>} className="col-span-2 md:col-span-1"/>
                <Card title="Iuran Lunas" header="8 Bulan" subtitle="2 bulan tersisa"/>
                <Card title="Iuran Belum Lunas" header="2 Bulan" subtitle="Rp. 110.000"/>
            </div> */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="col-span-1 md:col-span-3 flex flex-col gap-8">
                    <div className={`rounded-lg pt-4 ${paymentStatus(component.userData[0]?.payments.payment_description!)}`}>
                        <div className="mb-3 flex gap-2 px-4 text-white">
                            <h1>Iuran Bulan {dateConvert.toString(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`)}</h1>
                            <span className="leading-none">&#8226;</span>
                            <StatusChip status={component.userData[0]?.payments.payment_description!}/>
                        </div>
                        <Container className="flex justify-between items-center cursor-pointer" onClick={() => component.setShowPaymentPopup(true)}>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">Nominal Iuran</span>
                                <span className="font-semibold text-3xl">{numberFormatter(component.userData[0]?.fees.fee_amount?.toString()!)}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                {component.userData[0]?.payments.payment_description === 'undone' ? <span className="text-gray-500">Tandai Lunas</span> : null}
                                <CaretRight/>
                            </div>
                        </Container>
                    </div>
                    <Container>
                        <div className="flex justify-between items-center">
                            <h1 className="text-lg font-semibold">Riwayat Iuran</h1>
                            <input type="month" className="[&::-webkit-datetime-edit]:text-sm [&::-webkit-calendar-picker-indicator]:invert-[1] p-2 bg-blue-500 rounded-md text-white outline-none" name="filter_fee_history" defaultValue={`${new Date().getFullYear()}-${new Date().getMonth() + 1}`} onChange={dateHistoryFilterHandler}/>
                        </div>
                        <div className="flex gap-2 my-4 items-center">
                            <ChoiceChip label="Semua" active={component.filterStatusIndex === 0} onClick={() => {component.setFilterStatusIndex(0); StatusFilteredDataHandler(component.userData[0]?.user_id, 'Semua')}}/>
                            <ChoiceChip label="Lunas" active={component.filterStatusIndex === 1} onClick={() => {component.setFilterStatusIndex(1); StatusFilteredDataHandler(component.userData[0]?.user_id, 'done')}}/>
                            <ChoiceChip label="Belum Lunas" active={component.filterStatusIndex === 2} onClick={() => {component.setFilterStatusIndex(2); StatusFilteredDataHandler(component.userData[0]?.user_id, 'undone')}}/>
                        </div>
                        <div className="flex flex-col-reverse gap-2 mt-4">
                            {Object.keys(groupData).map((year: string, index: number) => {
                                return <div key={index} className="flex flex-col gap-2">
                                    <h1 className="font-semibold text-lg my-2 text-gray-500">{year}</h1>
                                    {groupData[year].map((item: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}, index: number) => {
                                        return <FeeListItem key={index} month={item.fees.fee_date!} onClick={() => {component.setSelectedPaymentID(item.payments.payment_id); component.setShowPaymentPopup(true)}}/>
                                    })}
                                </div>
                            })}
                        </div>
                    </Container>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
                    <Container>
                        <h1 className="font-semibold text-lg">Iuran Belum Lunas</h1>
                        <div className="w-full flex justify-center items-center mt-4 gap-1">
                            {totalUndoneAmount !== 0 ? <span className="font-bold text-3xl">{numberFormatter(totalUndoneAmount.toString())}</span> : <span className="text-sm italic text-gray-500 my-4">Semua iuran sudah lunas.</span>}
                        </div>
                        {component.undonePayments.length ? <div className="mt-8 flex flex-col gap-4">
                            {component.undonePayments.map((item: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}, index: number) => {
                                return <UnpaidTransaction key={index} month={item.fees.fee_date!} status="Belum Lunas" onClick={() => {component.setSelectedPaymentID(item.payments.payment_id); component.setShowPaymentPopup(true)}}/>
                            })}
                        </div> : null}
                    </Container>
                    <Container>
                        <div className="flex justify-between items-center">
                            <h1 className="text-lg font-semibold">Rekapan Iuran Bulanan</h1>
                            <input type="month" name="month" id="month" onChange={dateFilterHandler} className="bg-blue-500 text-white [&::-webkit-calendar-picker-indicator]:invert-[1] outline-none p-2 rounded-md [&::-webkit-datetime-edit]:text-sm" defaultValue={`${new Date().getFullYear()}-${new Date().getMonth() + 1}`}/>
                        </div>
                        <div className="mt-8 flex flex-col gap-4">
                            {component.feeList.map((fee: schema.feesType) => {
                                return <FeeListItem key={fee.fee_id} month={fee.fee_date!} onClick={() => route.push(`/iuran?fee_id=${fee.fee_id}`)}/>
                            })}
                        </div>
                        <PaginationWidget currentPage={component.feeListPagination} totalPage={Math.ceil(component.feesCount / 10)} onClickNext={() => {if(component.feeListPagination >= Math.ceil(component.feesCount / 10)) return; component.setFeeListPagination(component.feeListPagination + 1); feeListPaginationHandler(component.feeListPagination + 1)}} onClickPrev={() => {if(component.feeListPagination <= 1) return; component.setFeeListPagination(component.feeListPagination - 1); feeListPaginationHandler(component.feeListPagination - 1)}}/>
                    </Container>
                </div>
            </div>
        </>}
        <WhatsAppShortcut/>
        {component.showPaymentPopup ? <PaymentPopup popupHandler={component.setShowPaymentPopup} payment_id={component.userData[0]?.payments.payment_id!} payment_status={component.userData[0]?.payments.payment_description!} refresh={refresh}/> : null}
    </NavigationBar> : null;
}