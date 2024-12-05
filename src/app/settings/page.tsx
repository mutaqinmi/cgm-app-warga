'use client';
import NavigationBar from "@/components/navigation-bar";
import WhatsAppShortcut from "@/components/whatsapp-shortcut";

export default function Page(){
    return <NavigationBar sidebarIndex={2}>
        <h1>Hello, World!</h1>
        <WhatsAppShortcut/>
    </NavigationBar>
}