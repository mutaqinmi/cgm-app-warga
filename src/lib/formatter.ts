/**
 * This method is used for converting string to formatted currency in Rupiah
 */

export default function numberFormatter(value: string | null){
    if(!value) return 'Rp. 0';
    return 'Rp. ' + value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}